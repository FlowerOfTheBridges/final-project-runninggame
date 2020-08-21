const textureLoader = new THREE.TextureLoader();

function createSimpleScenario(scene, anisotropy) {

    scene.background = textureLoader.load('resources/textures/skyline.jpg')//new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 50, 50);

    let groundTexture = textureLoader.load('resources/textures/street.jpg');
    groundTexture.anisotropy = anisotropy;
    groundTexture.repeat.set(5, 10000);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    // let bumper_geom = new THREE.CubeGeometry(50, 50, 50);
    // let bumper = new Physijs.BoxMesh(bumper_geom, Physijs.createMaterial(
    //     new THREE.MeshBasicMaterial({ map: groundTexture }),
    //     .8, // high friction
    //     .4 // low restitution
    // ), 0, { restitution: .2 });
    // //bumper.position.y = 0;
    // //bumper.position.x = 0;
    // bumper.receiveShadow = true;
    // bumper.castShadow = true;
    // scene.add(bumper);

    let groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: groundTexture }),
        .8, // high friction
        .4 // low restitution
    );

    let mesh = new Physijs.PlaneMesh(new THREE.PlaneGeometry(12, 10000), groundMaterial, 5);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    setInterval(() => {
        addBuilding(scene, false);
        addBuilding(scene, true);
    }, 2000);

    setInterval(() => {
        groundTexture.offset.y -= 0.2;
    }, 50)
}