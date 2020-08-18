const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function init() {

    loadModel('resources/models/character.glb', scene, null);

    camera.position.set(0, 1, 4);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    //var controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.enablePan = false;
    //controls.enableZoom = false;
    //controls.target.set( 0, 1, 0 );
    //controls.update();

    window.addEventListener('resize', onWindowResize, false);

    createSimpleScenario(scene);

    createHemiLight(0xffffff, 0x444444, [0, 20, 0], scene);
    createDirectionalLigth(0xFFFFFF, 1, [3, 10, 10],
        { cast: true, top: 2, bottom: -2, left: -2, right: 2, near: 0.1, far: 40 }, scene, true);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
animate();