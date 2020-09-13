var objectInterval, groundInterval = null;
var cars = [];
var coins = [];
var buildings = [];
var lamps = [];
var trees = [];
var rocks = [];
var gazelles = [];
var trucks = [];
var rockWalls = [];

function createCityScenario(scene, dayTime, anisotropy) {

    scene.background = textureLoader.load('resources/textures/skyline' + (dayTime == 'morning' ? '_day.jpg' : '.jpg'))//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/street.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(50, 10000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    let leftBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    leftBarrierTexture.anisotropy = anisotropy;
    leftBarrierTexture.repeat.set(10, 3);
    leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 5, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture }),
        0
    );
    leftBarrier.position.set(5, 1, 0);
    leftBarrier.castShadow = true;
    leftBarrier.receiveShadow = true;

    let rightBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    rightBarrierTexture.anisotropy = anisotropy;
    rightBarrierTexture.repeat.set(10, 3);
    rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 5, 100),
        new THREE.MeshBasicMaterial({ map: rightBarrierTexture }),
        0
    );
    rightBarrier.position.set(-5, 1, 0);
    rightBarrier.castShadow = true;
    rightBarrier.receiveShadow = true;

    scene.add(leftBarrier);
    scene.add(rightBarrier);

    let groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: groundTexture }),
        .8, // high friction
        .4 // low restitution
    );

    let mesh = new Physijs.PlaneMesh(new THREE.PlaneGeometry(50, 10000), groundMaterial, 5);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    groundInterval = setInterval(() => {
        rightBarrierTexture.offset.x += WALLS_SPEED;
        leftBarrierTexture.offset.x -= WALLS_SPEED;
        groundTexture.offset.y -= GROUND_SPEED;
    }, WALLS_INTERVAL);

    objectInterval = setInterval(() => {
        if (isGameReady) {
            spawnCityObjects(scene);
            round++;
            IS_DEBUG && console.log("round ", round);
        }
    }, OUTER_OBSTACLES_INTERVAL);

}

function createForestScenario(scene, dayTime, anisotropy) {
    scene.background = textureLoader.load('resources/textures/forest' + (dayTime == 'morning' ? '_day.jpg' : '.jpg'));//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/rocks.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(80, 1000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    let leftBarrierTexture = textureLoader.load('resources/textures/rock.jpg');
    leftBarrierTexture.anisotropy = anisotropy;
    leftBarrierTexture.repeat.set(7, 1);
    leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(10, 3, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture }),
        0
    );
    leftBarrier.position.set(10, 1, 0);
    leftBarrier.castShadow = true;
    leftBarrier.receiveShadow = true;

    let rightBarrierTexture = textureLoader.load('resources/textures/rock.jpg');
    rightBarrierTexture.anisotropy = anisotropy;
    rightBarrierTexture.repeat.set(7, 1);
    rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(10, 3, 100),
        new THREE.MeshBasicMaterial({ map: rightBarrierTexture }),
        0
    );
    rightBarrier.position.set(-10, 1, 0);
    rightBarrier.castShadow = true;
    rightBarrier.receiveShadow = true;

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
        if (isGameReady) {
            spawnForestObjects(scene);
            round++;
            IS_DEBUG && console.log("round ", round);
        }
    }, OUTER_OBSTACLES_INTERVAL);

    groundInterval = setInterval(() => {
        rightBarrierTexture.offset.x -= WALLS_SPEED / 2;
        leftBarrierTexture.offset.x += WALLS_SPEED / 2;
        groundTexture.offset.y -= GROUND_SPEED;
    }, WALLS_INTERVAL)
}


function spawnCityObjects(scene) {
    addBuilding(scene, round % 2 == 0);
    addLamp(scene, round % 2 != 0);
    setTimeout(() => {/**addCar(scene, 0);*/ addBuilding(scene, round % 2 != 0); }, OUTER_OBSTACLES_INTERVAL - 1000);
    let carOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addCar(scene, carOffset), INNER_OBSTACLES_INTERVAL);
    round >= 4 && setTimeout(() => addCoin(scene, round % 2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = carOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);;
    setTimeout(() => { addTruck(scene) }, WALL_OBASTACLES_INTERVAL);
    coinOffset = coinOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => { addCoin(scene, round % 2 == 0 ? 3 : -3); addLamp(scene, round % 2 == 0); addCar(scene, coinOffset); }, COINS_INTERVALS[2]);
}

