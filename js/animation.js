var skeleton, playerBox = null;
/** tweens used within the run animation */
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
/**
 * stop a set of tween animations
 * @param {*} animationTween 
 */
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
/**
 * starts the run animation
 */
function run() {
    while (!skeleton) {
        // waiting for skeleton to be loaded
    }

    skeleton.children[0].rotation.x = 0.5;
    skeleton.position.y = 130;
    moveShoulders();
    moveLegs();
    moveFeet();
    moveArms();
    initBody()
    moveCharacter();
}
/**
 * set the body of the character in the run starting position
 */
function initBody() {
    let bones = skeleton;
    let bonesInit = { y: bones.position.y = 130 }

    runTween.bones = new TWEEN.Tween(bonesInit)
        .to({ y: 132 }, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            bones.position.y = d.y;
        })

        .repeat(Infinity)
        .yoyo(true);
    runTween.bones.start();
}

/**
 * move the legs of the character while running
 */
function moveLegs() {

    let leftUpperLeg = skeleton.children[1];
    runTween.leftUpperLeg = new TWEEN.Tween(leftUpperLeg.rotation)
        .to(UPPER_LEG_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (UPPER_LEG_FINAL.x) leftUpperLeg.rotation.x = d.x;
            if (UPPER_LEG_FINAL.y) leftUpperLeg.rotation.y = d.y;
            if (UPPER_LEG_FINAL.z) leftUpperLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let leftLeg = skeleton.children[1].children[0];
    runTween.leftLeg = new TWEEN.Tween(leftLeg.rotation)
        .to(LEG_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEG_FINAL.x) leftLeg.rotation.x = d.x;
            if (LEG_FINAL.y) leftLeg.rotation.y = d.y;
            if (LEG_FINAL.z) leftLeg.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightUpperLeg = skeleton.children[2];
    runTween.rightUpperLeg = new TWEEN.Tween(rightUpperLeg.rotation)
        .to(UPPER_LEG_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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

    let rightLeg = skeleton.children[2].children[0];
    runTween.rightLeg = new TWEEN.Tween(rightLeg.rotation)
        .to(LEG_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
/**
 * move the feet of the character while running
 */
function moveFeet() {
    let leftFoot = skeleton.children[1].children[0];
    runTween.leftFoot = new TWEEN.Tween(leftFoot.rotation)
        .to(FOOT_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (FOOT_FINAL.x) leftFoot.rotation.x = d.x;
            if (FOOT_FINAL.y) leftFoot.rotation.y = d.y;
            if (FOOT_FINAL.z) leftFoot.rotation.z = d.z;
        })

        .onComplete(() => {
            runTween.leftFoot.to(FOOT_FINAL, MOVING_TORSO_SPEED);
            runTween.leftFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);



    let rightFoot = skeleton.children[2].children[0];
    runTween.rightFoot = new TWEEN.Tween(rightFoot.rotation)
        .to(FOOT_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (FOOT_FINAL.x) rightFoot.rotation.x = d.x;
            if (FOOT_FINAL.y) rightFoot.rotation.y = d.y;
            if (FOOT_FINAL.z) rightFoot.rotation.z = d.z;
        })

        .onComplete(() => {
            runTween.rightFoot.to(FOOT_FINAL, MOVING_TORSO_SPEED);
            runTween.rightFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);

    runTween.leftFoot.start();
    runTween.rightFoot.start();
}

/**
 * move the arms of the character while running
 */
function moveArms() {
    let leftArm = skeleton.children[0].children[0].children[0].children[1].children[0];
    runTween.leftArm = new TWEEN.Tween({ x: leftArm.rotation.x = -Math.PI / 4, y: leftArm.rotation.y, z: leftArm.rotation.z })
        .to(ARM_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (ARM_FINAL.x) leftArm.rotation.x = d.x;
            if (ARM_FINAL.y) leftArm.rotation.y = d.y;
            if (ARM_FINAL.z) leftArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightArm = skeleton.children[0].children[0].children[0].children[2].children[0];
    runTween.rightArm = new TWEEN.Tween({ x: rightArm.rotation.x = -Math.PI / 4, y: rightArm.rotation.y, z: rightArm.rotation.z })
        .to(ARM_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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

    let rightHand = skeleton.children[0].children[0].children[0].children[2].children[0].children[0];
    runTween.rightHand = new TWEEN.Tween({ x: rightHand.rotation.x/*=Math.PI/4*/, y: rightHand.rotation.y, z: rightHand.rotation.z })
        .to(RIGHT_HAND_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (RIGHT_HAND_FINAL.x) rightHand.rotation.x = d.x;
            if (RIGHT_HAND_FINAL.y) rightHand.rotation.y = d.y;
            if (RIGHT_HAND_FINAL.z) rightHand.rotation.z = d.z;
        });


    let leftHand = skeleton.children[0].children[0].children[0].children[1].children[0].children[0];
    runTween.leftHand = new TWEEN.Tween({ x: leftHand.rotation.x, y: leftHand.rotation.y, z: leftHand.rotation.z })
        .to(LEFT_HAND_FINAL, RUNNING_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEFT_HAND_FINAL.x) leftHand.rotation.x = d.x;
            if (LEFT_HAND_FINAL.y) leftHand.rotation.y = d.y;
            if (LEFT_HAND_FINAL.z) leftHand.rotation.z = d.z;
        });

    runTween.leftHand.start();
    runTween.rightArm.start();
    runTween.rightHand.start();
}

/**
 * move the shoulder of the character while running
 */
function moveShoulders() {

    let leftShoulder = skeleton.children[0].children[0].children[0].children[1];
    runTween.leftShoulder = new TWEEN.Tween(leftShoulder.rotation)
        .to(SHOULDER_FINAL, MOVING_TORSO_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (SHOULDER_FINAL.x) leftShoulder.rotation.x = d.x;
            if (SHOULDER_FINAL.y) leftShoulder.rotation.y = d.y;
            if (SHOULDER_FINAL.z) leftShoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.rightShoulder.to(SHOULDER_FINAL, MOVING_TORSO_SPEED);
            runTween.rightShoulder.start();
        })
        .repeat(Infinity)
        .yoyo(true);


    let rightShoulder = skeleton.children[0].children[0].children[0].children[2];
    runTween.rightShoulder = new TWEEN.Tween(rightShoulder.rotation)
        .to(SHOULDER_FINAL, MOVING_TORSO_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (SHOULDER_FINAL.x) rightShoulder.rotation.x = d.x;
            if (SHOULDER_FINAL.y) rightShoulder.rotation.y = d.y;
            if (SHOULDER_FINAL.z) rightShoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.leftShoulder.to(SHOULDER_FINAL, MOVING_TORSO_SPEED);
            runTween.leftShoulder.start();
        })
        .repeat(Infinity)
        .yoyo(true);

    //Torso
    let torso = skeleton.children[0];
    let torsoInit = { y: torso.rotation.y }
    runTween.torso = new TWEEN.Tween(torsoInit)
        .to(TORSO_FINAL, MOVING_TORSO_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (TORSO_FINAL.x) torso.rotation.x = d.x;
            if (TORSO_FINAL.y) torso.rotation.y = d.y;
            if (TORSO_FINAL.z) torso.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.torso.to(TORSO_FINAL, MOVING_TORSO_SPEED);
            runTween.torso.start();
        })
        .repeat(Infinity)
        .yoyo(true);

    //Bones
    let bonesRun = skeleton;
    let bonesInit = { x: bonesRun.rotation.x, y: bonesRun.rotation.y = -0.1, z: bonesRun.rotation.z }
    runTween.bonesRun = new TWEEN.Tween(bonesInit)
        .to(BONES_FINAL_RUN, MOVING_BONES_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (BONES_FINAL_RUN.x) bonesRun.rotation.x = d.x;
            if (BONES_FINAL_RUN.y) bonesRun.rotation.y = d.y;
            if (BONES_FINAL_RUN.z) bonesRun.rotation.z = d.z;
        })
        .onComplete(() => {
            runTween.bonesRun.to(BONES_FINAL_RUN, MOVING_BONES_SPEED);
            runTween.bonesRun.start();
        })
        .repeat(Infinity)
        .yoyo(true);


    runTween.bonesRun.start();
    runTween.torso.start();
    runTween.leftShoulder.start();
    runTween.rightShoulder.start();

}

