var skeleton, playerBox = null;

const leftUpperLegFinal = { x: UPPER_LEG_FINISH };
const rightUpperLegFinal = { x: UPPER_LEG_FINISH };
const leftLegFinal = { x: LEG_FINISH };
const rightLegFinal = { x: LEG_FINISH };


const leftArmFinal = { x: ARM_FINISH };
const rightArmFinal = { x: ARM_FINISH };
const leftHandFinal = { y: -1 * HAND_FINISH };
const rightHandFinal = { y: HAND_FINISH };
const TorsoFinal = {y:TORSO_FINISH, x:TORSO_FINISH};
const TorsoFinal2 = {y:TORSO_FINISH, x:TORSO_FINISH};
const leftFootFinal = {x: FOOT_FINISH};
const rightFootFinal = {x: FOOT_FINISH};

//FALL
const BonesFinal = {x: BONES_FINISH_FALL};
const TorsoFinalFall = {x: TORSO_FINISH_FALL};
const LeftUpperArmFinalFall = {x: LEFTUPPERARM_FINISH_FALL};
const LeftLowerArmFinalFall = {y: LEFTLOWERARM_FINISH_FALL};
const LeftUpperLegFinalFall = {x: LEFTUPPERLEG_FINISH_FALLX, z: LEFTUPPERLEG_FINISH_FALLZ};
const LowerLegFinalFall ={x: LOWERLEG_FINISH_FALL };
const BonesFinalPos = {y: BONES_POS_FALLY, z: BONES_POS_FALLZ };
const LeftUpperLegFinalFall1 ={x: LEG_FINISH_FALL};
const RightUpperLegFinalFall1 ={x: LEG_FINISH_FALL};
const leftFootFall = {x: LEFTFOOT_FINISH_FALL};
const HeadFinalFall ={y: HEAD_FINISH_FALL};



function run() {
    console.log("skeleton is %o", skeleton);
    while (!skeleton) {
        // waiting for skeleton to be loaded
    }
    skeleton.bones[0].children[0].rotation.x= Math.PI/5;
   
    moveTorso();
    moveLegs();
    moveFoot()
    moveArms();
    moveCharacter();
   
   
}

function moveLegs() {

    let leftUpperLeg = skeleton.bones[0].children[1];
    let leftUpperLegInit = { x: leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };
    
    let tweenLeftUpperLeg = new TWEEN.Tween(leftUpperLegInit)
        .to(leftUpperLegFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
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
        .easing(TWEEN.Easing.Sinusoidal.In)
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
        .easing(TWEEN.Easing.Sinusoidal.In)
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
        .easing(TWEEN.Easing.Sinusoidal.In)
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

function moveFoot() {

    let leftFoot = skeleton.bones[0].children[1].children[0];
    let leftFootInit = { x: leftFoot.rotation.x, y: leftFoot.rotation.y, z: leftFoot.rotation.z };
    
    let tweenLeftFoot = new TWEEN.Tween(leftFootInit)
        .to(leftFootFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (leftFootFinal.x) leftFoot.rotation.x = d.x;
            if (leftFootFinal.y) leftFoot.rotation.y = d.y;
            if (leftFootFinal.z) leftFoot.rotation.z = d.z;})
        
        .onComplete(() => {
            tweenLeftFoot.to(leftFootFinal, MOVING_TORSO);
            tweenLeftFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);
       


    let rightFoot = skeleton.bones[0].children[2].children[0];
    let rightFootInit = { x: rightFoot.rotation.x, y: rightFoot.rotation.y, z: rightFoot.rotation.z };
    
    let tweenrightFoot = new TWEEN.Tween(rightFootInit)
        .to(rightFootFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (rightFootFinal.x) rightFoot.rotation.x = d.x;
            if (rightFootFinal.y) rightFoot.rotation.y = d.y;
            if (rightFootFinal.z) rightFoot.rotation.z = d.z;})
        
        .onComplete(() => {
            tweenrightFoot.to(rightFootFinal, MOVING_TORSO);
            tweenrightFoot.start();
        })
        .repeat(Infinity)
        .yoyo(true);
        
        tweenLeftFoot.start();
        tweenrightFoot.start();
        

    
}

function moveArms() {
    let leftArm = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0];
    let leftArmInit = { x: leftArm.rotation.x=-Math.PI/4, y: leftArm.rotation.y, z: leftArm.rotation.z };
    

    let tweenLeftArm = new TWEEN.Tween(leftArmInit)
        .to(leftArmFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (leftArmFinal.x) leftArm.rotation.x = d.x;
            if (leftArmFinal.y) leftArm.rotation.y = d.y;
            if (leftArmFinal.z) leftArm.rotation.z = d.z;
        })
        .repeat(1)
        .yoyo(true);

    let rightArm = skeleton.bones[0].children[0].children[0].children[0].children[2].children[0];
    let rightArmInit = { x: rightArm.rotation.x=-Math.PI/4, y: rightArm.rotation.y, z: rightArm.rotation.z };

    let tweenRightArm = new TWEEN.Tween(rightArmInit)
        .to(rightArmFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
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
    let rightHandInit = { x: rightHand.rotation.x7/*=Math.PI/4*/, y: rightHand.rotation.y, z: rightHand.rotation.z };
    
    let tweenRightHand = new TWEEN.Tween(rightHandInit)
        .to(rightHandFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (rightHandFinal.x) rightHand.rotation.x = d.x;
            if (rightHandFinal.y) rightHand.rotation.y = d.y;
            if (rightHandFinal.z) rightHand.rotation.z = d.z;
        });


    let leftHand = skeleton.bones[0].children[0].children[0].children[0].children[1].children[0].children[0];
    let leftHandInit = { x: leftHand.rotation.x, y: leftHand.rotation.y, z: leftHand.rotation.z };

    let tweenLeftHand = new TWEEN.Tween(leftHandInit)
        .to(leftHandFinal, RUNNING_SPEED)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (leftHandFinal.x) leftHand.rotation.x = d.x;
            if (leftHandFinal.y) leftHand.rotation.y = d.y;
            if (leftHandFinal.z) leftHand.rotation.z = d.z;
        });

    tweenLeftHand.start();
    tweenRightArm.start();
    tweenRightHand.start();
}



