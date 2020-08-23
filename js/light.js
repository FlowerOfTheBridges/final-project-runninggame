function positionCheck(position) {
    if (!Array.isArray(position) && position.length != 3) {
        throw 'position must be an array with three numerical values';
    }
}

function createDirectionalLigth(color, intensity, position, shadow, scene, helperOn) {

    positionCheck(position);

    let dirLight = new THREE.DirectionalLight(color, intensity);

    dirLight.position.set(position[0], position[1], position[2]);
    if (shadow.cast) {
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = shadow.top || 0;
        dirLight.shadow.camera.bottom = shadow.bottom || 0;
        dirLight.shadow.camera.left = shadow.left || 0;
        dirLight.shadow.camera.right = shadow.right || 0;
        dirLight.shadow.camera.near = shadow.near || 0;
        dirLight.shadow.camera.far = shadow.far;
    }
    scene.add(dirLight);


    if (helperOn) {
        let helper = new THREE.DirectionalLightHelper(dirLight);
        scene.add(helper);
    }
}

function createHemiLight(color, intensity, position, scene) {
    positionCheck(position);

    let hemiLight = new THREE.HemisphereLight(color, intensity); // 0xffffff, 0x444444
    hemiLight.position.set(position[0], position[1], position[2]); // [0, 20, 0]
    scene.add(hemiLight);
}

function createSpotLight(scene, position, helperOn) {

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(position.x, position.y, position.z);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    if (helperOn) {
        let helper = new THREE.SpotLightHelper(spotLight);
        scene.add(helper);
    }
    return spotLight;
}