/**
 * performs the collision animation of the character
 */
function fallDown() {

    //left Upper Leg
    let leftUpperLeg = skeleton.children[1];
    let letfUpperLegInitialRotation = leftUpperLeg.rotation.clone();
    let tweenleftUpperLeg = new TWEEN.Tween(leftUpperLeg.rotation)
        .to(LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEG_FINISH_FALL_ROTATION.x) leftUpperLeg.rotation.x = d.x;
            if (LEG_FINISH_FALL_ROTATION.y) leftUpperLeg.rotation.y = d.y;
            if (LEG_FINISH_FALL_ROTATION.z) leftUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftUpperLeg.to(LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenleftUpperLeg.start();
        })
        .repeat(1)
        .yoyo(true)

    tweenleftUpperLeg.start();

    //right Upper Leg
    let rightUpperLeg = skeleton.children[2];
    let tweenrightUpperLeg = new TWEEN.Tween(rightUpperLeg.rotation)
        .to(LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEG_FINISH_FALL_ROTATION.x) rightUpperLeg.rotation.x = d.x;
            if (LEG_FINISH_FALL_ROTATION.y) rightUpperLeg.rotation.y = d.y;
            if (LEG_FINISH_FALL_ROTATION.z) rightUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenrightUpperLeg.to(LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenrightUpperLeg.start();
        })
        .repeat(1)
        .yoyo(true)


    tweenrightUpperLeg.start();

    //BONES
    let bones = player;
    let tweenBones = new TWEEN.Tween(bones.rotation)
        .to(BONES_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (BONES_FINISH_FALL_ROTATION.x) bones.rotation.x = d.x;
            if (BONES_FINISH_FALL_ROTATION.y) bones.rotation.y = d.y;
            if (BONES_FINISH_FALL_ROTATION.z) bones.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenBones.to(BONES_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenBones.start();
        })

    tweenBones.start();

    let tweenBonesPos = new TWEEN.Tween(player.position)
        .to(BONES_FINISH_FALL_POSITION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {

            if (BONES_FINISH_FALL_POSITION.x) player.position.x = d.x;
            if (BONES_FINISH_FALL_POSITION.y) player.position.y = d.y;
            if (BONES_FINISH_FALL_POSITION.z) player.position.z = d.z;
            camera.position.z += 0.075 * d.z;
        })
        .onComplete(() => {
            tweenBonesPos.to(BONES_FINISH_FALL_POSITION, MOVING_FALL_SPEED);
            tweenBonesPos.start();
        })

    tweenBonesPos.start();

    //shoulder
    let shoulder = skeleton.children[0];
    let tweenShoulder = new TWEEN.Tween(shoulder.rotation)
        .to(SHOULDER_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (SHOULDER_FINISH_FALL_ROTATION.x) shoulder.rotation.x = d.x;
            if (SHOULDER_FINISH_FALL_ROTATION.y) shoulder.rotation.y = d.y;
            if (SHOULDER_FINISH_FALL_ROTATION.z) shoulder.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenShoulder.to(SHOULDER_FINAL, MOVING_FALL_SPEED);
            tweenShoulder.start();
        }).delay(2500)


    tweenShoulder.start();

    //left upper arm
    let leftUpperArm = skeleton.children[0].children[0].children[0].children[1].children[0];
    let tweenLeftUpperArm = new TWEEN.Tween(leftUpperArm.rotation)
        .to(LEFTUPPERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEFTUPPERARM_FINISH_FALL_ROTATION.x) leftUpperArm.rotation.x = d.x;
            if (LEFTUPPERARM_FINISH_FALL_ROTATION.y) leftUpperArm.rotation.y = d.y;
            if (LEFTUPPERARM_FINISH_FALL_ROTATION.z) leftUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftUpperArm.to(SHOULDER_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenLeftUpperArm.start();
        }).delay(2700)


    tweenLeftUpperArm.start();

    //left lower arm
    let leftLowerArm = skeleton.children[0].children[0].children[0].children[1].children[0].children[0];
    let tweenLeftLowerArm = new TWEEN.Tween(leftLowerArm.rotation)
        .to(LEFT_LOWERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEFT_LOWERARM_FINISH_FALL_ROTATION.x) leftLowerArm.rotation.x = d.x;
            if (LEFT_LOWERARM_FINISH_FALL_ROTATION.y) leftLowerArm.rotation.y = d.y;
            if (LEFT_LOWERARM_FINISH_FALL_ROTATION.z) leftLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenLeftLowerArm.to(LEFT_LOWERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenLeftLowerArm.start();
        }).delay(2700)


    tweenLeftLowerArm.start();

    //right upper arm
    let rightUpperArm = skeleton.children[0].children[0].children[0].children[2].children[0];
    let tweenRightUpperArm = new TWEEN.Tween(rightUpperArm.rotation)
        .to(RIGHTUPPERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (RIGHTUPPERARM_FINISH_FALL_ROTATION.x) rightUpperArm.rotation.x = d.x;
            if (RIGHTUPPERARM_FINISH_FALL_ROTATION.y) rightUpperArm.rotation.y = d.y;
            if (RIGHTUPPERARM_FINISH_FALL_ROTATION.z) rightUpperArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightUpperArm.to(RIGHTUPPERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenRightUpperArm.start();
        }).delay(2700);

    tweenRightUpperArm.start();

    //right lower arm
    let rightLowerArm = skeleton.children[0].children[0].children[0].children[2].children[0].children[0];
    let tweenRightLowerArm = new TWEEN.Tween(rightLowerArm.rotation)
        .to(RIGHTLOWERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (RIGHTLOWERARM_FINISH_FALL_ROTATION.x) rightLowerArm.rotation.x = d.x;
            if (RIGHTLOWERARM_FINISH_FALL_ROTATION.y) rightLowerArm.rotation.y = d.y;
            if (RIGHTLOWERARM_FINISH_FALL_ROTATION.z) rightLowerArm.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenRightLowerArm.to(RIGHTLOWERARM_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenRightLowerArm.start();
        }).delay(2700);
    tweenRightLowerArm.start();

    //leftUpperleg
    let tweenleftUpperLeg2 = new TWEEN.Tween(letfUpperLegInitialRotation)
        .to(LEFT_UPPER_LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEFT_UPPER_LEG_FINISH_FALL_ROTATION.x) leftUpperLeg.rotation.x = d.x;
            if (LEFT_UPPER_LEG_FINISH_FALL_ROTATION.y) leftUpperLeg.rotation.y = d.y;
            if (LEFT_UPPER_LEG_FINISH_FALL_ROTATION.z) leftUpperLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftUpperLeg2.to(LEFT_UPPER_LEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenleftUpperLeg2.start();
        }).delay(2500)


    tweenleftUpperLeg2.start();

    //left Lower Leg
    let leftLowerLeg = skeleton.children[1].children[0];
    let tweenleftLowerLeg = new TWEEN.Tween(leftLowerLeg.rotation)
        .to(LOWERLEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LOWERLEG_FINISH_FALL_ROTATION.x) leftLowerLeg.rotation.x = d.x;
            if (LOWERLEG_FINISH_FALL_ROTATION.y) leftLowerLeg.rotation.y = d.y;
            if (LOWERLEG_FINISH_FALL_ROTATION.z) leftLowerLeg.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftLowerLeg.to(LOWERLEG_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenleftLowerLeg.start();
        }).delay(2500)

    tweenleftLowerLeg.start();

    //leftFoot
    let leftFoot = skeleton.children[1].children[0].children[0];
    let tweenleftFoot = new TWEEN.Tween(leftFoot.rotation)
        .to(LEFTFOOT_FINISH_FALL_ROTATION, MOVING_FALL_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (LEFTFOOT_FINISH_FALL_ROTATION.x) leftFoot.rotation.x = d.x;
            if (LEFTFOOT_FINISH_FALL_ROTATION.y) leftFoot.rotation.y = d.y;
            if (LEFTFOOT_FINISH_FALL_ROTATION.z) leftFoot.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenleftFoot.to(LEFTFOOT_FINISH_FALL_ROTATION, MOVING_FALL_SPEED);
            tweenleftFoot.start();
        }).delay(2500)

    tweenleftFoot.start();

}

