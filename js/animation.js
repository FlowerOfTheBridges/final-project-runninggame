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
    console.log("skeleton is %o", skeleton);
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
    let leftUpperLegInit = { x: leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };

    runTween.leftUpperLeg = new TWEEN.Tween(leftUpperLegInit)
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
    let leftLegInit = { x: leftLeg.rotation.x, y: leftLeg.rotation.y, z: leftLeg.rotation.z };

    runTween.leftLeg = new TWEEN.Tween(leftLegInit)
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
    let rightUpperLegInit = { x: rightUpperLeg.rotation.x, y: rightUpperLeg.rotation.y, z: rightUpperLeg.rotation.z };

    runTween.rightUpperLeg = new TWEEN.Tween(rightUpperLegInit)
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
    let rightLegInit = { x: rightLeg.rotation.x, y: rightLeg.rotation.y, z: rightLeg.rotation.z };

    runTween.rightLeg = new TWEEN.Tween(rightLegInit)
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
    let leftFootInit = { x: leftFoot.rotation.x, y: leftFoot.rotation.y, z: leftFoot.rotation.z };

    runTween.leftFoot = new TWEEN.Tween(leftFootInit)
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
    let rightFootInit = { x: rightFoot.rotation.x, y: rightFoot.rotation.y, z: rightFoot.rotation.z };

    runTween.rightFoot = new TWEEN.Tween(rightFootInit)
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
    let leftArmInit = { x: leftArm.rotation.x = -Math.PI / 4, y: leftArm.rotation.y, z: leftArm.rotation.z };

    runTween.leftArm = new TWEEN.Tween(leftArmInit)
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
    let rightArmInit = { x: rightArm.rotation.x = -Math.PI / 4, y: rightArm.rotation.y, z: rightArm.rotation.z };

    runTween.rightArm = new TWEEN.Tween(rightArmInit)
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
    let rightHandInit = { x: rightHand.rotation.x7/*=Math.PI/4*/, y: rightHand.rotation.y, z: rightHand.rotation.z };

    runTween.rightHand = new TWEEN.Tween(rightHandInit)
        .to(RIGHT_HAND_FINAL, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RIGHT_HAND_FINAL.x) rightHand.rotation.x = d.x;
            if (RIGHT_HAND_FINAL.y) rightHand.rotation.y = d.y;
            if (RIGHT_HAND_FINAL.z) rightHand.rotation.z = d.z;
        });


    let leftHand = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    let leftHandInit = { x: leftHand.rotation.x, y: leftHand.rotation.y, z: leftHand.rotation.z };

    runTween.leftHand = new TWEEN.Tween(leftHandInit)
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
    let leftShoulderInit = { x: leftShoulder.rotation.x, y: leftShoulder.rotation.y, z: leftShoulder.rotation.z };

    runTween.leftShoulder = new TWEEN.Tween(leftShoulderInit)
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
    let rightShoulderInit = { x: rightShoulder.rotation.x, y: rightShoulder.rotation.y, z: rightShoulder.rotation.z };

    runTween.rightShoulder = new TWEEN.Tween(rightShoulderInit)
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
    let leftUpperLegInit = { x: leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };


    let tweenleftUpperLeg = new TWEEN.Tween(leftUpperLegInit)
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
    let rightUpperLegInit = { x: rightUpperLeg.rotation.x, y: rightUpperLeg.rotation.y, z: rightUpperLeg.rotation.z };


    let tweenrightUpperLeg = new TWEEN.Tween(rightUpperLegInit)
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
    let bones = skeleton.bones[0];
    let BonesInit = { x: bones.rotation.x, y: bones.rotation.y, z: bones.rotation.z };


    let tweenBones = new TWEEN.Tween(BonesInit)
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

    let bonesPos = skeleton.bones[0];
    let BonesPosInit = { x: bonesPos.position.x, y: bonesPos.position.y, z: bonesPos.position.z };

    let tweenBonesPos = new TWEEN.Tween(BonesPosInit)
        .to(BonesFinalPos, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {

            if (BonesFinalPos.x) bonesPos.position.x = d.x;
            if (BonesFinalPos.y) bonesPos.position.y = d.y;
            if (BonesFinalPos.z) bonesPos.position.z = d.z;
        })
        .onComplete(() => {
            tweenBonesPos.to(BonesFinalPos, MOVING_FALL);
            tweenBonesPos.start();
        })

    tweenBonesPos.start();

    //shoulder
    let shoulder = skeleton.bones[0].children[0];
    let ShoulderInit = { x: shoulder.rotation.x, y: shoulder.rotation.y, z: shoulder.rotation.z };

    let tweenShoulder = new TWEEN.Tween(ShoulderInit)
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
    let LeftUpperArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0];
    let LeftUpperArmInit = { x: LeftUpperArm.rotation.x, y: LeftUpperArm.rotation.y, z: LeftUpperArm.rotation.z };

    let tweenLeftUpperArm = new TWEEN.Tween(LeftUpperArmInit)
        .to(LeftUpperArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftUpperArmFinalFall.x) LeftUpperArm.rotation.x = d.x;
            if (LeftUpperArmFinalFall.y) LeftUpperArm.rotation.y = d.y;
            if (LeftUpperArmFinalFall.z) LeftUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftUpperArm.to(ShoulderFinalFall, MOVING_FALL);
            tweenLeftUpperArm.start();
        }).delay(2700)


    tweenLeftUpperArm.start();

    //left lower arm
    let LeftLowerArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    let LeftLowerArmInit = { x: LeftLowerArm.rotation.x, y: LeftLowerArm.rotation.y, z: LeftLowerArm.rotation.z };

    let tweenLeftLowerArm = new TWEEN.Tween(LeftLowerArmInit)
        .to(LeftLowerArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (LeftLowerArmFinalFall.x) LeftLowerArm.rotation.x = d.x;
            if (LeftLowerArmFinalFall.y) LeftLowerArm.rotation.y = d.y;
            if (LeftLowerArmFinalFall.z) LeftLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftLowerArm.to(LeftLowerArmFinalFall, MOVING_FALL);
            tweenLeftLowerArm.start();
        }).delay(2700)


    tweenLeftLowerArm.start();

    //right upper arm
    let RightUpperArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0];
    let RightUpperArmInit = { x: RightUpperArm.rotation.x, y: RightUpperArm.rotation.y, z: RightUpperArm.rotation.z };

    let tweenRightUpperArm = new TWEEN.Tween(RightUpperArmInit)
        .to(RightUpperArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RightUpperArmFinalFall.x) RightUpperArm.rotation.x = d.x;
            if (RightUpperArmFinalFall.y) RightUpperArm.rotation.y = d.y;
            if (RightUpperArmFinalFall.z) RightUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightUpperArm.to(RightUpperArmFinalFall, MOVING_FALL);
            tweenRightUpperArm.start();
        }).delay(2700)


    tweenRightUpperArm.start();

    //right lower arm
    let RightLowerArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0].children[0];
    let RightLowerArmInit = { x: RightLowerArm.rotation.x, y: RightLowerArm.rotation.y, z: RightLowerArm.rotation.z };

    let tweenRightLowerArm = new TWEEN.Tween(RightLowerArmInit)
        .to(RightLowerArmFinalFall, MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (RightLowerArmFinalFall.x) RightLowerArm.rotation.x = d.x;
            if (RightLowerArmFinalFall.y) RightLowerArm.rotation.y = d.y;
            if (RightLowerArmFinalFall.z) RightLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightLowerArm.to(RightLowerArmFinalFall, MOVING_FALL);
            tweenRightLowerArm.start();
        }).delay(2700)


    tweenRightLowerArm.start();

    //leftUpperleg
    let tweenleftUpperLeg2 = new TWEEN.Tween(leftUpperLegInit)
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
    let leftLowerLegInit = { x: leftLowerLeg.rotation.x, y: leftLowerLeg.rotation.y, z: leftLowerLeg.rotation.z };


    let tweenleftLowerLeg = new TWEEN.Tween(leftLowerLegInit)
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
    let leftFootInit = { x: leftFoot.rotation.x, y: leftFoot.rotation.y, z: leftFoot.rotation.z };

    let tweenleftFoot = new TWEEN.Tween(leftFootInit)
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


    PositionSetCollision();
    move();
    setTimeout(() => moveHead(), 4000);
}

