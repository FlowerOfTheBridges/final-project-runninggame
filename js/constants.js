/** ANIMATION KEYFRAMES */

// speed
const RUNNING_SPEED = 180;
const MOVING_SPEED = 0.2;
const MOVING_TORSO = 280;
const MOVING_BONES = 300;
const MOVING_FALL = 1000;
const MOVING_GAZELLE = 500;
const MOVING_JUMP = 600;
const TREE_COLLISION_SPEED = 1500;
//run
const UPPER_LEG_FINAL = { x: -1.0 };
const LEG_FINAL = { x: 1.0 };
const ARM_FINAL = { x: 0.3 };
const LEFT_HAND_FINAL = { y: -1.4 };
const RIGHT_HAND_FINAL = { y:  1.4 };
const SHOULDER_FINAL = {  y: 0.025 };
const TORSO_FINAL = { y: 0.025 };
const FOOT_FINAL = { x: 1.5 };
const BONES_FINAL_RUN = { x:0.025, y: 0.1, z: 0.025 }
//fall
const BONES_FINISH_FALL_ROTATION = {x: -1.57};
const SHOULDER_FINISH_FALL_ROTATION = {x: 1.00};
const LEFTUPPERARM_FINISH_FALL_ROTATION = {x: -1.50};
const LEFT_LOWERARM_FINISH_FALL_ROTATION = {y: -2.3};
const LEFT_UPPER_LEG_FINISH_FALL_ROTATION = {x: -0.9, z: 0.1}
const LEG_FINISH_FALL_ROTATION = {x: -1.57};
const LOWERLEG_FINISH_FALL_ROTATION = {x: 1.3};
const BONES_FINISH_FALL_POSITION = {y: 0.4, z: -2};
const LEFTFOOT_FINISH_FALL_ROTATION = {x: 1.0};
const HEAD_FINISH_FALL_ROTATION = {y: 0.5};
const RIGHTLOWERARM_FINISH_FALL_ROTATION = {y: 1.57};
const RIGHTUPPERARM_FINISH_FALL_ROTATION =  {x: 1.00};
/** MODELS */
// model file 
const CHARACTER_URL = 'resources/models/character.glb';
const CAR_URL = 'resources/models/car.glb';
// materials
const CAR_BODY_MATERIAL = new THREE.MeshPhysicalMaterial({
    color: 0xff0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
});
const CAR_DETAILS_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1.0, roughness: 0.5
});

const CAR_GLASS_MATERIAL = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true
});

const COIN_MATERIAL = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.7,
    roughness: 0.3,
});
// objs settings
const BOX_OPACITY = 0.01;
const OBJ_DISTANCE = 55;
/** CAMERA SETTINGS */
const CAMERA_Y = 2;
const CAMERA_Z = -6;
/** GAME SETTINGS */
const Z_SPEED = -4;
const OBJ_MASS = 500000;
const GAME_BORDER = 2.7;

const WALLS_SPEED = 0.2;
const GROUND_SPEED = 0.4;
const WALLS_INTERVAL = 60;

const OUTER_OBSTACLES_INTERVAL = 7000;
const INNER_OBSTACLES_INTERVAL = 2400;
const WALL_OBASTACLES_INTERVAL = 4000;
const COINS_INTERVALS = [1000, 3600, 5000];

const IS_DEBUG = false; // set to true to enable helpers and collision boxes

/** UTIL FUNCTIONS */
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}