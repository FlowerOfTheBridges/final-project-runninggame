var defaultCarModel, coinGeometry, defaultLamp, defaultTree, rockGeometry, defaultTruck = null;

const gltfLoader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();

dracoLoader.setDecoderPath('js/libs/draco/gltf/');
gltfLoader.setDRACOLoader(dracoLoader);

THREE.ImageUtils.crossOrigin = '';

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


function loadCharacter(scene, runningCallback, collisionCallback) {

    gltfLoader.load(CHARACTER_URL, (gltf) => {
        // called when resource is loaded
        let model = gltf.scene;
        //scene.add(model);
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                if (node.material.name != 'Beta_Joints_MAT') {
                    node.material.color = new THREE.Color('white');
                    node.material.map = textureLoader.load('resources/textures/diag.jpg');
                }
            }

            if (node.name == 'Armature') {
                skeleton = new THREE.Skeleton([node.children[0]]);
            }
            else if (node.name == 'mixamorigRightArm' || node.name == 'mixamorigLeftArm') {
                // set character model arms in standard position
                node.rotation.z = node.name == 'mixamorigRightArm' ? 1 : -1;
            }
        });

        IS_DEBUG && console.log("CHARACTER:\n" + dumpObject(model).join('\n'));

        scene.add(model);

        playerBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 1.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            0
        );
        playerBox.position.set(0, 0.9, 0);
        playerBox.addEventListener('collision', function (otherObject, relativeVelocity, relativeRotation, contactNormal) {
            collisionCallback(otherObject, relativeVelocity, relativeRotation, contactNormal);
        });

        scene.add(playerBox);

        runningCallback != null && runningCallback();

    }, (gltf) => {
        // called when loading is in progresses
        IS_DEBUG && console.log((gltf.loaded / gltf.total * 100) + '% loaded');

    }, (error) => {
        // called when loading has errors
        console.log('An error happened: %o', error);

    });
}

function createCar() {
    shadow = textureLoader.load(CAR_SHADOW_URL);
    gltfLoader.load(CAR_URL, function (gltf) {

        defaultCarModel = gltf.scene.children[0];

        defaultCarModel.getObjectByName('body').material = CAR_BODY_MATERIAL;

        defaultCarModel.getObjectByName('rim_fl').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_fr').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_rr').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('rim_rl').material = CAR_DETAILS_MATERIAL;
        defaultCarModel.getObjectByName('trim').material = CAR_DETAILS_MATERIAL;

        defaultCarModel.getObjectByName('glass').material = CAR_GLASS_MATERIAL;

        IS_DEBUG && console.log("CAR:\n" + dumpObject(defaultCarModel).join('\n'));
    }.bind(this));

}

function addCar(scene, offset) {
    let id = Date.now();
    let carModel = defaultCarModel.clone();
    carModel.name = 'car_' + id + "_model";
    carModel.scale.set(0.6, 1, 1);

    carModel.position.x = offset;
    carModel.position.z = OBJ_DISTANCE;


    // shadow
    let mesh = new Physijs.Mesh(
        new THREE.PlaneBufferGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({
            map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
        })
    );
    mesh.rotation.x = - Math.PI / 2;
    mesh.renderOrder = 2;

    carModel.add(mesh);
    // add box to car (collision  check)
    let carBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(1, 2, 4.5),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS / 10
    );

    carBox.name = "car_" + id;
    carBox.position.set(offset, 0, OBJ_DISTANCE);

    let wheels = [];
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

function addBuilding(scene, isRight) {
    let box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 10, 2),
        new THREE.MeshBasicMaterial({ map: textureLoader.load('resources/textures/building.jpg') }),
        OBJ_MASS
    );
    box.position.set((isRight ? -1 : 1) * 3, 0, OBJ_DISTANCE);
    box.castShadow = true;
    scene.add(box);
}

function createCoin() {

    cylinderGeometry = new THREE.CylinderGeometry(
        0.25, 0.25, 0.06, 16
    );
    cylinderGeometry.rotateX(Math.PI / 2);

}

function addCoin(scene, offset) {
    let coin = new Physijs.BoxMesh(
        cylinderGeometry.clone(),
        COIN_MATERIAL,
        OBJ_MASS
    );

    coin.castShadow = true;
    coin.position.set(offset, 1, OBJ_DISTANCE);
    coin.name = "coin_" + Date.now();
    coins.push(coin);
    scene.add(coin);
}