function spawnForestObjects(scene) {
    addTree(scene, round % 2 == 0);
    addRock(scene, round % 2 != 0);
    setTimeout(() => addTree(scene, round % 2 != 0), OUTER_OBSTACLES_INTERVAL - 1000);
    let gazelleOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addGazelle(scene, gazelleOffset), INNER_OBSTACLES_INTERVAL);
    round >= 4 && setTimeout(() => addCoin(scene, round % 2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = gazelleOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);
    setTimeout(() => addRockWall(scene), WALL_OBASTACLES_INTERVAL);
    coinOffset = coinOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => { addCoin(scene, round % 2 != 0 ? 3 : -3); addRock(scene, round % 2 == 0); addGazelle(scene, coinOffset); }, COINS_INTERVALS[2]);
}

function updateCars(wheelRotation) {
    cars.forEach((car, index) => {
        if (playerBox.position.z - 15 <= car.box.position.z) {
            car.model.position.z = car.box.position.z;
            boxConstraints(car.box);
        }
        else {
            scene.remove(car.model);
            car.box.geometry.dispose();
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
            coin.geometry.dispose();
            scene.remove(coin);
            coins.splice(index, 1);
            IS_DEBUG && console.log("coin missed! coins are ", coins);
        }
        else {
            boxConstraints(coin);
        }
    })
}

function updateBuildings() {
    buildings.forEach((building, index) => {
        if (playerBox.position.z - 10 >= building.position.z) {
            building.dispose();
            scene.remove(building);
            cars.splice(index, 1);
            IS_DEBUG && console.log("building removed! buildings are ", buildings);
        }
        else {
            boxConstraints(building);
        }
    })
}

function updateLamps() {
    lamps.forEach((lamp, index) => {
        if (playerBox.position.z - 10 >= lamp.model.position.z) {
            lamp.model.dispose();
            scene.remove(lamp.model);
            lamp.box.geometry.dispose();
            scene.remove(lamp.box);
            lamps.splice(index, 1);
            IS_DEBUG && console.log("lamp removed! lamps are ", lamps);
        }
        else {
            lamp.model.position.set(lamp.box.position.x, lamp.model.position.y, lamp.box.position.z);
            boxConstraints(lamp.box);
        }
    })
}

function updateTrees() {
    trees.forEach((tree, index) => {
        if (playerBox.position.z - 10 >= tree.model.position.z) {
            tree.model.dispose();
            scene.remove(tree.model);
            tree.box.geometry.dispose();
            scene.remove(tree.box);
            trees.splice(index, 1);
            IS_DEBUG && console.log("tree removed! trees are ", trees);
        }
        else {
            tree.model.position.z = tree.box.position.z - 0.47;
            boxConstraints(tree.box);
        }
    })
}

function updateRocks(rotation) {
    rocks.forEach((rock, index) => {
        if (playerBox.position.z - 15 > rock.position.z) {
            rock.geometry.dispose();
            scene.remove(rock);
            rocks.splice(index, 1);
            IS_DEBUG && console.log("rock avoided! rocks are ", rocks);
        }
        else {
            rock.rotation.x = rotation * Math.PI;
            rock.rotation.y = rotation * Math.PI;
            boxConstraints(rock);
        }
    })
}

function updateGazelles() {
    gazelles.forEach((gazelle, index) => {
        if (playerBox.position.z - 15 <= gazelle.box.position.z) {
            gazelle.model.position.z = gazelle.box.position.z;
            boxConstraints(gazelle.box);
        }
        else {
            stopAnimation(gazelle.tweens);
            gazelle.model.dispose();
            scene.remove(gazelle.model);
            gazelle.box.geometry.dispose();
            scene.remove(gazelle.box);
            gazelles.splice(index, 1);
            IS_DEBUG && console.log("gazelle avoided! gazelles are ", gazelles);
        }
    })
}

function updateTrucks() {
    trucks.forEach((truck, index) => {
        if (playerBox.position.z - 15 <= truck.box.position.z) {
            truck.model.position.z = truck.box.position.z;
            truck.model2.position.z = truck.box.position.z;
            boxConstraints(truck.box);
        }
        else {
            truck.model.dispose();
            scene.remove(truck.model);
            truck.model2.dispose();
            scene.remove(truck.model2);
            truck.box.geometry.dispose();
            scene.remove(truck.box);
            trucks.splice(index, 1);
            IS_DEBUG && console.log("truck avoided! trucks are ", trucks);
        }
    })
}

function updateRockWalls() {
    rockWalls.forEach((rockWall, index) => {
        if (playerBox.position.z - 15 <= rockWall.position.z) {
            boxConstraints(rockWall);
        }
        else {
            rockWall.geometry.dispose();
            scene.remove(rockWall);
            rockWalls.splice(index, 1);
            IS_DEBUG && console.log("rock wall avoided! rock walls are ", rockWalls);
        }
    })
}
