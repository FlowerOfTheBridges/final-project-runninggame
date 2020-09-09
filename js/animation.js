var skeleton, playerBox = null;

//FALL
const BonesFinal = { x: BONES_FINISH_FALL };
const ShoulderFinalFall = { x: SHOULDER_FINISH_FALL };
const LeftUpperArmFinalFall = { x: LEFTUPPERARM_FINISH_FALL };
const LeftLowerArmFinalFall = { y: LEFTLOWERARM_FINISH_FALL };
const LeftUpperLegFinalFall = { x: LEFTUPPERLEG_FINISH_FALLX, z: LEFTUPPERLEG_FINISH_FALLZ };
const LowerLegFinalFall = { x: LOWERLEG_FINISH_FALL };
const BonesFinalPos = { y: BONES_POS_FALLY, z: BONES_POS_FALLZ };
const LeftUpperLegFinalFall1 = { x: LEG_FINISH_FALL };
const RightUpperLegFinalFall1 = { x: LEG_FINISH_FALL };
const leftFootFall = { x: LEFTFOOT_FINISH_FALL };
const HeadFinalFall = { y: HEAD_FINISH_FALL };
const RightLowerArmFinalFall = { y: RIGHTLOWERARM_FINISH_FALL };
const RightUpperArmFinalFall = { x: RIGHTUPPERARM_FINISH_FALL }

var runTween = {
    leftLeg: null,
    rightLeg: null,
    leftUpperLeg: null,
    rightUpperLeg: null,
    leftFoot: null,
    rightFoot: null,
    rightHand: null,
    leftHand: null,
    rightArm: null,
    leftArm: null,
    leftShoulder: null,
    rightShoulder: null
}

function stopAnimation(animationTween) {
    if (Array.isArray(animationTween)) {
        animationTween.forEach(tween => {
            tween.stop();
        });
    }
    else {
        Object.keys(animationTween).forEach(tween => {
            animationTween[tween].stop();
        });
    }
}

function run() {
    while (!skeleton) {
        // waiting for skeleton to be loaded
    }

    skeleton.bones[0].children[0].rotation.x = Math.PI / 5;

    moveShoulders();
    moveLegs();
    moveFoot();
    moveArms();
    moveCharacter();
}

function moveLegs() {

    let leftUpperLeg = skeleton.bones[0].children[1];
    runTween.leftUpperLeg = new TWEEN.Tween(leftUpperLeg.rotation)
        .to(UPPER_LEG_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (UPPER_LEG_FINAL.x) leftUpperLeg.rotation.x = d.x;
            if (UPPER_LEG_FINAL.y) leftUpperLeg.rotation.y = d.y;
            if (UPPER_LEG_FINAL.z) leftUpperLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let leftLeg = skeleton.bones[0].children[1].children[0];
    runTween.leftLeg = new TWEEN.Tween(leftLeg.rotation)
        .to(LEG_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LEG_FINAL.x) leftLeg.rotation.x = d.x;
            if (LEG_FINAL.y) leftLeg.rotation.y = d.y;
            if (LEG_FINAL.z) leftLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightUpperLeg = skeleton.bones[0].children[2];
    runTween.rightUpperLeg = new TWEEN.Tween(rightUpperLeg.rotation)
        .to(UPPER_LEG_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (UPPER_LEG_FINAL.x) rightUpperLeg.rotation.x = d.x;
            if (UPPER_LEG_FINAL.y) rightUpperLeg.rotation.y = d.y;
            if (UPPER_LEG_FINAL.z) rightUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.leftUpperLeg.to(UPPER_LEG_FINAL, RUNNING_SPEED).repeat(1);
            runTween.leftUpperLeg.start();

            sound.play('footstep');
        })
        .repeat(1)
        .yoyo(true);

    let rightLeg = skeleton.bones[0].children[2].children[0];
    runTween.rightLeg = new TWEEN.Tween(rightLeg.rotation)
        .to(LEG_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LEG_FINAL.x) rightLeg.rotation.x = d.x;
            if (LEG_FINAL.y) rightLeg.rotation.y = d.y;
            if (LEG_FINAL.z) rightLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.leftLeg.to(LEG_FINAL, RUNNING_SPEED).repeat(1);
            runTween.leftLeg.start();
        })
        .repeat(1)
        .yoyo(true);

    runTween.leftUpperLeg.onComplete(() => {
        runTween.rightUpperLeg.to(UPPER_LEG_FINAL, RUNNING_SPEED).repeat(1);
        runTween.rightUpperLeg.start();
        sound.play('footstep');
    })

    runTween.leftLeg.onComplete(() => {
        runTween.rightLeg.to(LEG_FINAL, RUNNING_SPEED).repeat(1);
        runTween.rightLeg.start();
    })

    runTween.leftUpperLeg.start();
    runTween.leftLeg.start();
}

