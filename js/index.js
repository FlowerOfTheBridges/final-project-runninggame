Physijs.scripts.worker = 'js/libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var controls, soundtrack = null;
var gameOver = false;
var isJump = false;

var round = 0;
var score = 0;
var update, currentScenario = null;

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

function init() {
    sound.addEventListener("fileload", startSoundtrack);
    sound.registerSound("resources/audio/soundtrack.ogg", 'soundtrack');
    sound.registerSound("resources/audio/money.ogg", 'money');
    sound.registerSound("resources/audio/hit.ogg", 'hit');
    sound.registerSound("resources/audio/scream.ogg", 'scream');
    sound.registerSound("resources/audio/footstep.ogg", 'footstep');
    sound.registerSound("resources/audio/jump.ogg", 'jump');

    createCar();
    createCoin();
    createLamp();
    createTree();
    createRock();
    createTruck();
}

function getHighScores() {
    let highScores = JSON.parse(sessionStorage.getItem("highScores"));

    if (highScores != null) {
        if (highScores['forest'] != null) {
            document.getElementById("forestHighScore").innerHTML = highScores['forest'];
        }

        if (highScores['city'] != null) {
            document.getElementById("cityHighScore").innerHTML = highScores['city'];
        }
    }
}

function start(scenario) {

    gameOver = false;
    document.getElementById("menu").hidden = true;


    loadCharacter(scene, run, collisionCallback);

    scene.setGravity(new THREE.Vector3(0, 0, Z_SPEED));
    camera.position.set(0, CAMERA_Y, CAMERA_Z);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    let scoreDom = document.createElement('div');
    scoreDom.style.position = 'absolute';
    scoreDom.style.top = 10 + 'px';
    scoreDom.style.right = 10 + 'px';
    let coinImage = document.createElement('img');
    coinImage.src = 'resources/textures/coin.png';
    coinImage.setAttribute("width", 50);
    coinImage.setAttribute("height", 50);
    scoreDom.appendChild(coinImage);
    let coinCount = document.createElement('p');
    coinCount.style.font = "italic bold 40px arial,serif";
    coinCount.style.fontSize = 'xx-large';
    coinCount.style.color = 'white';
    coinCount.id = "coinCount";
    coinCount.innerText = "0";
    scoreDom.appendChild(coinCount)
    document.body.appendChild(scoreDom);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);


    switch (scenario) {
        case 'city':
            createCityScenario(scene, renderer.capabilities.getMaxAnisotropy());
            update = function (time) {
                updateCars(time);
                updateCoins(time);
                updateBuildings();
                updateLamps();
                updateTrucks();
            };
            break;
        case 'forest':
            createForestScenario(scene, renderer.capabilities.getMaxAnisotropy());
            update = function (time) {
                updateTrees();
                updateRocks(time);
                updateGazelles();
                updateCoins(time);
            };
            break;
    }

    currentScenario = scenario;

    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createPointLigth(0xff4422, 1, [-2, 1, 3], IS_DEBUG);
    createPointLigth(0xff4422, 1, [2, 1, 3], IS_DEBUG);
    createDirectionalLigth(0xFFFFFF, 1, [0, 10, 10],
        { cast: true, top: 2, bottom: -2, left: -2, right: 2, near: 0.1, far: 40 }, scene, IS_DEBUG);

    document.addEventListener(
        'keydown',
        function (ev) {
            !gameOver && moveCharacter(ev.keyCode);
        }
    );

    IS_DEBUG && document.body.appendChild(stats.dom);

    animate();
}

function restart() {
    location.reload();
}

function startSoundtrack(event) {
    if (!IS_DEBUG && event.id == "soundtrack") {
        soundtrack = sound.play(event.src);
    }
}


function animate() {

    let time = - performance.now() / 1000;

    if (!gameOver) {
        scene.simulate(); // run physics
        update(time);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    IS_DEBUG && stats.update();
    TWEEN.update();
}

function showGameOver() {
    document.getElementById('gameOverCoins').innerHTML = score;

    let highScores = JSON.parse(sessionStorage.getItem("highScores"));
    if (highScores != null) {
        if (highScores[currentScenario] != null && score > highScores[currentScenario]) {
            highScores[currentScenario] = score;
            sessionStorage.setItem('highScores', JSON.stringify(highScores));
        }
    }
    else {
        highScores = {};
        highScores[currentScenario] = score;
        sessionStorage.setItem('highScores', JSON.stringify(highScores));
    }
    //$("#gameOverModal").modal();
}
function moveCharacter(keyCode) {
    switch (keyCode) {
        case 37:
            // Left
            if (skeleton.bones[0].position.x < GAME_BORDER && !isJump) {
                skeleton.bones[0].position.x += MOVING_SPEED;
                playerBox.position.set(playerBox.position.x + (0.010 * MOVING_SPEED), playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x + (0.010 * MOVING_SPEED), CAMERA_Y, CAMERA_Z);
            }
            break;
        case 39:
            // Right
            if (skeleton.bones[0].position.x > -GAME_BORDER && !isJump) {

                playerBox.position.set(playerBox.position.x - (0.010 * MOVING_SPEED), playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x - (0.010 * MOVING_SPEED), CAMERA_Y, CAMERA_Z);
                skeleton.bones[0].position.x -= MOVING_SPEED;
            }
            break;
        case 38:
            //up 
            !isJump && jump(camera);
            break;
    }
}

function collisionCallback(otherObject, relativeVelocity, relativeRotation, contactNormal) {

    console.log("%o has collided with %o with an impact speed of %o  and a rotational force of %o and at normal %o", this, otherObject, relativeVelocity, relativeRotation, contactNormal);
    if (!otherObject.name.includes("coin")) {
        sound.play('hit');
        clearInterval(objectInterval);
        clearInterval(groundInterval);
        stopAnimation(runTween);
        collision();
        sound.play('scream');
        if(otherObject.name.includes("car")){
            carCollision(scene.getObjectByName(otherObject.name+"_model"));
        }
        if(otherObject.name.includes("lamp")){
            lampCollision(scene.getObjectByName(otherObject.name+"_model"));
        }
        gameOver = true;
        soundtrack.stop();
        !IS_DEBUG && showGameOver();
    }
    else {
        score++;
        document.getElementById("coinCount").innerHTML = score;
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