/**
 * starts the collision animation
 */
function collision() {
    resetCharacter();
    fallDown();
    setTimeout(() => moveHead(), 4000);
}
/**
 * move the head of the character
 */
function moveHead() {
    let head = skeleton.children[0].children[0].children[0].children[0];
    let tweenHead = new TWEEN.Tween(head.rotation)
        .to(HEAD_FINISH_FALL_ROTATION, 180)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            if (HEAD_FINISH_FALL_ROTATION.x) head.rotation.x = d.x;
            if (HEAD_FINISH_FALL_ROTATION.y) head.rotation.y = d.y;
            if (HEAD_FINISH_FALL_ROTATION.z) head.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenHead.to(HEAD_FINISH_FALL_ROTATION, 180)
            tweenHead.start();
        }).repeat(4).yoyo(true);

    tweenHead.start();

}
/**
 * change the left hand fingers position
 */
function jumpSetLeftHand() {
    //Hand left
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].rotation.x = -1.1;
    //Left Hand phalanx 1
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = 1.30
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].rotation.y = 0.30
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].rotation.y = 1.47
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].rotation.y = 1.47
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].rotation.y = 1.47
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].rotation.y = 1.47
    //Left Hand phalanx 2
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].rotation.y = 0.7
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].rotation.y = 1.57
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].rotation.y = 1.57
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].children[0].rotation.y = 1.57
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].children[0].rotation.y = 1.57
    //Left Hand phalanx 3
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0].rotation.x = 3.14
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].children[0].rotation.x = 3.14
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].children[0].children[0].rotation.x = 3.14
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].children[0].children[0].rotation.x = 3.14
}
/**
 * reset the character position
 */