function moveFoot() {
    let leftFoot = skeleton.bones[0].children[1].children[0];
    runTween.leftFoot = new TWEEN.Tween(leftFoot.rotation)
        .to(FOOT_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (FOOT_FINAL.x) leftFoot.rotation.x = d.x;
            if (FOOT_FINAL.y) leftFoot.rotation.y = d.y;
            if (FOOT_FINAL.z) leftFoot.rotation.z = d.z;
        })

        .onComplete(() => {
            runTween.leftFoot.to(FOOT_FINAL, MOVING_TORSO);
            runTween.leftFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);



    let rightFoot = skeleton.bones[0].children[2].children[0];
    runTween.rightFoot = new TWEEN.Tween(rightFoot.rotation)
        .to(FOOT_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (FOOT_FINAL.x) rightFoot.rotation.x = d.x;
            if (FOOT_FINAL.y) rightFoot.rotation.y = d.y;
            if (FOOT_FINAL.z) rightFoot.rotation.z = d.z;
        })

        .onComplete(() => {
            runTween.rightFoot.to(FOOT_FINAL, MOVING_TORSO);
            runTween.rightFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);

    runTween.leftFoot.start();
    runTween.rightFoot.start();
}

function moveArms() {
    let leftArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0];
    runTween.leftArm = new TWEEN.Tween({ x: leftArm.rotation.x = -Math.PI / 4, y: leftArm.rotation.y, z: leftArm.rotation.z })
        .to(ARM_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (ARM_FINAL.x) leftArm.rotation.x = d.x;
            if (ARM_FINAL.y) leftArm.rotation.y = d.y;
            if (ARM_FINAL.z) leftArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0];
    runTween.rightArm = new TWEEN.Tween({ x: rightArm.rotation.x = -Math.PI / 4, y: rightArm.rotation.y, z: rightArm.rotation.z })
        .to(ARM_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (ARM_FINAL.x) rightArm.rotation.x = d.x;
            if (ARM_FINAL.y) rightArm.rotation.y = d.y;
            if (ARM_FINAL.z) rightArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true)
        .onComplete(() => {
            runTween.leftArm.to(ARM_FINAL, RUNNING_SPEED).repeat(1);
            runTween.leftArm.start();
        });


    runTween.leftArm.onComplete(() => {
        runTween.rightArm.to(ARM_FINAL, RUNNING_SPEED).repeat(1);
        runTween.rightArm.start();
    })

    let rightHand = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].children[0];
    runTween.rightHand = new TWEEN.Tween({ x: rightHand.rotation.x/*=Math.PI/4*/, y: rightHand.rotation.y, z: rightHand.rotation.z })
        .to(RIGHT_HAND_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RIGHT_HAND_FINAL.x) rightHand.rotation.x = d.x;
            if (RIGHT_HAND_FINAL.y) rightHand.rotation.y = d.y;
            if (RIGHT_HAND_FINAL.z) rightHand.rotation.z = d.z;
        });


    let leftHand = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    runTween.leftHand = new TWEEN.Tween({ x: leftHand.rotation.x, y: leftHand.rotation.y, z: leftHand.rotation.z })
        .to(LEFT_HAND_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LEFT_HAND_FINAL.x) leftHand.rotation.x = d.x;
            if (LEFT_HAND_FINAL.y) leftHand.rotation.y = d.y;
            if (LEFT_HAND_FINAL.z) leftHand.rotation.z = d.z;
        });

    runTween.leftHand.start();
    runTween.rightArm.start();
    runTween.rightHand.start();
}



