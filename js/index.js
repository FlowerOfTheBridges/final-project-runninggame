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
var update, currentScenario, lastHit = null;

const scene = new Physijs.Scene;
const stats = IS_DEBUG ? new Stats() : null;
const sound = createjs.Sound;
const textureLoader = new THREE.TextureLoader();


const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);


window.onload = function () {
    getHighScores();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

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

}

function init() {
    loadSounds();
}

function checkAssets(numberOfAssets, condition) {
    if (assetsLoaded != numberOfAssets) {
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

function start(scenario) {
    createCoin();
    createBag();
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
                let startCondition = defaultTree != null && rockGeometry != null && coinGeometry!=null && bag != null && player != null && playerBox != null;
                checkAssets(5, startCondition);
            }, 1000);
            break;
    }

    

    gameOver = false;
    let dayTime = getDayTime(scenario);
    loadCharacter(scene, run, collisionCallback);

    scene.setGravity(new THREE.Vector3(0, 0, Z_SPEED));
    camera.position.set(0, CAMERA_Y, CAMERA_Z);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    createUI();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);


    switch (scenario) {
        case 'city':
            createCityScenario(scene, dayTime, renderer.capabilities.getMaxAnisotropy());
            update = function (time) {
                updateCars(time);
                updateCoins(time);
                updateBuildings();
                updateLamps();
                updateTrucks();
            };
            break;
        case 'forest':
            createForestScenario(scene, dayTime, renderer.capabilities.getMaxAnisotropy());
            update = function (time) {
                updateRockWalls();
                updateTrees();
                updateRocks(time);
                updateGazelles();
                updateCoins(time);
            };
            break;
    }

    currentScenario = scenario;

    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createPointLigth(0xff4422, 0.5, [-2, 1, 3], IS_DEBUG);
    createPointLigth(0xff4422, 0.5, [2, 1, 3], IS_DEBUG);
    createDirectionalLigth(0xFFFFFF, dayTime == 'morning' ? 0.85 : 2, new THREE.Vector3(0, 5, dayTime == 'morning' ? -10 : 40),
        { cast: true, top: 30, bottom: -30, left: -10, right: 10, near: 1, far: 1000, fov: 100 }, scene, IS_DEBUG);

    IS_DEBUG && document.body.appendChild(stats.dom);

    animate();
}

function restart() {
    location.reload();
}

function startSoundtrack(event) {
    if (event.id == "soundtrack") {
        soundtrack = sound.play(event.src);
    }
}


function animate() {

    requestAnimationFrame(animate);
    let time = - performance.now() / 1000;

    if (!gameOver) {
        scene.simulate(); // run physics
        update(time);
    }

    renderer.render(scene, camera);

    IS_DEBUG && stats.update();
    TWEEN.update();
}

function updateBag() {
    let bag = player.children[1];
    let newBag = bag.clone();
    dropBag(bag);
    lifeCount != 0 && setTimeout(() => { player.add(newBag) }, 300);
}

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
            //up 
            !isJump && jump(camera);
            break;
    }
}

function collisionCallback(otherObject, relativeVelocity, relativeRotation, contactNormal) {
    IS_DEBUG && console.log("%o has collided with %o with an impact speed of %o  and a rotational force of %o and at normal %o", this, otherObject, relativeVelocity, relativeRotation, contactNormal);
    if (!otherObject.name.includes("coin")) {
        sound.play('hit');
        if ((lastHit != null && otherObject.uuid != lastHit) || !lastHit) {
            if (lifeCount == 0) {
                clearInterval(objectInterval);
                clearInterval(groundInterval);
                stopAnimation(runTween);
                collision();
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
            if (currentScenario == 'forest') {
                gazelles.forEach(gazelle => {
                    stopAnimation(gazelle.tweens);
                })
            }
            if (otherObject.name.includes("car")) {
                carCollision(scene.getObjectByName(otherObject.name + "_model"));
                sound.play('car_crash');
            }
            else if (otherObject.name.includes("lamp")) {
                lampCollision(scene.getObjectByName(otherObject.name + "_model"));
                sound.play('lamp');
            }
            else if (otherObject.name.includes("tree")) {
                treeCollision(scene.getObjectByName(otherObject.name + "_model"));
                sound.play('tree');
            }
            else if (otherObject.name.includes("gazelle")) {
                gazelleCollision(scene.getObjectByName(otherObject.name + "_model"));
                sound.play('gazelle');
            }
        }
        else {
            console.log("same object has before...ignore")
        }
        lastHit = otherObject.uuid;

    }
    else {
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