function resetCharacter() {
    //spine
    skeleton.children[0].rotation.x = 0;
    //legs
    skeleton.children[1].rotation.x = 0;
    skeleton.children[2].rotation.x = 0;
    //Hand left
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].rotation.x = 0;
    //Left Hand phalanx 1
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].rotation.y = 0;
    //Left Hand phalanx 2
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].children[0].rotation.y = 0;
    //Left Hand phalanx 3
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[3].children[0].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[4].children[0].children[0].rotation.x = 0;
    //Shoulder
    skeleton.children[1].children[0].rotation.x = 0;
    skeleton.children[2].children[0].rotation.x = 0;
    //Arms
    skeleton.children[0].children[0].children[0].children[1].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[2].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[2].children[0].rotation.x = 0;
    skeleton.children[0].children[0].children[0].children[1].children[0].children[0].rotation.y = 0;
    skeleton.children[0].children[0].children[0].children[2].children[0].children[0].rotation.y = 0;
}
/**
 * prepare the leg of the character for the jump animation, and then start the jump tween
 * @param {*} tweenJump the tween related to the jump lifting animation
 */
function jumpLegMovement(tweenJump) {
    // leg movement
    let leftUpperLeg = skeleton.children[1];
    let tweenLeftUpperLeg = new TWEEN.Tween({ x: leftUpperLeg.rotation.x })
        .to({ x: -0.7 }, JUMP_SPEED - 500)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leftUpperLeg.rotation.x = d.x;
            skeleton.position.y -= d.y;
        })
        .onComplete(() => {
            tweenJump.start();
            new TWEEN.Tween(leftUpperLeg.rotation)
                .to({ x: -1.4 }, JUMP_SPEED - 100)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((d) => {
                    leftUpperLeg.rotation.x = d.x;
                })
                .repeat(1)
                .yoyo(true)
                .start();
        }).repeat(1).yoyo(true)


    tweenLeftUpperLeg.start();
    //right upper leg
    let rightUpperLeg = skeleton.children[2];
    let tweenRightUpperLeg = new TWEEN.Tween({ x: rightUpperLeg.rotation.x })
        .to({ x: -0.7 }, JUMP_SPEED - 500)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            rightUpperLeg.rotation.x = d.x;
        })
        .onComplete(() => {
            new TWEEN.Tween(rightUpperLeg.rotation)
                .to({ x: 1.0 }, JUMP_SPEED - 100)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((d) => {
                    rightUpperLeg.rotation.x = d.x;
                })
                .repeat(1)
                .yoyo(true)
                .start();
        }).repeat(1).yoyo(true);

    tweenRightUpperLeg.start();
}