function moveShoulders() {

    let leftShoulder = skeleton.bones[0].children[0].children[0].children[0].children[1];
    runTween.leftShoulder = new TWEEN.Tween(leftShoulder.rotation)
        .to(SHOULDER_FINAL, MOVING_TORSO)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (SHOULDER_FINAL.x) leftShoulder.rotation.x = d.x;
            if (SHOULDER_FINAL.y) leftShoulder.rotation.y = d.y;
            if (SHOULDER_FINAL.z) leftShoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenShoulder.to(SHOULDER_FINAL, MOVING_TORSO);
            tweenShoulder.start();
        })
        .repeat(Infinity)
        .yoyo(true);


    let rightShoulder = skeleton.bones[0].children[0].children[0].children[0].children[2];
    runTween.rightShoulder = new TWEEN.Tween(rightShoulder.rotation)
        .to(SHOULDER_FINAL, MOVING_TORSO)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (SHOULDER_FINAL.x) rightShoulder.rotation.x = d.x;
            if (SHOULDER_FINAL.y) rightShoulder.rotation.y = d.y;
            if (SHOULDER_FINAL.z) rightShoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.leftShoulder.to(SHOULDER_FINAL, MOVING_TORSO);
            runTween.leftShoulder.start();
        })
        .repeat(Infinity)
        .yoyo(true);

    runTween.leftShoulder.start();
    runTween.rightShoulder.start();
}

