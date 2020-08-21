const gltfLoader = new THREE.GLTFLoader();

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
			new THREE.CubeGeometry( 0.5, 3, 0.5 ),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: CHARACTER_BOX_OPACITY}),
            0
        );
        playerBox.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
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

function addBuilding(scene, isRight) {
    let box = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 2, 10, 2 ),
        new THREE.MeshBasicMaterial({ map: textureLoader.load('resources/textures/building.jpg')}),
        100000
    );
    box.position.set((isRight ? -1 : 1) * 3, 5, 50);
    box.castShadow = true;
    scene.add(box);
}