function createTree() {
    gltfLoader.load('resources/models/tree.glb', function (gltf) {

        defaultTree = gltf.scene;
        defaultTree.castShadow = true;

        IS_DEBUG && console.log("TREE:\n" + dumpObject(defaultTree).join('\n'));

    }.bind(this));
}

function addTree(scene, isRight, isBorder) {
    let treeModel = defaultTree.clone();
    treeModel.position.set((isRight ? -1 : 1) * (isBorder ? 6 : 3), 1, OBJ_DISTANCE);

    let treeBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(0.5, 15, 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );

    treeBox.position.set((isRight ? -1 : 1) * 3, 0, OBJ_DISTANCE + 0.47);
    trees.push({ box: treeBox, model: treeModel });

    scene.add(treeModel);
    scene.add(treeBox);
}

function createRock() {

    rockGeometry = new THREE.IcosahedronBufferGeometry(1, 1);

    rockGeometry.rotateX(Math.PI / 2);

}

function addRock(scene, isRight) {
    let rockMesh = new THREE.MeshPhysicalMaterial({
        map: textureLoader.load('resources/textures/rock.jpg'),
        roughness: 1.0,
        reflectivity: 0
    });
    let rock = new Physijs.BoxMesh(
        rockGeometry.clone(),
        rockMesh,
        OBJ_MASS
    );
    rock.castShadow = true;
    rock.position.set((isRight ? -1 : 1) * 3, 1, OBJ_DISTANCE);

    rocks.push(rock);
    scene.add(rock);
}

function addGazelle(scene, offset) {

    gltfLoader.load('resources/models/gazelle.glb', function (gltf) {
        let gazelleModel = gltf.scene;
        gazelleModel.scale.set(3, 1, 2);
        gazelleModel.castShadow = true;
        gazelleModel.rotation.y = Math.PI / 2;
        gazelleModel.position.set(offset, 0, OBJ_DISTANCE);
        IS_DEBUG && console.log("GAZELLE:\n" + dumpObject(gazelleModel).join('\n'));
        // add box to gazelle (collision  check)
        let gazelleBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.8, 2.4, 4),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            OBJ_MASS
        );

        gazelleBox.position.set(offset, 0, OBJ_DISTANCE);

        let gazelleTweens = moveGazelle(gazelleModel);
        gazelles.push({ box: gazelleBox, model: gazelleModel, tweens: gazelleTweens });

        scene.add(gazelleBox);
        scene.add(gazelleModel);
    }.bind(this));

}

function createLamp() {
    gltfLoader.load('resources/models/lamp.gltf', function (gltf) {

        defaultLamp = gltf.scene;
        defaultLamp.scale.set(1.5, 1.5, 1);
        defaultLamp.castShadow = true;
        IS_DEBUG && console.log("LAMP:\n" + dumpObject(defaultLamp).join('\n'));
    }.bind(this));
}

function addLamp(scene, isRight) {
    let id = Date.now();

    let lampModel = defaultLamp.clone();
    lampModel.name = "lamp_" + id + "_model";
    lampModel.position.set((isRight ? -1 : 1) * 3, 1, OBJ_DISTANCE);

    let lampBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(0.1, 5, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );
    lampBox.name = "lamp_" + id;
    lampBox.position.set((isRight ? -1 : 1) * 3, 0, OBJ_DISTANCE + 0.47);
    lamps.push({ box: lampBox, model: lampModel });

    scene.add(lampModel);
    scene.add(lampBox);
}

function createTruck() {
    gltfLoader.load('resources/models/CesiumMilkTruck.gltf', function (gltf) {

        defaultTruck = gltf.scene;
        defaultTruck.castShadow = true;
        IS_DEBUG && console.log("LAMP:\n" + dumpObject(defaultTruck).join('\n'));
    }.bind(this));
}

function addTruck(scene) {
    let truckModel = defaultTruck.clone();
    truckModel.scale.set(0.8, 0.7, 0.7);
    truckModel.position.set(2, 0, OBJ_DISTANCE);

    let truckModel2 = defaultTruck.clone();
    truckModel2.scale.set(0.8, 0.7, 0.7);
    truckModel2.position.set(-2, 0, OBJ_DISTANCE);
    truckModel2.rotation.y = Math.PI;

    let truckBox = new Physijs.BoxMesh(
        new THREE.CubeGeometry(7, 3.7, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );

    truckBox.position.set(0, 0, OBJ_DISTANCE);
    trucks.push({ box: truckBox, model: truckModel, model2: truckModel2 });

    scene.add(truckModel);
    scene.add(truckModel2);
    scene.add(truckBox);
}