function move() {

    //left Upper Leg
    let leftUpperLeg = skeleton.bones[0].children[1];
    let letfUpperLegInitialRotation = leftUpperLeg.rotation.clone();
    let tweenleftUpperLeg = new TWEEN.Tween(leftUpperLeg.rotation)
        .to(LeftUpperLegFinalFall1, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftUpperLegFinalFall1.x) leftUpperLeg.rotation.x = d.x;
            if (LeftUpperLegFinalFall1.y) leftUpperLeg.rotation.y = d.y;
            if (LeftUpperLegFinalFall1.z) leftUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftUpperLeg.to(LeftUpperLegFinalFall1, MOVING_FALL);
            tweenleftUpperLeg.start();
        })
        .repeat(1)
        .yoyo(true)

    tweenleftUpperLeg.start();

    //right Upper Leg
    let rightUpperLeg = skeleton.bones[0].children[2];
    let tweenrightUpperLeg = new TWEEN.Tween(rightUpperLeg.rotation)
        .to(RightUpperLegFinalFall1, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RightUpperLegFinalFall1.x) rightUpperLeg.rotation.x = d.x;
            if (RightUpperLegFinalFall1.y) rightUpperLeg.rotation.y = d.y;
            if (RightUpperLegFinalFall1.z) rightUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenrightUpperLeg.to(RightUpperLegFinalFall1, MOVING_FALL);
            tweenrightUpperLeg.start();
        })
        .repeat(1)
        .yoyo(true)


    tweenrightUpperLeg.start();

    //BONES
    let bones = player;
    let tweenBones = new TWEEN.Tween(bones.rotation)
        .to(BonesFinal, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (BonesFinal.x) bones.rotation.x = d.x;
            if (BonesFinal.y) bones.rotation.y = d.y;
            if (BonesFinal.z) bones.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenBones.to(BonesFinal, MOVING_FALL);
            tweenBones.start();
        })

    tweenBones.start();

    let tweenBonesPos = new TWEEN.Tween(player.position)
        .to(BonesFinalPos, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {

            if (BonesFinalPos.x) player.position.x = d.x;
            if (BonesFinalPos.y) player.position.y = d.y;
            if (BonesFinalPos.z) player.position.z = d.z;
            camera.position.z += 0.075 * d.z;
        })
        .onComplete(() => {
            tweenBonesPos.to(BonesFinalPos, MOVING_FALL);
            tweenBonesPos.start();
        })

    tweenBonesPos.start();

    //shoulder
    let shoulder = skeleton.bones[0].children[0];
    let tweenShoulder = new TWEEN.Tween(shoulder.rotation)
        .to(ShoulderFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (ShoulderFinalFall.x) shoulder.rotation.x = d.x;
            if (ShoulderFinalFall.y) shoulder.rotation.y = d.y;
            if (ShoulderFinalFall.z) shoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenShoulder.to(SHOULDER_FINAL, MOVING_FALL);
            tweenShoulder.start();
        }).delay(2500)


    tweenShoulder.start();

    //left upper arm
    let leftUpperArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0];
    let tweenLeftUpperArm = new TWEEN.Tween(leftUpperArm.rotation)
        .to(LeftUpperArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftUpperArmFinalFall.x) leftUpperArm.rotation.x = d.x;
            if (LeftUpperArmFinalFall.y) leftUpperArm.rotation.y = d.y;
            if (LeftUpperArmFinalFall.z) leftUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftUpperArm.to(ShoulderFinalFall, MOVING_FALL);
            tweenLeftUpperArm.start();
        }).delay(2700)


    tweenLeftUpperArm.start();

    //left lower arm
    let leftLowerArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    let tweenLeftLowerArm = new TWEEN.Tween(leftLowerArm.rotation)
        .to(LeftLowerArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftLowerArmFinalFall.x) leftLowerArm.rotation.x = d.x;
            if (LeftLowerArmFinalFall.y) leftLowerArm.rotation.y = d.y;
            if (LeftLowerArmFinalFall.z) leftLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftLowerArm.to(LeftLowerArmFinalFall, MOVING_FALL);
            tweenLeftLowerArm.start();
        }).delay(2700)


    tweenLeftLowerArm.start();

    //right upper arm
    let rightUpperArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0];
    let tweenRightUpperArm = new TWEEN.Tween(rightUpperArm.rotation)
        .to(RightUpperArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RightUpperArmFinalFall.x) rightUpperArm.rotation.x = d.x;
            if (RightUpperArmFinalFall.y) rightUpperArm.rotation.y = d.y;
            if (RightUpperArmFinalFall.z) rightUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightUpperArm.to(RightUpperArmFinalFall, MOVING_FALL);
            tweenRightUpperArm.start();
        }).delay(2700);

    tweenRightUpperArm.start();

    //right lower arm
    let rightLowerArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].children[0];
    let tweenRightLowerArm = new TWEEN.Tween(rightLowerArm.rotation)
        .to(RightLowerArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RightLowerArmFinalFall.x) rightLowerArm.rotation.x = d.x;
            if (RightLowerArmFinalFall.y) rightLowerArm.rotation.y = d.y;
            if (RightLowerArmFinalFall.z) rightLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightLowerArm.to(RightLowerArmFinalFall, MOVING_FALL);
            tweenRightLowerArm.start();
        }).delay(2700);
    tweenRightLowerArm.start();

    //leftUpperleg
    let tweenleftUpperLeg2 = new TWEEN.Tween(letfUpperLegInitialRotation)
        .to(LeftUpperLegFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftUpperLegFinalFall.x) leftUpperLeg.rotation.x = d.x;
            if (LeftUpperLegFinalFall.y) leftUpperLeg.rotation.y = d.y;
            if (LeftUpperLegFinalFall.z) leftUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftUpperLeg2.to(LeftUpperLegFinalFall, MOVING_FALL);
            tweenleftUpperLeg2.start();
        }).delay(2500)


    tweenleftUpperLeg2.start();

    //left Lower Leg
    let leftLowerLeg = skeleton.bones[0].children[1].children[0];
    let tweenleftLowerLeg = new TWEEN.Tween(leftLowerLeg.rotation)
        .to(LowerLegFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LowerLegFinalFall.x) leftLowerLeg.rotation.x = d.x;
            if (LowerLegFinalFall.y) leftLowerLeg.rotation.y = d.y;
            if (LowerLegFinalFall.z) leftLowerLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftLowerLeg.to(LowerLegFinalFall, MOVING_FALL);
            tweenleftLowerLeg.start();
        }).delay(2500)

    tweenleftLowerLeg.start();

    //leftFoot
    let leftFoot = skeleton.bones[0].children[1].children[0].children[0];
    let tweenleftFoot = new TWEEN.Tween(leftFoot.rotation)
        .to(leftFootFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (leftFootFall.x) leftFoot.rotation.x = d.x;
            if (leftFootFall.y) leftFoot.rotation.y = d.y;
            if (leftFootFall.z) leftFoot.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftFoot.to(leftFootFall, MOVING_FALL);
            tweenleftFoot.start();
        }).delay(2500)

    tweenleftFoot.start();

}

