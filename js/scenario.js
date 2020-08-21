const textureLoader = new THREE.TextureLoader();

function createSimpleScenario(scene, anisotropy) {

    scene.background = textureLoader.load('resources/textures/skyline.jpg')//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/street.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(5, 10000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrappi

    let leftBarrierTexture = textureLoader.load('resources/textures/skyline.jpg');
    leftBarrierTexture.anisotropy = anisotropy;
    leftBarrierTexture.repeat.set(10, 3);
    leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 2, 100, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture}),
        0
    );
    leftBarrier.position.set(5, 5, 0);
    leftBarrier.castShadow = false;

    let rightBarrierTexture = textureLoader.load('resources/textures/skyline.jpg');
    rightBarrierTexture.anisotropy = anisotropy;
    rightBarrierTexture.repeat.set(10, 3);
    rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 2, 100, 100),
        new THREE.MeshBasicMaterial({ map: rightBarrierTexture}),
        0
    );
    rightBarrier.position.set(-5, 5, 0);
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

    buildingInterval = setInterval(() => {
        addBuilding(scene, false);
        addBuilding(scene, true);
    }, 2000);

    groundInterval = setInterval(() => {
        rightBarrierTexture.offset.x += 0.99;
        leftBarrierTexture.offset.x -= 0.99;
        groundTexture.offset.y -= 0.2;
    }, 50)
}