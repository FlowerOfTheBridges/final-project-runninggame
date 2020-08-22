const gltfLoader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( 'js/libs/draco/gltf/');
gltfLoader.setDRACOLoader( dracoLoader );

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

function loadModel(url, scene, callback) {

    gltfLoader.load(url, (gltf) => {
        // called when resource is loaded
        let model = gltf.scene;
        //scene.add(model);
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }

            if (node.name == 'Armature') {
                skeleton = new THREE.Skeleton([node.children[0]]);
                console.log(skeleton, skeleton.bones);
            }
            else if (node.name == 'mixamorigRightArm' || node.name == 'mixamorigLeftArm') {
                // set character model arms in standard position
                console.log("shoulder: %o", node);
                node.rotation.z = node.name == 'mixamorigRightArm' ? 1 : -1;
            }
        });
        console.log(dumpObject(model).join('\n'));

        scene.add(model);
        playerBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(0.5, 3, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            0
        );
        playerBox.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            console.log("%o has collided with %o with an impact speed of %o  and a rotational force of %o and at normal %o", this, other_object, relative_velocity, relative_rotation, contact_normal);
            clearInterval(buildingInterval);
            clearInterval(groundInterval);
            gameOver = true;
        });

        scene.add(playerBox);

        if (callback != null) {
            callback();
        }
    }, (gltf) => {
        // called when loading is in progresses
        console.log((gltf.loaded / gltf.total * 100) + '% loaded');

    }, (error) => {
        // called when loading has errors
        console.log('An error happened: %o', error);

    });
}

function addCar(scene, offset) {
    // TODO
    let wheels = [];
    
    shadow = textureLoader.load( 'resources/textures/car_shadow.png' );
    gltfLoader.load('resources/models/car.glb', function (gltf) {

        let carModel = gltf.scene.children[0];

        carModel.scale.set(0.6,1,1);

        carModel.position.x = offset;
        carModel.position.z = OBJ_DISTANCE;

        let bodyMaterial = new THREE.MeshPhysicalMaterial( {
            color: 0xff0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
        } );
        let detailsMaterial = new THREE.MeshStandardMaterial( {
            color: 0xffffff, metalness: 1.0, roughness: 0.5
        } );

        let glassMaterial = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff, metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true
        } );
        carModel.getObjectByName('body').material = bodyMaterial;

        carModel.getObjectByName('rim_fl').material = detailsMaterial;
        carModel.getObjectByName('rim_fr').material = detailsMaterial;
        carModel.getObjectByName('rim_rr').material = detailsMaterial;
        carModel.getObjectByName('rim_rl').material = detailsMaterial;
        carModel.getObjectByName('trim').material = detailsMaterial;

        carModel.getObjectByName('glass').material = glassMaterial;

        wheels.push(
            carModel.getObjectByName('wheel_fl'),
            carModel.getObjectByName('wheel_fr'),
            carModel.getObjectByName('wheel_rl'),
            carModel.getObjectByName('wheel_rr')
        );

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
        // add box to card (check collision)
        let carBox = new Physijs.BoxMesh(
            new THREE.CubeGeometry(1, 3, 4.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: IS_DEBUG ? 1 : BOX_OPACITY }),
            100000
        );

        carBox.position.set(offset,0,OBJ_DISTANCE);

        cars.push({box: carBox, model: carModel, wheels: wheels});

        scene.add(carBox);
        scene.add(carModel);

    }.bind(this));

}

function addBuilding(scene, isRight) {
    let box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(2, 10, 2),
        new THREE.MeshBasicMaterial({ map: textureLoader.load('resources/textures/building.jpg') }),
        100000
    );
    box.position.set((isRight ? -1 : 1) * 3, 5, OBJ_DISTANCE);
    box.castShadow = true;
    scene.add(box);
}