function collision() {
    positionSetCollision();
    move();
    setTimeout(() => moveHead(), 4000);
}

function moveHead() {
    let head = skeleton.bones[0].children[0].children[0].children[0].children[0];
    let tweenHead = new TWEEN.Tween(head.rotation)
        .to(HeadFinalFall, 180)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (HeadFinalFall.x) head.rotation.x = d.x;
            if (HeadFinalFall.y) head.rotation.y = d.y;
            if (HeadFinalFall.z) head.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenHead.to(HeadFinalFall, 180)
            tweenHead.start();
        }).repeat(4).yoyo(true);

    tweenHead.start();

}

function positionSetCollision() {
    skeleton.bones[0].children[0].rotation.x = 0;
    skeleton.bones[0].children[1].rotation.x = 0;
    skeleton.bones[0].children[2].rotation.x = 0;
    skeleton.bones[0].children[1].children[0].rotation.x = 0;
    skeleton.bones[0].children[2].children[0].rotation.x = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[1].rotation.y = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[2].rotation.y = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].rotation.x = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].rotation.x = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0].rotation.y = 0;
    skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].children[0].rotation.y = 0;
}

function jump() {
    stopAnimation(runTween);
    isJump = true;
    let model = player;
    //let bagPosition = player.parent.children2[2].position.clone();
    let boxPosition = playerBox.position.clone();
    let initialRotation = camera.rotation.x;
    let tweenJump = new TWEEN.Tween(model.position)
        .to({ y: model.position.y + 3 }, 750)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate((d) => {
            model.position.set(d.x, d.y, d.z);
            playerBox.position.setY(boxPosition.y + d.y);
            playerBox.__dirtyPosition = true;
            camera.rotation.x = initialRotation - 0.07 * d.y;
        })
        .onComplete(() => {
            positionSetCollision();
            isJump = false;
            !gameOver && run();
        }).repeat(1).yoyo(true);

    let leftUpperLeg = skeleton.bones[0].children[1];
    let leftLegTween = new TWEEN.Tween(leftUpperLeg.rotation)
        .to({ x: -1.5 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (UPPER_LEG_FINAL.x) leftUpperLeg.rotation.x = d.x;
            if (UPPER_LEG_FINAL.y) leftUpperLeg.rotation.y = d.y;
            if (UPPER_LEG_FINAL.z) leftUpperLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightUpperLeg = skeleton.bones[0].children[2];
    let rightLegTween = new TWEEN.Tween(rightUpperLeg.rotation)
        .to({ x: 1.0 }, 500)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (UPPER_LEG_FINAL.x) rightUpperLeg.rotation.x = d.x;
            if (UPPER_LEG_FINAL.y) rightUpperLeg.rotation.y = d.y;
            if (UPPER_LEG_FINAL.z) rightUpperLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);


    runTween.leftLeg.stop();
    runTween.rightLeg.stop();
    sound.play('jump');
    tweenJump.start();
    leftLegTween.start();
    rightLegTween.start();

}

function carCollision(car) {

    let main = car.children[0];
    let wheelsL = [];
    let wheelsR = [];
    wheelsL.push(car.getObjectByName('wheel_fl'));
    wheelsR.push(car.getObjectByName('wheel_fr'));
    wheelsL.push(wheelRl = car.getObjectByName('wheel_rl'));
    wheelsR.push(car.getObjectByName('wheel_rr'));

    new TWEEN.Tween(main.position)
        .to({ y: 3 }, 500)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate((d) => {
            main.position.y = d.y;

            if (main.position.y > 1.5) {
                new TWEEN.Tween(main.rotation)
                    .to({ x: Math.PI * 2, y: Math.PI, z: Math.PI }, 500)
                    .easing(TWEEN.Easing.Quartic.Out)
                    .onUpdate((d) => {
                        main.rotation.x = d.x;
                        main.rotation.y = d.y;
                        main.rotation.z = d.z;
                    }).start();
            }
        })
        .repeat(1)
        .yoyo(true).start();

    wheelsCollision(wheelsR, true);
    wheelsCollision(wheelsL, false);
}

function wheelsCollision(wheelsArray, isRight) {
    wheelsArray.forEach((wheel, index) => {
        new TWEEN.Tween(wheel.position)
            .to({ x: wheel.position.x + (isRight ? 2 : -2), z: wheel.position.z + (index == 0 ? 4 : -4) }, 800)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate((d) => {
                wheel.position.x = d.x;
                wheel.position.z = d.z;
            })
            .onComplete(() => {
                new TWEEN.Tween(wheel.rotation)
                    .to({ y: -10, z: -10 }, 1000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate((d) => {
                        wheel.rotation.z = d.z;
                        wheel.rotation.y = d.y;
                    }).start();
            }).start();

        new TWEEN.Tween(wheel.position)
            .to({ y: wheel.position.y + 2 }, 1000)
            .easing(TWEEN.Easing.Bounce.In)
            .onUpdate((d) => {
                wheel.position.y = d.y;
            }).repeat(1)
            .yoyo(true).start();


    })
}

function lampCollision(lamp) {
    new TWEEN.Tween({ x: 0.1 })
        .to({ x: 0.15 }, 300)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            lamp.rotation.x = d.x;
        })
        .onComplete(() => {
            new TWEEN.Tween(lamp.rotation)
                .to({ x: Math.PI / 2 }, 1500)
                .easing(TWEEN.Easing.Bounce.Out)
                .onUpdate((d) => {
                    lamp.rotation.x = d.x;
                })
                .onComplete(() => {
                    new TWEEN.Tween(lamp.position)
                        .to({ y: lamp.position.y - 0.4 }, 500)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .onUpdate((d) => {
                            lamp.position.y = d.y;
                        })
                        .start();
                })
                .start();

            new TWEEN.Tween(lamp.position)
                .to({ z: lamp.position.z + 5 }, 1500)
                .easing(TWEEN.Easing.Sinusoidal.Out)
                .onUpdate((d) => {
                    lamp.position.z = d.z;
                })
                .start();
        })
        .repeat(4)
        .yoyo(true)
        .start();
}