/**
 * perform the character movement while jumping
 */
function jumpBodyMovement() {

    jumpSetLeftHand();

    // left upper arm
    let leftUpperArm = skeleton.children[0].children[0].children[0].children[1].children[0];
    let tweenleftUpperArm = new TWEEN.Tween(leftUpperArm.rotation)
        .to({ x: -2.5 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leftUpperArm.rotation.x = d.x;
        })
        .repeat(1)
        .yoyo(true);

    tweenleftUpperArm.start();

    //left Lower Arm
    let leftLowerArm = skeleton.children[0].children[0].children[0].children[1].children[0].children[0];
    let tweenleftLowerArm = new TWEEN.Tween(leftLowerArm.rotation)
        .to({ y: -1.27 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leftLowerArm.rotation.x = d.x;
        })

    tweenleftLowerArm.start();
    // right upper arm
    let rightUpperArm = skeleton.children[0].children[0].children[0].children[2].children[0];
    let tweenRightUpperArm = new TWEEN.Tween(rightUpperArm.rotation)
        .to({ x: 1.5 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            rightUpperArm.rotation.x = d.x;
        })
        .repeat(1)
        .yoyo(true);

    tweenRightUpperArm.start();

    //left Lower Arm
    let rightLowerArm = skeleton.children[0].children[0].children[0].children[2].children[0].children[0];
    let tweenRightLowerArm = new TWEEN.Tween(rightLowerArm.rotation)
        .to({ y: 0.5 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            rightLowerArm.rotation.x = d.x;
        })
        .onComplete(() => {
            new TWEEN.Tween(rightLowerArm.rotation)
                .to({ y: 1.5 }, JUMP_SPEED)
                .interpolation(TWEEN.Interpolation.CatmullRom)
                .onUpdate((d) => {
                    rightLowerArm.rotation.x = d.x;
                }).start()
        })
        .yoyo(true)

    tweenRightLowerArm.start();

    //Bones Initial
    let tweenBones = new TWEEN.Tween({ y: skeleton.position.y = 130 })
        .to({ y: skeleton.position.y - 10 }, JUMP_SPEED / 2)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            skeleton.position.y = d.y;
        })
        .onComplete(() => {
            tweenBones.to({ y: 130 }, JUMP_SPEED / 2).start()
        }).repeat(1)
        .yoyo(true);
    tweenBones.start();

    //right lower leg
    let rightLowerLeg = skeleton.children[2].children[0];
    let tweenRightLowerLeg = new TWEEN.Tween({ x: rightLowerLeg.rotation.x })
        .to({ x: 1.0 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            rightLowerLeg.rotation.x = d.x;
        })
        .repeat(1)
        .yoyo(true);

    //Left lower leg
    let leftLowerLeg = skeleton.children[1].children[0];
    let tweenLeftLowerLeg = new TWEEN.Tween({ x: leftLowerLeg.rotation.x })
        .to({ x: -0.2 }, JUMP_SPEED)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leftLowerLeg.rotation.x = d.x;
        })
        .repeat(1)
        .yoyo(true);

    tweenRightLowerLeg.start();
    tweenLeftLowerLeg.start();

    //Left foot
    let leftFoot = skeleton.children[1].children[0].children[0];
    let tweenLeftFoot = new TWEEN.Tween(leftFoot.rotation)
        .to({ x: -0.5 }, JUMP_SPEED / 2)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leftFoot.rotation.x = d.x;
        })
        .onComplete(() => {
            tweenLeftFoot.to({ x: 0 }, JUMP_SPEED / 2).start()
        }).repeat(1).yoyo(true);

    tweenLeftFoot.start();

    //right foot
    let rightFoot = skeleton.children[2].children[0].children[0];
    let tweenRightFoot = new TWEEN.Tween(rightFoot.rotation)
        .to({ x: -0.5 }, JUMP_SPEED / 2)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            rightFoot.rotation.x = d.x;
        })
        .onComplete(() => {
            tweenRightFoot.to({ x: 0 }, JUMP_SPEED / 2).start()
        }).repeat(1).yoyo(true)

    tweenRightFoot.start();
}

