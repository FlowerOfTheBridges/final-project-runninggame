Physijs.scripts.worker = 'js/libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var controls, soundtrack = null;
var gameOver = false;
var objectInterval, groundInterval = null;
var cars = [];
var coins = [];
var buildings = [];
var lamps = [];
var trees = [];
var rocks = [];
var parrotts = [];

var isJump = false;

var round = 0;

const scene = new Physijs.Scene;
const stats = new Stats();
const sound = createjs.Sound;

const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

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
    createParrott();
    loadCharacter(scene, run, collision);

    scene.setGravity(new THREE.Vector3(0, 0, Z_SPEED));
    camera.position.set(0, 2, -6);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    createCityScenario(scene, renderer.capabilities.getMaxAnisotropy());
    //createForestScenario(scene, renderer.capabilities.getMaxAnisotropy());

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
    document.body.appendChild(stats.dom);
}

function startSoundtrack(event) {
    if(!IS_DEBUG && event.id == "soundtrack"){
        soundtrack = sound.play(event.src);
    }
}


function animate() {

    let time = - performance.now() / 1000;

    if (!gameOver) {
        scene.simulate(); // run physics
        updateCars(time);
        updateCoins(time);
        updateBuildings();
        updateTrees();
        updateLamps();
        updateRocks(time);
        updateParrotts();
    }


    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    stats.update();
    TWEEN.update();
}

function updateCars(wheelRotation) {
    cars.forEach((car, index) => {
        if (playerBox.position.z - 15 <= car.box.position.z) {
            car.model.position.z = car.box.position.z;
            car.box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            car.box.getLinearVelocity().x!=0 && car.box.setLinearVelocity(new THREE.Vector3(0, 0, car.box.getLinearVelocity().z));
        }
        else {
            scene.remove(car.model);
            scene.remove(car.box);
            cars.splice(index, 1);
            console.log("car avoided! cars are ", cars);
        }

        car.wheels.forEach(wheel => {
            wheel.rotation.x = wheelRotation * Math.PI;
        });
    })
}

function updateCoins(rotationTime) {
    coins.forEach((coin, index) => {
        coin.rotation.y = rotationTime * Math.PI;
        if (playerBox.position.z - 5 >= coin.position.z) {
            scene.remove(coin);
            coins.splice(index, 1);
            console.log("coin missed! coins are ", coins);
        }
    })
}

function updateBuildings() {
    buildings.forEach((building, index) => {
        if (playerBox.position.z - 10 >= building.position.z) {
            scene.remove(building);
            cars.splice(index, 1);
            console.log("building removed! buildings are ", buildings);
        }
    })
}

function updateLamps() {
    lamps.forEach((lamp, index) => {
        if (playerBox.position.z - 10 >= lamp.model.position.z) {
            scene.remove(lamp.model);
            lamps.splice(index, 1);
            console.log("lamp removed! lamps are ", lamps);
        }
        else{
            lamp.model.position.z = lamp.box.position.z - 0.47;
        }
    })
}

function updateTrees() {
    trees.forEach((tree, index) => {
        if (playerBox.position.z - 10 >= tree.model.position.z) {
            scene.remove(tree.model);
            trees.splice(index, 1);
            console.log("tree removed! trees are ", trees);
        }
        else{
            tree.model.position.z = tree.box.position.z - 0.47;
        }
    })
}

function updateRocks(rotation) {
    rocks.forEach((rock, index) => {
        if (playerBox.position.z - 15 > rock.position.z) {
            scene.remove(rock);
            rocks.splice(index, 1);
            console.log("rock avoided! rocks are ", rocks);
        }

        rock.rotation.x = rotation * Math.PI;
        rock.rotation.y = rotation * Math.PI;
        
    })
}

function updateParrotts() {
    parrotts.forEach((parrott, index) => {
        if (playerBox.position.z - 15 <= parrott.box.position.z) {
            parrott.model.position.z = parrott.box.position.z;
            parrott.box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            parrott.box.getLinearVelocity().x!=0 && parrott.box.setLinearVelocity(new THREE.Vector3(0, 0, parrott.box.getLinearVelocity().z));
        }
        else {
            scene.remove(parrott.model);
            scene.remove(parrott.box);
            parrotts.splice(index, 1);
            console.log("parrott avoided! parrotts are ", parrotts);
        }
    })
}

function moveCharacter(keyCode) {
    switch (keyCode) {
        case 37:
            // Left
            if (skeleton.bones[0].position.x < GAME_BORDER && !isJump) {
                skeleton.bones[0].position.x += MOVING_SPEED;
                playerBox.position.set(playerBox.position.x + (0.010 * MOVING_SPEED), playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x + (0.010 * MOVING_SPEED), 2, -6);
            }
            break;
        case 39:
            // Right
            if (skeleton.bones[0].position.x > -GAME_BORDER && !isJump) {

                playerBox.position.set(playerBox.position.x - (0.010 * MOVING_SPEED), playerBox.position.y, 0);
                playerBox.__dirtyPosition = true;
                camera.position.set(camera.position.x - (0.010 * MOVING_SPEED), 2, -6);
                skeleton.bones[0].position.x -= MOVING_SPEED;
            }
            break;
        case 38:
            //up 
            !isJump && jump();
            break;
    }
}

init();
animate();