function moveGazelle(gazelle) {
    let gazelleTweens = [];
    //this array contains legs of the gazelle, the animation is done within the moveGazelleLegs function
    let legs = [];

    // each leg has two children
    legs.push(gazelle.getObjectByName('Bone015')); // back left leg
    legs.push(gazelle.getObjectByName('Bone021')); // back right leg
    legs.push(gazelle.getObjectByName('Bone018')); // front left leg
    legs.push(gazelle.getObjectByName('Bone024')); // front right leg
    let oscillationTween = new TWEEN.Tween(gazelle.position)
        .to({ y: gazelle.position.y + 0.2 }, 7000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate((d) => {
            gazelle.position.y = d.y;
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();


    gazelleTweens.push(oscillationTween);
    moveGazelleLegs(legs, gazelleTweens);
    return gazelleTweens;
}

function moveGazelleLegs(legs, gazelleTweens) {
    legs.forEach((leg, index) => {

        switch (index) {
            case 0:
                let legUpperLeftBackTween = new TWEEN.Tween({ y: 0.7 })
                    .to({ y: leg.rotation.y }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperLeftBackTween)
                break;

            //Back Right Leg
            case 1:
                let legUpperBackTween = new TWEEN.Tween(leg.rotation)
                    .to({ y: 0.7 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperBackTween)
                break;

            case 2:
                let legUpperFrontLeftTween = new TWEEN.Tween(leg.rotation)
                    .to({ y: -0.7 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                let legLowerFrontLeftTween = new TWEEN.Tween({ x: -0.6 })
                    .to({ x: 0.0 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.children[0].rotation.x = d.x;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperFrontLeftTween)
                gazelleTweens.push(legLowerFrontLeftTween)
                break;
            case 3:
                let legUpperFrontRightTween = new TWEEN.Tween({ y: -0.7 })
                    .to({ y: 0.0 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                let legLowerFrontRightTween = new TWEEN.Tween(leg.children[0].rotation)
                    .to({ x: -0.6 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.children[0].rotation.x = d.x;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperFrontRightTween)
                gazelleTweens.push(legLowerFrontRightTween)
                break;
        }
    });
}

function gazelleCollision(gazelle) {

    new TWEEN.Tween(gazelle.rotation)
        .to({ x: Math.PI / 2, y: 0 }, 1500)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            gazelle.rotation.y = d.y;
            gazelle.rotation.x = d.x;
        })
        .start();
}

function treeCollision(tree) {

    let leaf = tree.children[0].children[1];
    new TWEEN.Tween({ x: 0.1 })
        .to({ x: 0.15 }, 300)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            leaf.rotation.x = d.x;
        })
        .onComplete(() => {
            new TWEEN.Tween(tree.rotation)
                .to({ x: Math.PI / 2 }, 1500)
                .easing(TWEEN.Easing.Bounce.Out)
                .onUpdate((d) => {
                    tree.rotation.x = d.x;
                })
                .start();

            new TWEEN.Tween(tree.position)
                .to({ z: tree.position.z + 5 }, 1500)
                .easing(TWEEN.Easing.Sinusoidal.Out)
                .onUpdate((d) => {
                    tree.position.z = d.z;
                })
                .start();
        })
        .repeat(4)
        .yoyo(true)
        .start();
}

function gazelleCollision(gazelle) {
    gazelle.position.y = 2;
    //Bones
    new TWEEN.Tween(gazelle.rotation)
        .to({ x: Math.PI / 2 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            gazelle.rotation.x = d.x;
        })
        .start()

    //Left Front Leg
    let leftFrontLeg = gazelle.children[0].children[0].children[1];
    new TWEEN.Tween({ y: leftFrontLeg.rotation.y = 0.3 })
        .to({ y: -0.3 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            leftFrontLeg.rotation.y = d.y;
        })
        .onComplete(() => {
            leftFrontLeg.rotation.y = 0;
        })
        .repeat(4)
        .yoyo(true)
        .start()

    //Left Lower Leg
    let leftLowerLeg = gazelle.children[0].children[0].children[1].children[0];
    new TWEEN.Tween({ x: leftLowerLeg.rotation.x })
        .to({ x: -1.3 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            leftLowerLeg.rotation.x = d.x;
        })
        .onComplete(() => {
            leftLowerLeg.rotation.x = 0;
        })

        .repeat(4)
        .yoyo(true)
        .start()


    //Right Front Leg
    let rightFrontLeg = gazelle.children[0].children[0].children[2];
    new TWEEN.Tween({ y: rightFrontLeg.rotation.y = -0.3 })
        .to({ y: 0.3 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            rightFrontLeg.rotation.y = d.y;
        })
        .onComplete(() => {
            rightFrontLeg.rotation.y = 0;
        })

        .repeat(4)
        .yoyo(true)
        .start()

    //Right Lower Leg
    let rightLowerLeg = gazelle.children[0].children[0].children[2].children[0];
    new TWEEN.Tween(rightLowerLeg.rotation)
        .to({ x: -1.3 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            gazelle.children[0].children[0].children[2].children[0].rotation.x = d.x;
        })
        .onComplete(() => {
            gazelle.children[0].children[0].children[2].children[0].rotation.x = 0;
        })
        .repeat(4)
        .yoyo(true)
        .start()

    //Bones Final Position
    new TWEEN.Tween(gazelle.position)
        .to({ y: 0 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            gazelle.position.y = d.y;
        }).delay(2900)
        .start()
    //Bones Second Rotation
    new TWEEN.Tween({ x: gazelle.rotation.x = Math.PI / 2 })
        .to({ x: 0 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            gazelle.rotation.x = d.x;
        }).delay(2900)
        .start()
}

function dropBag(bag) {
    new TWEEN.Tween(bag.position)
        .to({ y: 0, z: -1 }, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            bag.rotation.x -= 0.1;
            bag.position.y = d.y;
            bag.position.z = d.z;
        })
        .onComplete(() => {
            player.remove(bag);
        })
        .start();
}