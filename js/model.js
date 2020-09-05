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
            }

            if (node.name == 'Armature') {
                skeleton = new THREE.Skeleton([node.children[0]]);
            }
            else if (node.name == 'mixamorigRightArm' || node.name == 'mixamorigLeftArm') {
                // set character model arms in standard position
                node.rotation.z = node.name == 'mixamorigRightArm' ? 1 : -1;
            }
        });

        IS_DEBUG && console.log(dumpObject(model).join('\n'));

        scene.add(model);

        playerBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 3, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            0
        );
        playerBox.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            
            console.log("%o has collided with %o with an impact speed of %o  and a rotational force of %o and at normal %o", this, other_object, relative_velocity, relative_rotation, contact_normal);
            if (!other_object.name.includes("coin")) {
                clearInterval(objectInterval);
                clearInterval(groundInterval);
                stopAnimation(runTween);
                collisionCallback!=null && collisionCallback();

                gameOver = true;
            }
            else {
                coins.some((coin, index) => {
                    if (coin.name == other_object.name) {
                        scene.remove(coin);
                        coins.splice(index, 1);
                        console.log("coin missed! coins are ", coins);
                        return true;
                    }
                });
                console.log("coin removed. coins now are: ", coins);
            }
        });

        scene.add(playerBox);

        runningCallback!=null && runningCallback();

    }, (gltf) => {
        // called when loading is in progresses
        console.log((gltf.loaded / gltf.total * 100) + '% loaded');

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


    }.bind(this));

}

function addCar(scene, offset) {
    let carModel = defaultCarModel.clone();
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
        new THREE.CubeGeometry(1, 3, 4.5),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
        OBJ_MASS
    );

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
    let distance = OBJ_DISTANCE;
    coin.position.set(offset, 1, distance);
    coin.name = "coin_" + Date.now();
    coins.push(coin);
    scene.add(coin);
}