var defaultCarModel, coinGeometry, defaultLamp, defaultTree, rockGeometry, defaultTruck, bag = null;
var player = new THREE.Group(); // hierarchical model of the player
const gltfLoader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
// set gltfloader to read draco geometry
dracoLoader.setDecoderPath('js/libs/draco/gltf/');
gltfLoader.setDRACOLoader(dracoLoader);

THREE.ImageUtils.crossOrigin = '';

/**
 * function to write the hierarchical structure of a gltf model. used for devolpment purpouse only
 */
function dumpObject(obj, name) {
    name && console.log(name);
    let line = (obj.name || "no-name")+" has "+obj.children.length+" children: ";
    obj.children.forEach((child, index) => {
        line+=child.name+"["+index+"]"
        if(obj.children.length - 1 == index){
            console.log(line);
        }
        else{
            line+=","
        } 
        dumpObject(child);
    });
    
}

/**
 * loads the bag model
 */
function createBag() {
    gltfLoader.load('resources/models/bag.gltf', (gltf) => {
        bag = gltf.scene;
        bag.scale.set(0.1, 0.1, 0.2);
        bag.position.set(0, 1.27, -0.2);
        bag.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        IS_DEBUG && dumpObject(bag, "BAG:");
    },
    (gltf) => { // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++; // if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded'); 
    });
}

/**
 * load and show the gltf model of the character
 * @param {*} scene the scene where the character will be rendered
 * @param {*} runningCallback the function related to the running animation
 * @param {*} collisionCallback the function that needs to be called whenever a collision happens
 */
function loadCharacter(scene, runningCallback, collisionCallback) {

    gltfLoader.load(CHARACTER_URL, (gltf) => {
        // called when resource is loaded
        let model = gltf.scene;
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }

            if (node.name == 'Armature') {
                skeleton = node.children[0]; // assign bones to skeleton variable, used within animation.js
            }
            else if (node.name == 'mixamorigRightArm' || node.name == 'mixamorigLeftArm') {
                // set character model arms in standard position
                node.rotation.z = node.name == 'mixamorigRightArm' ? 1 : -1;
            }
        });

        IS_DEBUG && dumpObject(model, "CHARACTER");
        // transparent box (for collisions)
        playerBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 1.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            0
        );
        playerBox.position.set(0, 0.9, 0);
        playerBox.addEventListener('collision', function (otherObject, relativeVelocity, relativeRotation, contactNormal) {
            collisionCallback(otherObject, relativeVelocity, relativeRotation, contactNormal);
        });
        player.add(model);
        scene.add(player);
        scene.add(playerBox);

        runningCallback != null && runningCallback();

    }, (gltf) => {
        // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++;// if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');

    }, (error) => {
        // called when loading has errors
        IS_DEBUG && console.log('An error happened: %o', error);

    });
}

/**
 * the bag is added to the player's hierarchical model (two children: the bag and the character) 
 */
function addBagToPlayer(){
    player.add(bag);
}

/**
 * loads the character model
 */
function createCar() {
    gltfLoader.load(CAR_URL, function (gltf) {

        defaultCarModel = gltf.scene.children[0];
        // set body materials
        defaultCarModel.getObjectByName('body').material = CAR_BODY_MATERIAL;
        // set details material
        defaultCarModel.getObjectByName('rim_fl').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_fr').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_rr').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_rl').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('trim').material = CAR_DETAILS_MATERIAL;
        // set glass material
        defaultCarModel.getObjectByName('glass').material = CAR_GLASS_MATERIAL;

        IS_DEBUG && dumpObject(defaultCarModel, "CAR:");

        defaultCarModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
    }.bind(this),
    (gltf) => {
        // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++; // if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');
    });
}

/**
 * add a car to the scene
 * @param {*} scene the scene where the car needs to be rendered
 * @param {number} offset position along the x axis where the car will be placed  
 */
