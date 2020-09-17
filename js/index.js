Physijs.scripts.worker = 'js/libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var controls, soundtrack = null;
var gameOver = false;
var isJump = false;
var isGameReady = false;
var assetsLoaded = 0;
var gameCheckInterval = null;

var round = 0;
var score = 0;
var lifeCount = 3;
var updateScenario, currentScenario, lastHit = null;

const scene = new Physijs.Scene;
const stats = new Stats();
const sound = createjs.Sound;
const textureLoader = new THREE.TextureLoader();


const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

/**
 * after menu page is loaded, get high scores
 */
window.onload = function () {
    getHighScores();
}

/**
 * callback used whenever the page is resized by the user
 */
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

/**
 * load all the sound within the application
 */
function loadSounds() {
    sound.addEventListener("fileload", startSoundtrack);
    sound.registerSound("resources/audio/soundtrack.ogg", 'soundtrack');
    sound.registerSound("resources/audio/money.ogg", 'money');
    sound.registerSound("resources/audio/hit.ogg", 'hit');
    sound.registerSound("resources/audio/scream.ogg", 'scream');
    sound.registerSound("resources/audio/footstep.ogg", 'footstep');
    sound.registerSound("resources/audio/jump.ogg", 'jump');
    sound.registerSound("resources/audio/tree.ogg", 'tree');
    sound.registerSound("resources/audio/car_crash.ogg", 'car_crash');
    sound.registerSound("resources/audio/lamp.ogg", 'lamp');
    sound.registerSound("resources/audio/gazelle.ogg", 'gazelle');
    sound.registerSound("resources/audio/game_over.ogg", 'game_over');

}

/** 
 * function called to init the page
 */
function init() {
    loadSounds();
}

/**
 * check whether all the objects are loaded correctly
 * @param {number} numberOfAssets to be loaded
 * @param {boolean} condition that needs to be satisfied before starting the game
 */
function checkAssets(numberOfAssets, condition) {
    if (assetsLoaded < numberOfAssets) {
        updateLoading(assetsLoaded, numberOfAssets);
    }
    else if (condition) {
        addBagToPlayer();
        removeLoading();
        document.addEventListener(
            'keydown',
            function (ev) {
                !gameOver && moveCharacter(ev.keyCode);
            }
        );
        isGameReady = true;
        clearInterval(gameCheckInterval);
    }
    else {
        updateLoading();
    }
}

/**
 * start the game
 * @param {string} scenario the name of the scenario that needs to be created
 */
function start(scenario) {
    createCoin();
    createBag();
    // load models and check whether they are finished
    switch (scenario) {
        case 'city':
            createCar();
            createLamp();
            createTruck();
            gameCheckInterval = setInterval(() => {
                let startCondition = defaultCarModel != null && coinGeometry != null && defaultLamp != null && defaultTruck != null && bag != null && player != null && playerBox != null;
                checkAssets(6, startCondition);
            }, 1000);
            break;
        case 'forest':
            createTree();
            createRock();
            gameCheckInterval = setInterval(() => {
                let startCondition = defaultTree != null && rockGeometry != null && coinGeometry != null && bag != null && player != null && playerBox != null;
                checkAssets(5, startCondition);
            }, 1000);
            break;
    }

    gameOver = false;
    let dayTime = getDayTime(scenario);
    loadCharacter(scene, run, collisionCallback);

    scene.setGravity(new THREE.Vector3(0, 0, Z_SPEED));
    camera.position.set(0, CAMERA_Y, CAMERA_Z);
    // render options
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    createUI();
    // orbit control, to fix the camera around the player
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);


    switch (scenario) {
        case 'city':
            createCityScenario(scene, dayTime);
            // update is a function that will be called within the render function (animate)
            updateScenario = function (time) { // scenario objects update
                updateCars(time);
                updateCoins(time);
                updateBuildings();
                updateLamps();
                updateTrucks();
            };
            break;
        case 'forest':
            createForestScenario(scene, dayTime);
            updateScenario = function (time) { // scenario objects update
                updateRockWalls();
                updateTrees();
                updateRocks(time);
                updateGazelles();
                updateCoins(time);
            };
            break;
    }

    currentScenario = scenario;
    // lights
    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createPointLigth(0xff4422, 0.5, [-2, 1, 3], IS_DEBUG);
    createPointLigth(0xff4422, 0.5, [2, 1, 3], IS_DEBUG);
    createDirectionalLigth(0xFFFFFF, dayTime == 'morning' ? 0.85 : 2, new THREE.Vector3(0, 5, dayTime == 'morning' ? -10 : 40),
        { cast: true, top: 30, bottom: -30, left: -10, right: 10, near: 1, far: 1000, fov: 100 }, scene, IS_DEBUG);

    document.body.appendChild(stats.dom);

    animate();
}