/**
 * starts the jump animation
 */
function jump() {
    stopAnimation(runTween);
    resetCharacter();

    isJump = true;
    let model = player;
    let boxPosition = playerBox.position.clone();
    let initialRotation = camera.rotation.x;

    let tweenJump = new TWEEN.Tween(model.position)
        .to({ y: model.position.y + 2.3 }, JUMP_SPEED)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate((d) => {
            model.position.set(d.x, d.y, d.z);
            playerBox.position.setY(boxPosition.y + d.y);
            playerBox.__dirtyPosition = true;
            camera.rotation.x = initialRotation - 0.07 * d.y;
        })
        .onComplete(() => {
            isJump = false;
            !gameOver && run();
        }).repeat(1).yoyo(true);

    runTween.leftLeg.stop();
    runTween.rightLeg.stop();
    jumpLegMovement(tweenJump);
    jumpBodyMovement();
    sound.play('jump');
}

/**
 * performs the car animation after collision
 * @param {*} car the car 3d model which will perform the animation
 */
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
/**
 * performs the animation of the car's wheels
 * @param {*} wheelsArray array of wheels 3d objects
 * @param {boolean} isRight true if the wheel is on the right side of the chassis, false otherwise 
 */
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

/**
 * starts the lamp animation after a collision
 * @param {*} lamp the 3d model which will perform the animation 
 */
