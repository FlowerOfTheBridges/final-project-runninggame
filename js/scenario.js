const textureLoader = new THREE.TextureLoader();

function createSimpleScenario(scene, anisotropy) {

    scene.background = textureLoader.load('resources/textures/skyline.jpg')//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/street.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(5, 10000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrappi

    let leftBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    leftBarrierTexture.anisotropy = anisotropy;
    leftBarrierTexture.repeat.set(10, 3);
    leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 20, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture }),
        0
    );
    leftBarrier.position.set(5, 3, 0);
    leftBarrier.castShadow = false;

    let rightBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    rightBarrierTexture.anisotropy = anisotropy;
    rightBarrierTexture.repeat.set(10, 3);
    rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 7, 100),
        new THREE.MeshBasicMaterial({ map: rightBarrierTexture }),
        0
    );
    rightBarrier.position.set(-5, 3, 0);
    rightBarrier.castShadow = false;

    scene.add(leftBarrier);
    scene.add(rightBarrier);

    let groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: groundTexture }),
        .8, // high friction
        .4 // low restitution
    );

    let mesh = new Physijs.PlaneMesh(new THREE.PlaneGeometry(8, 10000), groundMaterial, 5);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    objectInterval = setInterval(() => {
        setTimeout(() => {addCar(scene, randomNumber(-1.5, 1.5), true)},3000);
        addBuilding(scene, false);
        setTimeout(() => {addCoin(scene, randomNumber(-1.0, 1.0)); addCoin(scene, 3);},5000);
        addBuilding(scene, true);
        setTimeout(() => {addCar(scene, randomNumber(-1.5, 1.5), false)}, 3000);
    }, 7000);

    //BuildInterval = setInterval(() => { addBuilding(scene, false); addBuilding(scene, true); }, 5000);
   // CarInterval  =  setInterval(() => {  addCar(scene, randomNumber(-1.5, 1.5), true);  addCar(scene, randomNumber(-1.5, 1.5), false);}, 4000);
   // CoinInterval =  setInterval(() => { addCoin(scene, randomNumber(-1.0, 1.0));   addCoin(scene, 3);}, 4000);
   
   
    groundInterval = setInterval(() => {
        rightBarrierTexture.offset.x += 0.99;
        leftBarrierTexture.offset.x -= 0.99;
        groundTexture.offset.y -= 0.2;
    }, 50)
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}