function moveTorso() {
    
    let Torso = skeleton.bones[0].children[0].children[0].children[0].children[1];
    let TorsoInit = { x: Torso.rotation.x, y: Torso.rotation.y, z: Torso.rotation.z };
    

    let tweenTorso = new TWEEN.Tween(TorsoInit)
        .to(TorsoFinal, MOVING_TORSO)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (TorsoFinal.x) Torso.rotation.x = d.x;
            if (TorsoFinal.y) Torso.rotation.y = d.y;
            if (TorsoFinal.z) Torso.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenTorso.to(TorsoFinal, MOVING_TORSO);
            tweenTorso.start();
        })
        .repeat(Infinity)
        .yoyo(true);

       
        let Torso2 = skeleton.bones[0].children[0].children[0].children[0].children[2];
        let TorsoInit2 = { x: Torso2.rotation.x, y: Torso2.rotation.y, z: Torso2.rotation.z };
        
    
        let tweenTorso2 = new TWEEN.Tween(TorsoInit2)
            .to(TorsoFinal2, MOVING_TORSO)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onUpdate((d) => {
                if (TorsoFinal2.x) Torso2.rotation.x = d.x;
                if (TorsoFinal2.y) Torso2.rotation.y = d.y;
                if (TorsoFinal2.z) Torso2.rotation.z = d.z;
            })
            .onComplete(() => {
                tweenTorso.to(TorsoFinal, MOVING_TORSO);
                tweenTorso.start();
            })
            .repeat(Infinity)
            .yoyo(true);

      

        tweenTorso.start();
        tweenTorso2.start();
        
        
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
                        camera.position.set(camera.position.x + (0.010 * MOVING_SPEED), 2, -4);
                        playerBox.__dirtyPosition = true;
                    }
                    break;
                case 39:
                    // Right
                    if (skeleton.bones[0].position.x > -340) {
                        //console.log("right", skeleton.bones[0].position.x);
                        playerBox.position.set(playerBox.position.x - (0.010 * MOVING_SPEED), 0, 0);
                        playerBox.__dirtyPosition = true;
                        camera.position.set(camera.position.x - (0.010 * MOVING_SPEED), 2, -4);
                        skeleton.bones[0].position.x -= MOVING_SPEED;
                    }
                    break;
            }
        }
    );

}