/**
 * restart the game, by refreshing the page
 */
function restart() {
    location.reload();
}
/**
 * start the main soundtrack of the game
 * @param {*} event source of the audio file 
 */
function startSoundtrack(event) {
    if (event.id == "soundtrack") {
        soundtrack = sound.play(event.src);
        soundtrack.volume = 0.1;
    }
}

/**
 * function called on every frame. it renders the scene,
 * updates physics and tweens computation
 */
function animate() {
    stats.begin();
    let time = - performance.now() / 1000; // get rotation speed from performances

    if (!gameOver) {
        scene.simulate(); // run physics
        updateScenario(time);
    }

    renderer.render(scene, camera);
    TWEEN.update();
    stats.update();
    requestAnimationFrame(animate);
}

/**
 * remove the bag from the player whenever an obstacle has been hit
 */
function updateBag() {
    let bag = player.children[1];
    let newBag = bag.clone();
    dropBag(bag); // animation
    lifeCount != 0 && setTimeout(() => { player.add(newBag) }, 300);
}

/**
 * callback attached to the keydown event, it's used to control the 
 * character movement (left, right or jump) across the scene
 * @param {number} keyCode key pressed by the player
 */
function moveCharacter(keyCode) {
    switch (keyCode) {
        case 37:
            // Left
            if (player.position.x < GAME_BORDER && !isJump) {
                player.position.x += MOVING_SPEED;
                playerBox.position.set(playerBox.position.x + MOVING_SPEED, playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x + MOVING_SPEED, CAMERA_Y, CAMERA_Z);
            }
            break;
        case 39:
            // Right
            if (player.position.x > -GAME_BORDER && !isJump) {
                player.position.x -= MOVING_SPEED;
                playerBox.position.set(playerBox.position.x - MOVING_SPEED, playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x - MOVING_SPEED, CAMERA_Y, CAMERA_Z);
            }
            break;
        case 38:
            // Up 
            !isJump && jump(camera); // animation
            break;
    }
}

/**
 * callback attached to the collision event listener of the character's physijs mesh.
 * It checks what type of object has been hit:
 * - if it's a coin, it updates the score
 * - otherwise, it decrements the life count. depending on the model, a different animation may be raised
 * Also, whenever there are the conditions for the game over, the game ends and the ending screen is shown
 * @param {*} otherObject the object hit by the player
 * @param {*} relativeVelocity 
 * @param {*} relativeRotation 
 * @param {*} contactNormal 
 */
function collisionCallback(otherObject, relativeVelocity, relativeRotation, contactNormal) {
    IS_DEBUG && console.log("%o has collided with %o with an impact speed of %o  and a rotational force of %o and at normal %o", this, otherObject, relativeVelocity, relativeRotation, contactNormal);
    if (!otherObject.name.includes("coin")) {
        sound.play('hit');
        if ((lastHit != null && otherObject.uuid != lastHit) || !lastHit) {
            if (lifeCount == 0) {
                clearInterval(objectInterval);
                clearInterval(groundInterval);
                stopAnimation(runTween); // stop run animation
                collision(); // animation

                if (currentScenario == 'forest') { // if scenario is forest, stop all gazelles animation
                    gazelles.forEach(gazelle => {
                        stopAnimation(gazelle.tweens);
                    })
                }
                soundtrack.stop();
                !IS_DEBUG && showGameOver();
                gameOver = true;
            }
            else {
                otherObject.position.z -= (otherObject.name.includes("building") || otherObject.name.includes("tree")) ? 20 : 5;
                otherObject.__dirtyPosition = true;
                removeBag();
                lifeCount--;
                console.log("you have been hit. %d life remainings", lifeCount);
                updateBag();
            }
            sound.play('scream');
            if (otherObject.name.includes("car")) {
                carCollision(scene.getObjectByName(otherObject.name + "_model")); // animation
                sound.play('car_crash');
            }
            else if (otherObject.name.includes("lamp")) {
                lampCollision(scene.getObjectByName(otherObject.name + "_model")); // animation
                sound.play('lamp');
            }
            else if (otherObject.name.includes("tree")) {
                treeCollision(scene.getObjectByName(otherObject.name + "_model")); // animation
                sound.play('tree');
            }
            else if (otherObject.name.includes("gazelle")) {
                gazelleCollision(scene.getObjectByName(otherObject.name + "_model"));
                sound.play('gazelle');
            }
        }
        // if one object is detected multiple times, we ignore it.
        lastHit = otherObject.uuid;

    }
    else { // if a coin has been hit, update the score and remove the coin from the scene
        score++;
        updateScore(score);
        sound.play('money');
        coins.some((coin, index) => {
            if (coin.name == otherObject.name) {
                scene.remove(coin);
                coins.splice(index, 1);
                return true;
            }
        });
    }
}

init();