function moveHead() {
    let head = skeleton.bones[0].children[0].children[0].children[0].children[0];
    let headInit = { x: head.rotation.x, y: head.rotation.y, z: head.rotation.z };

    let tweenHead = new TWEEN.Tween(headInit)
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

function PositionSetCollision() {
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
    isJump = true;
    let model = skeleton.bones[0];
    let initialRotation = camera.rotation.x;
    let playerPosition = { x: model.position.x, y: model.position.y, z: model.position.z };
    let modelWorldPosition = model.getWorldPosition().clone();
    let tweenJump = new TWEEN.Tween(playerPosition)
        .to({ y: playerPosition.y + 180 }, 800)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate((d) => {
            model.position.set(d.x, d.y, d.z);
            let worlCoordinates = model.localToWorld(new THREE.Vector3(d.x, d.y, d.z)).y;
            let boxPosition = worlCoordinates - modelWorldPosition.y;
            playerBox.position.setY(boxPosition);
            playerBox.__dirtyPosition = true;
            camera.rotation.x = initialRotation - (worlCoordinates / 150);
        })
        .onComplete(() => {
            isJump = false;
            new TWEEN.Tween(camera.rotation)
                .to({ x: initialRotation })
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate((d) => {
                    camera.rotation.x = d.x;
                }).start();

        }).repeat(1).yoyo(true);

    let leftUpperLeg = skeleton.bones[0].children[1];
    let leftUpperLegInit = { x: leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };

    let leftLegTween = new TWEEN.Tween(leftUpperLegInit)
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
    let rightUpperLegInit = { x: rightUpperLeg.rotation.x, y: rightUpperLeg.rotation.y, z: rightUpperLeg.rotation.z };

    let rightLegTween = new TWEEN.Tween(rightUpperLegInit)
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
    console.log("main %o", main);
    let body = car.getObjectByName('body');
    console.log("body %o", body);
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
    console.log(lamp);
    new TWEEN.Tween(lamp.rotation)
        .to({ x: Math.PI / 2 }, 1500)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate((d) => {
            lamp.rotation.x = d.x;
        })
        .start();

    new TWEEN.Tween(lamp.position)
        .to({ z: lamp.position.z + 5 }, 1500)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onUpdate((d) => {
            lamp.position.z = d.z;
        })
        .start();
}

function moveGazelle(gazelle) {
    let gazelleTweens = [];
    console.log("gazelle %o", gazelle);
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
       
       switch (index){
           
        case 0:
                legsUpperLeftBackInit = {y: 0.7}
                let legUpperLeftBackTween=new TWEEN.Tween(legsUpperLeftBackInit)
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
                legsUpperBackInit={y:leg.rotation.y}
                let legUpperBackTween=new TWEEN.Tween(legsUpperBackInit)
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
                legUpperFrontLeftInit = { y: leg.rotation.y };
                legLowerFrontLeftInit = { x: -0.6}
                
                let legUpperFrontLeftTween = new TWEEN.Tween( legUpperFrontLeftInit)
                    .to({ y: -0.7 }, MOVING_GAZELLE)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                     .repeat(Infinity)
                     .yoyo(true)
                     .start();
    
                let legLowerFrontLeftTween=new TWEEN.Tween(legLowerFrontLeftInit)
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

                legUpperFrontRightInit={y:-0.7};
                legLowerFrontRightInit={x:leg.children[0].rotation.x}

            let legUpperFrontRightTween=new TWEEN.Tween(legUpperFrontRightInit)
                .to({ y: 0.0 }, MOVING_GAZELLE)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .onUpdate((d) => {
                    leg.rotation.y = d.y;
                })
                 .repeat(Infinity)
                 .yoyo(true)
                 .start();

                 let  legLowerFrontRightTween=new TWEEN.Tween(legLowerFrontRightInit)
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