function Move(){
    

    //left Upper Leg
    let leftUpperLeg = skeleton.bones[0].children[1];
    let leftUpperLegInit = { x:leftUpperLeg.rotation.x, y: leftUpperLeg.rotation.y, z: leftUpperLeg.rotation.z };


    let tweenleftUpperLeg = new TWEEN.Tween(leftUpperLegInit)
    .to(LeftUpperLegFinalFall1, MOVING_FALL)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .onUpdate((d) => {
        if (LeftUpperLegFinalFall1.x) leftUpperLeg.rotation.x = d.x;
        if (LeftUpperLegFinalFall1.y) leftUpperLeg.rotation.y = d.y;
        if (LeftUpperLegFinalFall1.z) leftUpperLeg.rotation.z = d.z;
    })
    .onComplete(() => {
     tweenleftUpperLeg.to(LeftUpperLegFinalFall1,MOVING_FALL);
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
     tweenrightUpperLeg.to(RightUpperLegFinalFall1,MOVING_FALL);
     tweenrightUpperLeg.start();
    })
    .repeat(1)
    .yoyo(true)
    
        
    tweenrightUpperLeg.start();

    //BONES
    let bones = skeleton.bones[0];
    let BonesInit = { x: bones.rotation.x, y: bones.rotation.y, z: bones.rotation.z };
    

    let tweenBones= new TWEEN.Tween(BonesInit)
        .to(BonesFinal,  MOVING_FALL)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
           
            if (BonesFinal.x) bones.rotation.x = d.x;
            if (BonesFinal.y) bones.rotation.y = d.y;
            if (BonesFinal.z) bones.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenBones.to(BonesFinal,MOVING_FALL);
            tweenBones.start();
        })
        
        tweenBones.start();

    let bonesPos = skeleton.bones[0];
    let BonesPosInit = { x: bonesPos.position.x, y: bonesPos.position.y, z: bonesPos.position.z };
    

    let tweenBonesPos= new TWEEN.Tween(BonesPosInit)
        .to(BonesFinalPos,  MOVING_FALL+1000)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            
            if (BonesFinalPos.x)  bonesPos.position.x = d.x;
            if (BonesFinalPos.y)  bonesPos.position.y = d.y;
            if (BonesFinalPos.z)  bonesPos.position.z = d.z;
        })
        .onComplete(() => {
            tweenBonesPos.to(BonesFinalPos, MOVING_FALL);
            tweenBonesPos.start();
        })
        
        tweenBonesPos.start();

        //Torso
       let Torso = skeleton.bones[0].children[0];
        let TorsoInit = { x: Torso.rotation.x, y: Torso.rotation.y, z: Torso.rotation.z };
    

        let tweenTorso = new TWEEN.Tween(TorsoInit)
        .to(TorsoFinalFall, 4500)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((d) => {
            if (TorsoFinalFall.x) Torso.rotation.x = d.x;
            if (TorsoFinalFall.y) Torso.rotation.y = d.y;
            if (TorsoFinalFall.z) Torso.rotation.z = d.z;
        })
        .onComplete(() => {
            tweenTorso.to(TorsoFinal, MOVING_FALL);
            tweenTorso.start();
        }).delay(5700)
        
            
        tweenTorso.start();
        


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
             tweenLeftUpperArm.to(TorsoFinalFall,MOVING_FALL);
             tweenLeftUpperArm.start();
         }).delay(5700)
         
             
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
            tweenLeftLowerArm.to(LeftLowerArmFinalFall,MOVING_FALL);
            tweenLeftLowerArm.start();
         }).delay(5700)
         
             
         tweenLeftLowerArm.start();

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
            tweenleftUpperLeg2.to(LeftUpperLegFinalFall,MOVING_FALL);
            tweenleftUpperLeg2.start();
           }).delay(4500)
           
               
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
            tweenleftLowerLeg.to(LowerLegFinalFall,MOVING_FALL);
            tweenleftLowerLeg.start();
           }).delay(4500)
           
               
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
            tweenleftFoot.to(leftFootFall,MOVING_FALL);
            tweenleftFoot.start();
           }).delay(4500)
           
               
           tweenleftFoot.start();

         
}

function collision(){

    setTimeout(() => Move(), 5000);
    setTimeout(() => MoveHead(), 15000);
}

function MoveHead(){

    let Head = skeleton.bones[0].children[0].children[0].children[0].children[0];
    let HeadInit = { x: Head.rotation.x, y: Head.rotation.y, z: Head.rotation.z };
       
   
           let tweenHead = new TWEEN.Tween(HeadInit)
           .to(HeadFinalFall, 180)
           .easing(TWEEN.Easing.Sinusoidal.In)
           .onUpdate((d) => {
               if (HeadFinalFall.x) Head.rotation.x = d.x;
               if (HeadFinalFall.y) Head.rotation.y = d.y;
               if (HeadFinalFall.z) Head.rotation.z = d.z;
           })
           .onComplete(() => {
            tweenHead.to(HeadFinalFall,180)
            tweenHead.start();
           }).repeat(4).yoyo(true);
           
         tweenHead.start();
 
}

