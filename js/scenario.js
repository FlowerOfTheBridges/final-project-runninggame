var objectInterval, groundInterval = null;
var cars = [];
var coins = [];
var buildings = [];
var lamps = [];
var trees = [];
var rocks = [];
var gazelles = [];
var trucks = [];

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
        new THREE.CubeGeometry(2, 5, 100),
        new THREE.MeshBasicMaterial({ map: leftBarrierTexture }),
        0
    );
    leftBarrier.position.set(5, 1, 0);
    leftBarrier.castShadow = false;

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
        rightBarrierTexture.offset.x += WALLS_SPEED;
        leftBarrierTexture.offset.x -= WALLS_SPEED;
        groundTexture.offset.y -= GROUND_SPEED;
    }, WALLS_INTERVAL);

}

function createForestScenario(scene, anisotropy) {
    scene.background = textureLoader.load('resources/textures/forest.jpg')//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/rocks.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(80, 1000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrappi

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
    leftBarrier.castShadow = false;

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
        rightBarrierTexture.offset.x -= WALLS_SPEED;
        leftBarrierTexture.offset.x += WALLS_SPEED;
        groundTexture.offset.y -= GROUND_SPEED;
    }, WALLS_INTERVAL)
}


function spawnCityObjects(scene) {
    addBuilding(scene, round % 2 == 0);
    addLamp(scene, round % 2 != 0);
    setTimeout(() => {/**addCar(scene, 0);*/ addBuilding(scene, round % 2 != 0);}, 6000);
    let carOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addCar(scene, carOffset), CAR_INTERVAL);
    round >= 4 && setTimeout(() => addCoin(scene, round % 2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = carOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);;
    setTimeout(() => {addTruck(scene)}, 4000);
    setTimeout(() => { addCoin(scene, round % 2 == 0 ? 3 : -3); addLamp(scene, round % 2 == 0); addCar(scene, coinOffset); }, COINS_INTERVALS[2]);
}

function spawnForestObjects(scene) {
    addTree(scene, round % 2 == 0, false);
    addRock(scene, round % 2 != 0);
    setTimeout(() => addGazelle(scene, 0), 6400);
    setTimeout(() => addRock(scene, round % 2 == 0), 3000);
    let gazelleOffset = randomNumber(-1.2, 1.2);
    setTimeout(() => addGazelle(scene, gazelleOffset), CAR_INTERVAL);
    round >= 4 && setTimeout(() => addCoin(scene, round % 2 == 0 ? 3 : -3), COINS_INTERVALS[1]);
    let coinOffset = gazelleOffset >= 0.6 ? randomNumber(-1.2, 0.6) : randomNumber(0.6, 1.2);
    setTimeout(() => addCoin(scene, coinOffset), COINS_INTERVALS[0]);
    setTimeout(() => { addCoin(scene, round % 2 != 0 ? 3 : -3); addGazelle(scene, coinOffset); }, COINS_INTERVALS[2]);
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
        else{
            coin.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            (coin.getLinearVelocity().x!=0 || coin.getLinearVelocity().y!=0) && coin.setLinearVelocity(new THREE.Vector3(0, 0, coin.getLinearVelocity().z));
        }
    })
}

function updateBuildings() {
    buildings.forEach((building, index) => {
        if (playerBox.position.z - 10 >= building.position.z) {
            building.dispose();
            scene.remove(building);
            cars.splice(index, 1);
            console.log("building removed! buildings are ", buildings);
        }
        else{
            building.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            building.getLinearVelocity().x!=0 && building.setLinearVelocity(new THREE.Vector3(0, 0, building.getLinearVelocity().z));
        }
    })
}

function updateLamps() {
    lamps.forEach((lamp, index) => {
        if (playerBox.position.z - 10 >= lamp.model.position.z) {
            lamp.model.dispose();
            scene.remove(lamp.model);
            scene.remove(lamp.box);
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
            scene.remove(tree.box);
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

function updateGazelles() {
    gazelles.forEach((gazelle, index) => {
        if (playerBox.position.z - 15 <= gazelle.box.position.z) {
            gazelle.model.position.z = gazelle.box.position.z;
            gazelle.box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            gazelle.box.getLinearVelocity().x!=0 && gazelle.box.setLinearVelocity(new THREE.Vector3(0, 0, gazelle.box.getLinearVelocity().z));
        }
        else {
            scene.remove(gazelle.model);
            scene.remove(gazelle.box);
            gazelles.splice(index, 1);
            console.log("gazelle avoided! gazelles are ", gazelles);
        }
    })
}

function updateTrucks(){
    trucks.forEach((truck, index) => {
        if (playerBox.position.z - 15 <= truck.box.position.z) {
            truck.model.position.z = truck.box.position.z;
            truck.model2.position.z = truck.box.position.z;
            truck.box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            truck.box.getLinearVelocity().x!=0 && truck.box.setLinearVelocity(new THREE.Vector3(0, 0, truck.box.getLinearVelocity().z));
        }
        else {
            truck.model.dispose();
            scene.remove(truck.model);
            truck.model2.dispose();
            scene.remove(truck.model2);
            scene.remove(truck.box);
            trucks.splice(index, 1);
            console.log("truck avoided! trucks are ", trucks);
        }
    })
}
