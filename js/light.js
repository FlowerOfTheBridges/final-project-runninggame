function createDirectionalLigth(color, intensity, position, shadow, scene, helperOn) {

    let dirLight = new THREE.DirectionalLight(color, intensity);

    dirLight.position.set(position.x, position.y, position.z);
    if (shadow.cast) {
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = shadow.top || 0;
        dirLight.shadow.camera.bottom = shadow.bottom || 0;
        dirLight.shadow.camera.left = shadow.left || 0;
        dirLight.shadow.camera.right = shadow.right || 0;
        dirLight.shadow.camera.near = shadow.near || 0;
        dirLight.shadow.camera.far = shadow.far || 0;
        dirLight.shadow.camera.fov = shadow.fov || 0;
    }
    scene.add(dirLight);


    if (helperOn) {
        let helper = new THREE.DirectionalLightHelper(dirLight);
        scene.add(helper);
    }
}

function createPointLigth(color, intensity, position, helperOn) {

    let pointLight = new THREE.PointLight(color, intensity);
    pointLight.position.set(position[0], position[1], position[2])

    scene.add(pointLight);

    if (helperOn) {
        let helper = new THREE.PointLightHelper(pointLight);
        scene.add(helper);
    }
}

function createHemiLight(color, intensity, position, scene) {

    let hemiLight = new THREE.HemisphereLight(color, intensity); // 0xffffff, 0x444444
    hemiLight.position.set(position[0], position[1], position[2]); // [0, 20, 0]
    scene.add(hemiLight);
}

function createSpotLight(scene, position) {

    let spotLight = new THREE.SpotLight('yellow');
    spotLight.position.set(position.x, position.y, position.z);

	spotLight.intensity = 2;
	// must enable shadow casting ability for the light
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    return spotLight;
}
