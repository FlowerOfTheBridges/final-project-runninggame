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
        scene.add(model);
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }

            if (node.name == 'Armature') {
                skeleton = new THREE.Skeleton([node.children[0]]);
                console.log(skeleton, skeleton.bones);
            }
            else if(node.name == 'mixamorigRightArm' || node.name == 'mixamorigLeftArm'){
                // set character model arms in standard position
                console.log("shoulder: %o", node);
                node.rotation.z = node.name == 'mixamorigRightArm' ? 1 : -1;
            }
        });
        console.log(dumpObject(model).join('\n'));

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

function addBoxGeometry(color, scene) {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: color }); // 0x00ff00
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}