function lampCollision(lamp) {
    new TWEEN.Tween({ x: 0.1 })
        .to({ x: 0.15 }, 300)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
/**
 * starts the animation of a gazelle
 * @param {*} gazelle the 3d object which will perform the animation
 */
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

/**
 * performs the movement of the gazelle's legs
 * @param {*} legs array of legs
 * @param {*} gazelleTweens array of tweens
 */
function moveGazelleLegs(legs, gazelleTweens) {
    legs.forEach((leg, index) => {

        switch (index) {
            case 0: // back left leg
                let legUpperLeftBackTween = new TWEEN.Tween({ y: 0.7 })
                    .to({ y: leg.rotation.y }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
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
                    .to({ y: 0.7 }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperBackTween)
                break;

            case 2: // front left leg
                let legUpperFrontLeftTween = new TWEEN.Tween(leg.rotation)
                    .to({ y: -0.7 }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                let legLowerFrontLeftTween = new TWEEN.Tween({ x: -0.6 })
                    .to({ x: 0.0 }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .onUpdate((d) => {
                        leg.children[0].rotation.x = d.x;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                gazelleTweens.push(legUpperFrontLeftTween)
                gazelleTweens.push(legLowerFrontLeftTween)
                break;
            case 3: // front right leg
                let legUpperFrontRightTween = new TWEEN.Tween({ y: -0.7 })
                    .to({ y: 0.0 }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .onUpdate((d) => {
                        leg.rotation.y = d.y;
                    })
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

                let legLowerFrontRightTween = new TWEEN.Tween(leg.children[0].rotation)
                    .to({ x: -0.6 }, GAZELLE_SPEED)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
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
/**
 * performs the animation of a tree after a collision
 * @param {*} tree the 3d object which will perform the animation
 */
function treeCollision(tree) {

    let leaf = tree.children[0].children[1];
    new TWEEN.Tween({ x: 0.1 })
        .to({ x: 0.15 }, TREE_COLLISION_SPEED / 5)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            leaf.rotation.x = d.x;
        })
        .onComplete(() => {
            new TWEEN.Tween(tree.rotation)
                .to({ x: Math.PI / 2 }, TREE_COLLISION_SPEED)
                .easing(TWEEN.Easing.Bounce.Out)
                .onUpdate((d) => {
                    tree.rotation.x = d.x;
                })
                .start();

            new TWEEN.Tween(tree.position)
                .to({ z: tree.position.z + 5 }, TREE_COLLISION_SPEED)
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

/**
 * starts the gazelle's collision animation
 * @param {*} gazelle the 3d object which will perform the animation
 */
function gazelleCollision(gazelle) {
    let collisionSpeed = GAZELLE_SPEED + 100;
    gazelle.position.y = 2;
    //Bones
    new TWEEN.Tween(gazelle.rotation)
        .to({ x: Math.PI / 2 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            gazelle.rotation.x = d.x;
        })
        .start()

    //Left Front Leg
    let leftFrontLeg = gazelle.children[0].children[0].children[1];
    new TWEEN.Tween({ y: leftFrontLeg.rotation.y = 0.3 })
        .to({ y: -0.3 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
        .to({ x: -1.3 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
        .to({ y: 0.3 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
        .to({ x: -1.3 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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
        .to({ y: 0 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            gazelle.position.y = d.y;
        }).delay(2900)
        .start()
    //Bones Second Rotation
    new TWEEN.Tween({ x: gazelle.rotation.x = Math.PI / 2 })
        .to({ x: 0 }, collisionSpeed)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate((d) => {
            gazelle.rotation.x = d.x;
        }).delay(2900)
        .start()
}

/**
 * starts the animation which drops the bag from the player's shoulder after a collision
 * @param {*} bag the 3d object which will perform the naimation
 */
function dropBag(bag) {
    new TWEEN.Tween(bag.position)
        .to({ y: 0, z: -1 }, 600)
        .interpolation(TWEEN.Interpolation.CatmullRom)
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