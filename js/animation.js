var skeleton, playerBox = null;

const leftUpperLegFinal = { x: UPPER_LEG_FINISH };
const rightUpperLegFinal = { x: UPPER_LEG_FINISH };
const leftLegFinal = { x: LEG_FINISH };
const rightLegFinal = { x: LEG_FINISH };

const leftArmFinal = { x: ARM_FINISH };
const rightArmFinal = { x: ARM_FINISH };
const leftHandFinal = { y: -1 * HAND_FINISH };
const rightHandFinal = { y: HAND_FINISH };


function run() {
    console.log("skeleton is %o", skeleton);
    while (!skeleton) {
        // waiting for skeleton to be loaded
    }

    moveLegs();
    moveArms();
    moveCharacter();
}

function moveLegs() {

    let leftUpperLeg = skeleton.bones[0].children[1];
    let leftUpperLegInit = { x: leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };

    let tweenLeftUpperLeg = new TWEEN.Tween(leftUpperLegInit)
        .to(leftUpperLegFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (leftUpperLegFinal.x) leftUpperLeg.rotation.x = d.x;
            if (leftUpperLegFinal.y) leftUpperLeg.rotation.y = d.y;
            if (leftUpperLegFinal.z) leftUpperLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let leftLeg = skeleton.bones[0].children[1].children[0];
    let leftLegInit = { x: leftLeg.rotation.x, y: leftLeg.rotation.y, z: leftLeg.rotation.z };

    let tweenLeftLeg = new TWEEN.Tween(leftLegInit)
        .to(leftLegFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (leftLegFinal.x) leftLeg.rotation.x = d.x;
            if (leftLegFinal.y) leftLeg.rotation.y = d.y;
            if (leftLegFinal.z) leftLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightUpperLeg = skeleton.bones[0].children[2];
    let rightUpperLegInit = { x: rightUpperLeg.rotation.x, y: rightUpperLeg.rotation.y, z: rightUpperLeg.rotation.z };

    let tweenRightUpperLeg = new TWEEN.Tween(rightUpperLegInit)
        .to(rightUpperLegFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (rightUpperLegFinal.x) rightUpperLeg.rotation.x = d.x;
            if (rightUpperLegFinal.y) rightUpperLeg.rotation.y = d.y;
            if (rightUpperLegFinal.z) rightUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftUpperLeg.to(leftUpperLegFinal, RUNNING_SPEED).repeat(1);
            tweenLeftUpperLeg.start();
        })
        .repeat(1)
        .yoyo(true);

    let rightLeg = skeleton.bones[0].children[2].children[0];
    let rightLegInit = { x: rightLeg.rotation.x, y: rightLeg.rotation.y, z: rightLeg.rotation.z };

    let tweenRightLeg = new TWEEN.Tween(rightLegInit)
        .to(rightLegFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (rightLegFinal.x) rightLeg.rotation.x = d.x;
            if (rightLegFinal.y) rightLeg.rotation.y = d.y;
            if (rightLegFinal.z) rightLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftLeg.to(leftLegFinal, RUNNING_SPEED).repeat(1);
            tweenLeftLeg.start();
        })
        .repeat(1)
        .yoyo(true);

    tweenLeftUpperLeg.onComplete(() => {
        tweenRightUpperLeg.to(rightUpperLegFinal, RUNNING_SPEED).repeat(1);
        tweenRightUpperLeg.start();
    })

    tweenLeftLeg.onComplete(() => {
        tweenRightLeg.to(rightLegFinal, RUNNING_SPEED).repeat(1);
        tweenRightLeg.start();
    })

    tweenLeftUpperLeg.start();
    tweenLeftLeg.start();
}

function moveArms() {
    let leftArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0];
    let leftArmInit = { x: leftArm.rotation.x, y: leftArm.rotation.y, z: leftArm.rotation.z };

    let tweenLeftArm = new TWEEN.Tween(leftArmInit)
        .to(leftArmFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (leftArmFinal.x) leftArm.rotation.x = d.x;
            if (leftArmFinal.y) leftArm.rotation.y = d.y;
            if (leftArmFinal.z) leftArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0];
    let rightArmInit = { x: rightArm.rotation.x, y: rightArm.rotation.y, z: rightArm.rotation.z };

    let tweenRightArm = new TWEEN.Tween(rightArmInit)
        .to(rightArmFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (rightArmFinal.x) rightArm.rotation.x = d.x;
            if (rightArmFinal.y) rightArm.rotation.y = d.y;
            if (rightArmFinal.z) rightArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true)
        .onComplete(() => {
            tweenLeftArm.to(leftArmFinal, RUNNING_SPEED).repeat(1);
            tweenLeftArm.start();
        });


    tweenLeftArm.onComplete(() => {
        tweenRightArm.to(rightArmFinal, RUNNING_SPEED).repeat(1);
        tweenRightArm.start();
    })

    let rightHand = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].children[0];
    let rightHandInit = { x: rightHand.rotation.x, y: rightHand.rotation.y, z: rightHand.rotation.z };

    let tweenRightHand = new TWEEN.Tween(rightHandInit)
        .to(rightHandFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (rightHandFinal.x) rightHand.rotation.x = d.x;
            if (rightHandFinal.y) rightHand.rotation.y = d.y;
            if (rightHandFinal.z) rightHand.rotation.z = d.z;
        });


    let leftHand = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    let leftHandInit = { x: leftHand.rotation.x, y: leftHand.rotation.y, z: leftHand.rotation.z };

    let tweenLeftHand = new TWEEN.Tween(leftHandInit)
        .to(leftHandFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate((d) => {
            if (leftHandFinal.x) leftHand.rotation.x = d.x;
            if (leftHandFinal.y) leftHand.rotation.y = d.y;
            if (leftHandFinal.z) leftHand.rotation.z = d.z;
        });

    tweenLeftHand.start();
    tweenRightArm.start();
    tweenRightHand.start();
}

function moveCharacter() {

    document.addEventListener(
        'keydown',
        function (ev) {
            switch (ev.keyCode) {
                case 37:
                    // Left
                    if (skeleton.bones[0].position.x < 340) {
                        //console.log("left", skeleton.bones[0].position.x);
                        skeleton.bones[0].position.x += MOVING_SPEED;
                        playerBox.position.set(playerBox.position.x + (0.010 * MOVING_SPEED), 0, 0);
                        camera.position.set(camera.position.x + (0.010 * MOVING_SPEED), 1, -4);
                        playerBox.__dirtyPosition = true;
                    }
                    break;
                case 39:
                    // Right
                    if (skeleton.bones[0].position.x > -340) {
                        //console.log("right", skeleton.bones[0].position.x);
                        playerBox.position.set(playerBox.position.x - (0.010 * MOVING_SPEED), 0, 0);
                        playerBox.__dirtyPosition = true;
                        camera.position.set(camera.position.x - (0.010 * MOVING_SPEED), 1, -4);
                        skeleton.bones[0].position.x -= MOVING_SPEED;
                    }
                    break;
            }
        }
    );

}