function addCar(scene, offset) {
    let id = Date.now();
    let carModel = defaultCarModel.clone();
    carModel.name = 'car_' + id + "_model";
    carModel.scale.set(0.6, 1, 1);

    carModel.position.x = offset;
    carModel.position.z = OBJ_DISTANCE;
    // transparent mesh (for collisions)
    let carBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(1, 2, 4.5),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS / 10
    );

    carBox.name = "car_" + id;
    carBox.position.set(offset, 0, OBJ_DISTANCE);

    let wheels = []; // add wheels into an array, so that they can be animated within the function updateCars in scenario.js
    wheels.push(
        carModel.getObjectByName('wheel_fl'),
        carModel.getObjectByName('wheel_fr'),
        carModel.getObjectByName('wheel_rl'),
        carModel.getObjectByName('wheel_rr')
    );

    cars.push({ box: carBox, model: carModel, wheels: wheels });

    scene.add(carBox);
    scene.add(carModel);
}
/**
 * add a building to the scene
 * @param {*} scene 
 * @param {boolean} isRight true if the building will be placed on the right side of the scenario, false otherwise
 */
function addBuilding(scene, isRight) {
    let box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 8, 2),
        new THREE.MeshBasicMaterial({ map: textureLoader.load('resources/textures/building.jpg') }),
        OBJ_MASS
    );
    box.name = "building_" + Date.now();
    box.position.set((isRight ? -1 : 1) * 3, 3, OBJ_DISTANCE);
    box.castShadow = true;
    scene.add(box);
}

/**
 * creates the coin geometry
 */
function createCoin() {
    coinGeometry = new THREE.CylinderGeometry(
        0.25, 0.25, 0.06, 16
    );
    coinGeometry.rotateX(Math.PI / 2);
    assetsLoaded++; // if loading is completed, update number of assets loaded
}

/**
 * add a coin to the scene
 * @param {*} scene 
 * @param {number} offset position along the x-coordinate where the coin will be placed
 */
function addCoin(scene, offset) {
    let coin = new Physijs.BoxMesh(
        coinGeometry.clone(),
        COIN_MATERIAL,
        OBJ_MASS
    );
    coin.castShadow = true;
    coin.position.set(offset, 1, OBJ_DISTANCE);
    coin.name = "coin_" + Date.now();
    coins.push(coin);
    scene.add(coin);
}

/**
 * loads the model of the tree
 */
function createTree() {
    gltfLoader.load('resources/models/tree.glb', function (gltf) {

        defaultTree = gltf.scene;
        defaultTree.castShadow = true;
        defaultTree.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

        IS_DEBUG && dumpObject(defaultTree, "TREE:");

    }.bind(this),
    (gltf) => {
        // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++; // if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');
    });
}

/**
 * add a tree to the scene
 * @param {*} scene 
 * @param {boolean} isRight true if the tree will be on the right side of the scenario, false otherwise
 */
function addTree(scene, isRight) {
    let id = Date.now()
    let treeModel = defaultTree.clone();
    treeModel.name = "tree_" + id + "_model";
    treeModel.position.set((isRight ? -1 : 1) * 3, 1, OBJ_DISTANCE);

    let treeBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(0.7, 15, 3),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );
    treeBox.name = "tree_" + id;
    treeBox.position.set((isRight ? -1 : 1) * 3, 0, OBJ_DISTANCE + 0.47);
    trees.push({ box: treeBox, model: treeModel });

    scene.add(treeModel);
    scene.add(treeBox);
}

/**
 * creates the rock geometry
 */
function createRock() {
    rockGeometry = new THREE.IcosahedronBufferGeometry(1, 1);
    rockGeometry.rotateX(Math.PI / 2);
    assetsLoaded++; // if loading is completed, update number of assets loaded
}

/**
 * add a rock to the scene
 * @param {*} scene 
 * @param {*} isRight true if the rock will be placed on the right side of the screen, false otherwise
 */
function addRock(scene, isRight) {
    let rockMesh = new THREE.MeshPhysicalMaterial({
        map: textureLoader.load('resources/textures/rock.jpg'),
        roughness: 1.0,
        reflectivity: 0
    });
    let rock = new Physijs.BoxMesh(
        rockGeometry.clone(),
        rockMesh,
        OBJ_MASS / 10
    );

    rock.castShadow = true;
    rock.position.set((isRight ? -1 : 1) * 3, 1, OBJ_DISTANCE);

    rocks.push(rock);
    scene.add(rock);
}
/**
 * load a gazelle model and add it to the scene
 * @param {*} scene 
 * @param {number} offset position along the x-axis where the gazelle will be placed
 */
