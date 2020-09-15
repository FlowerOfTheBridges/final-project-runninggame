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
    let hemiLight = new THREE.HemisphereLight(color, intensity);
    hemiLight.position.set(position[0], position[1], position[2]); 
    scene.add(hemiLight);
}