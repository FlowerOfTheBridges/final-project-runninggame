Physijs.scripts.worker = 'js/libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var controls, soundtrack = null;
var gameOver = false;
var objectInterval, groundInterval = null;
var cars = [];
var coins = [];
var buildings = [];
var defaultCarModel, coinGeometry = null;


var round = 0;

const scene = new Physijs.Scene;
const stats = new Stats();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function init() {
    createjs.Sound.addEventListener("fileload", startSoundtrack);
    createjs.Sound.registerSound("resources/audio/soundtrack.ogg", soundtrack);

    createCar();
    createCoin();
    loadModel(scene, run);
    scene.setGravity(new THREE.Vector3(0, 0, Z_SPEED));
    camera.position.set(0, 2, -4);

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

    createSimpleScenario(scene, renderer.capabilities.getMaxAnisotropy());

    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createPointLigth(0xff4422, 1, [-1,1,3], IS_DEBUG);
    createDirectionalLigth(0xFFFFFF, 1, [0, 10, 10],
        { cast: true, top: 2, bottom: -2, left: -2, right: 2, near: 0.1, far: 40 }, scene, IS_DEBUG);

    
    document.body.appendChild(stats.dom);
}

function startSoundtrack(event) {
    !IS_DEBUG && createjs.Sound.play(event.src);
}


function animate() {

    let time = - performance.now() / 1000;

    if (!gameOver) {
        scene.simulate(); // run physics
        updateCars(time);
        updateCoins(time);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    TWEEN.update();

    stats.update();
}

function updateCars(wheelRotation) {
    cars.forEach((car, index) => {
        if (playerBox.position.z - 15 <= car.box.position.z) {
            car.model.position.z = car.box.position.z;
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

        car.wheels.forEach(wheel => {
            wheel.rotation.x = wheelRotation * Math.PI;
        });
    })
}

init();
animate();