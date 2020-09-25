var objectInterval, groundInterval = null;
/** 
 * objects array. each type of model is stored inside its corresponding array, where it will be managed by
 * the corresponding update function  
 */
var cars = [];
var coins = [];
var buildings = [];
var lamps = [];
var trees = [];
var rocks = [];
var gazelles = [];
var trucks = [];
var rockWalls = [];
/**
 * creates the city scenario
 * @param {*} scene the scene where the scenario will be rendered 
 * @param {string} dayTime 'morning' or 'sunset' (it will change the background)
 */
function createCityScenario(scene, dayTime) {

    scene.background = textureLoader.load('resources/textures/skyline' + (dayTime == 'morning' ? '_day.jpg' : '.jpg'))//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 40, 50);

    //left barrier
    let leftBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    leftBarrierTexture.repeat.set(10, 1);
    leftBarrierTexture.wrapS = THREE.RepeatWrapping;
    leftBarrierTexture.wrapT = THREE.RepeatWrapping;
    let leftBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 5, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture }),
        0
    );
    leftBarrier.position.set(5.5, 1, 0);
    leftBarrier.castShadow = true;
    leftBarrier.receiveShadow = true;
    // right barrier
    let rightBarrierTexture = textureLoader.load('resources/textures/building.jpg');
    rightBarrierTexture.repeat.set(10, 1);
    rightBarrierTexture.wrapS = THREE.RepeatWrapping;
    rightBarrierTexture.wrapT = THREE.RepeatWrapping;
    let rightBarrier = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 5, 100),
        new THREE.MeshBasicMaterial({ map: rightBarrierTexture }),
        0
    );
    rightBarrier.position.set(-5.5, 1, 0);
    rightBarrier.castShadow = true;
    rightBarrier.receiveShadow = true;

    scene.add(leftBarrier);
    scene.add(rightBarrier);
    // ground   
    let groundTexture = textureLoader.load('resources/textures/street.jpg');
    groundTexture.repeat.set(50, 10000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    let groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: groundTexture }),
        .8, // high friction
        .4 // low restitution
    );

    let ground = new Physijs.PlaneMesh(new THREE.PlaneGeometry(50, 10000), groundMaterial, 5);
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

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

/**
 * creates the forest scenario
 * @param {*} scene 
 * @param {string} dayTime 
 */
function createForestScenario(scene, dayTime) {
    // background
    scene.background = textureLoader.load('resources/textures/forest' + (dayTime == 'morning' ? '_day.jpg' : '.jpg'));//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);
    // left barrier
    let leftBarrierTexture = textureLoader.load('resources/textures/rock.jpg');
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
    // right barrier
    let rightBarrierTexture = textureLoader.load('resources/textures/rock.jpg');
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
    // ground
    let groundTexture = textureLoader.load('resources/textures/rocks.jpg');
    groundTexture.repeat.set(80, 1000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    let groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: groundTexture }),
        .8, // high friction
        .4 // low restitution
    );

    let ground = new Physijs.PlaneMesh(new THREE.PlaneGeometry(80, 1000), groundMaterial, 5);
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

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

/**
 * Functions that creates objects to insert within the city scenario. depending on the round, different
 * configurations may be used
 * @param {*} scene 
 */
function spawnCityObjects(scene) {
    addBuilding(scene, round % 2 == 0);
    addLamp(scene, round % 2 != 0);
    setTimeout(() => { addBuilding(scene, round % 2 != 0); }, OUTER_OBSTACLES_INTERVAL - 1000);
    let carOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addCar(scene, carOffset), INNER_OBSTACLES_INTERVAL);
    round >= 4 && setTimeout(() => addCoin(scene, round % 2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = carOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);;
    setTimeout(() => { addTruck(scene) }, WALL_OBASTACLES_INTERVAL);
    coinOffset = coinOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => { addCoin(scene, round % 2 == 0 ? 3 : -3); addLamp(scene, round % 2 == 0); addCar(scene, coinOffset); }, COINS_INTERVALS[2]);
}
/**
 * Functions that creates objects to insert within the forest scenario. depending on the round, different
 * configurations may be used
 * @param {*} scene 
 */
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
/**
 * function that updates car positions, and removes those cars that are not more within the character range.
 * @param {*} wheelRotation rotation to apply at each car's wheels
 */
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
/**
 * function that updates coin positions, and removes those coins that are not more within the character range.
 * @param {*} wheelRotation rotation to apply at each coin
 */
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
/**
 * function that updates building positions, and removes those buildings that are not more within the character range.
 */
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
/**
 * function that updates lamp positions, and removes those lamps that are not more within the character range.
 */
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
/**
 * function that updates tree positions, and removes those trees that are not more within the character range.
 */
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
/**
 * function that updates rock positions, and removes those rocks that are not more within the character range.
 */
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
/**
 * function that updates gazelle positions, and removes those gazelles that are not more within the character range.
 */
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
/**
 * function that updates truck positions, and removes those trucks that are not more within the character range.
 */
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
/**
 * function that updates rock walls positions, and removes those walls that are not more within the character range.
 */
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
