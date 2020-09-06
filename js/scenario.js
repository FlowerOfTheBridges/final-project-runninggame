const textureLoader = new THREE.TextureLoader();

function createCityScenario(scene, anisotropy) {

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
        new THREE.CubeGeometry(2, 7, 100),
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
        spawnCityObjects(scene);
        round++;
        console.log("round is ", round);
    }, BUILDING_INTERVAL);

    groundInterval = setInterval(() => {
        rightBarrierTexture.offset.x += 0.2;
        leftBarrierTexture.offset.x -= 0.2;
        groundTexture.offset.y -= 0.4;
    }, WALLS_INTERVAL)

}

function createForestScenario(scene, anisotropy){
    scene.background = textureLoader.load('resources/textures/forest.jpg')//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/rocks.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(80, 1000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrappi

    // let leftBarrierTexture = textureLoader.load('resources/textures/wall_rocks.jpg');
    // leftBarrierTexture.anisotropy = anisotropy;
    // leftBarrierTexture.repeat.set(10, 3);
    // leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    // leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 7, 100),
        new THREE.MeshBasicMaterial({ color: 'blue', transparent: true, opacity: 0.09 }),
        0
    );
    leftBarrier.position.set(5, 3, 0);
    leftBarrier.castShadow = false;

    // let rightBarrierTexture = textureLoader.load('resources/textures/wall_rocks.jpg');
    // rightBarrierTexture.anisotropy = anisotropy;
    // rightBarrierTexture.repeat.set(10, 3);
    // rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    // rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 7, 100),
        new THREE.MeshBasicMaterial({ color: 'blue', transparent: true, opacity: 0.09 }),
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

    let mesh = new Physijs.PlaneMesh(new THREE.PlaneGeometry(80, 1000), groundMaterial, 5);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    objectInterval = setInterval(() => {
        spawnForestObjects(scene);
        round++;
        console.log("round is ", round);
    }, BUILDING_INTERVAL);

    groundInterval = setInterval(() => {
        // rightBarrierTexture.offset.x += 0.2;
        // leftBarrierTexture.offset.x -= 0.2;
        groundTexture.offset.y -= 0.4;
    }, WALLS_INTERVAL)
}

function spawnCityObjects(scene){
    addBuilding(scene, round%2==0);
    addLamp(scene, round%2 != 0);
    setTimeout(() => addCar(scene, 0), 6400);
    //setTimeout(() => addLamp(scene, round%2 == 0), 3000);
    let carOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addCar(scene, carOffset), CAR_INTERVAL);
    round>=4 && setTimeout(() => addCoin(scene, round%2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = carOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6,1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);
    setTimeout(() => {addCoin(scene, round%2 != 0 ? 3 : -3); addCar(scene, coinOffset);}, COINS_INTERVALS[2]);
}

function spawnForestObjects(scene){
    addTree(scene, round%2==0);
    addRock(scene, round%2 != 0);
    setTimeout(() => addParrott(scene, 0), 6400);
    setTimeout(() => addRock(scene, round%2 == 0), 3000);
    let parrottOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addParrott(scene, parrottOffset), CAR_INTERVAL);
    round>=4 && setTimeout(() => addCoin(scene, round%2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = parrottOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6,1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);
    setTimeout(() => {addCoin(scene, round%2 != 0 ? 3 : -3); addParrott(scene, coinOffset);}, COINS_INTERVALS[2]);
}

