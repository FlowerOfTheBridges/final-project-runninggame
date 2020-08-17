const scene = new THREE.Scene();
//const objLoader = new THREE.OBJLoader();
//objLoader.load('resources/models/stickman.obj', (root) => {
//    scene.add(root);
//});

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    let localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    let newPrefix = prefix + (isLast ? '  ' : '│ ');
    let lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        let isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}
const gltfLoader = new THREE.GLTFLoader();
const url = 'resources/models/scene.gltf';
gltfLoader.load(url, (gltf) => {
    let model = gltf.scene;
    scene.add(model);
    console.log(dumpObject(model).join('\n'));
});
scene.background = new THREE.Color('black');
const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
camera.position.set(0, 10, 30);


const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


function addGeometry() {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

function addLight(helperOn) {
    let color = 0xFFFFFF;
    let intensity = 1;
    let light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);

    if (helperOn) {
        let helper = new THREE.DirectionalLightHelper(light);
        scene.add(helper);
    }
}

function animate(geometry) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //geometry.rotation.x += 0.01;
    //geometry.rotation.y += 0.01;
}

function addMesh() {
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

addGeometry();
addMesh();
//camera.position.z = 5;
addLight(true);
animate();