function addGazelle(scene, offset) {

    gltfLoader.load('resources/models/gazelle.glb', function (gltf) {
        let id = Date.now();

        let gazelleModel = gltf.scene;
        gazelleModel.name = "gazelle_" + id + "_model";
        gazelleModel.scale.set(3, 1, 2);
        gazelleModel.castShadow = true;
        gazelleModel.rotation.y = Math.PI / 2;
        gazelleModel.position.set(offset, 0, OBJ_DISTANCE);
        IS_DEBUG && dumpObject(gazelleModel, "GAZELLE:");
        // add box to gazelle (collision  check)
        gazelleModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        // transparent box (for collisions)
        let gazelleBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.8, 2.4, 4),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            OBJ_MASS / 10
        );
        gazelleBox.name = "gazelle_" + id;
        gazelleBox.position.set(offset, 0, OBJ_DISTANCE);

        let gazelleTweens = moveGazelle(gazelleModel);
        gazelles.push({ box: gazelleBox, model: gazelleModel, tweens: gazelleTweens });

        scene.add(gazelleBox);
        scene.add(gazelleModel);
    }.bind(this));

}

/**
 * load the gltf model of a city lamp
 */
function createLamp() {
    gltfLoader.load('resources/models/lamp.gltf', function (gltf) {

        defaultLamp = gltf.scene;
        defaultLamp.scale.set(1.5, 1.8, 1);
        defaultLamp.castShadow = true;

        defaultLamp.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        IS_DEBUG && dumpObject(defaultLamp, "LAMP:");
    }.bind(this),
    (gltf) => {
        // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++; // if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');
    });
}

/**
 * add a city lamp to the scene
 * @param {*} scene 
 * @param {*} isRight true if the lamp will be placed on the right side of the scenario, false otherwise
 */
function addLamp(scene, isRight) {
    let id = Date.now();

    let lampModel = defaultLamp.clone();
    lampModel.name = "lamp_" + id + "_model";
    lampModel.position.set((isRight ? -1 : 1) * 3, 1, OBJ_DISTANCE);
    // transparent box (for collisions)
    let lampBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(0.2, 8, 1),
        new THREE.MeshBasicMaterial({ color: 'white', transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );
    lampBox.name = "lamp_" + id;
    lampBox.position.set((isRight ? -1 : 1) * 3, 0, OBJ_DISTANCE);
    lamps.push({ box: lampBox, model: lampModel });

    scene.add(lampModel);
    scene.add(lampBox);
}
/**
 * load a truck model from a gltf file
 */
function createTruck() {
    gltfLoader.load('resources/models/CesiumMilkTruck.gltf', function (gltf) {

        defaultTruck = gltf.scene;
        defaultTruck.castShadow = true;
        defaultTruck.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        IS_DEBUG && dumpObject(defaultTruck, "TRUCK:");
    }.bind(this),
    (gltf) => {
        // called when loading is in progresses
        gltf.loaded == gltf.total && assetsLoaded++; // if loading is completed, update number of assets loaded
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');
    });
}
/**
 * add a truck wall to the scene
 * @param {*} scene 
 */
function addTruck(scene) {
    // first truck 
    let truckModel = defaultTruck.clone();
    truckModel.scale.set(0.8, 0.7, 0.7);
    truckModel.position.set(2, 0, OBJ_DISTANCE);
    // second truck
    let truckModel2 = defaultTruck.clone();
    truckModel2.scale.set(0.8, 0.7, 0.7);
    truckModel2.position.set(-2, 0, OBJ_DISTANCE);
    truckModel2.rotation.y = Math.PI;
    // transparent box (for collisions)
    let truckBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(7, 3.7, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, wireframe: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );

    truckBox.position.set(0, 0, OBJ_DISTANCE);
    trucks.push({ box: truckBox, model: truckModel, model2: truckModel2 });

    scene.add(truckModel);
    scene.add(truckModel2);
    scene.add(truckBox);
}

/**
 * add a rock wall to the scene
 * @param {*} scene 
 */
function addRockWall(scene) {
    let rockWall = new Physijs.BoxMesh(
        new THREE.CubeGeometry(9, 3.3, 1),
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('resources/textures/rock.jpg')
        }),
        OBJ_MASS
    );
    rockWall.castShadow = true;
    rockWall.position.set(0, 0, OBJ_DISTANCE);
    rockWalls.push(rockWall);

    scene.add(rockWall);
}

/**
 * the velocity of the box is restored along x and y axis
 * @param {*} box physijs mesh that needs to be constrained
 */
function boxConstraints(box) {
    box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    (box.getLinearVelocity().x != 0 || box.getLinearVelocity().y != 0) && box.setLinearVelocity(new THREE.Vector3(0, 0, box.getLinearVelocity().z));
}