Physijs.scripts.worker = '/js/libs/physijs_worker.js';
Physijs.scripts.ammo = '/js/libs/ammo.js';

const scene = new Physijs.Scene;
scene.setGravity(new THREE.Vector3(0,0,-5))

const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function init() {

    //createjs.Sound.registerSound("resources/audio/soundtrack.ogg", SOUNDTRACK);

    loadModel(CHARACTER_URL, scene, run);

    camera.position.set(0, 1, 4);
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    createSimpleScenario(scene, renderer.capabilities.getMaxAnisotropy());

    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createDirectionalLigth(0xFFFFFF, 1, [3, 10, 10],
        { cast: true, top: 2, bottom: -2, left: -2, right: 2, near: 0.1, far: 40 }, scene, true);
}


function animate() {
    scene.simulate(); // run physics
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    TWEEN.update();
}

init();
//createjs.Sound.play(SOUNDTRACK);
animate();