/** ANIMATION KEYFRAMES */

// speed
const RUNNING_SPEED = 180;
const MOVING_SPEED = 10;
const MOVING_TORSO = 180;
const MOVING_FALL = 2000;
//run
const UPPER_LEG_FINAL = { x: -1.0 };
const LEG_FINAL = { x: 1.0 };
const ARM_FINAL = { x: 1.0 };
const LEFT_HAND_FINAL = { y: -1.4 };
const RIGHT_HAND_FINAL = { y:  1.4 };
const SHOULDER_FINAL = { y: -0.3, x: -0.3 };
const FOOT_FINAL = { x: 1.5 };
//fall 
const BONES_FINISH_FALL = -1.57;
const SHOULDER_FINISH_FALL = 2.00;
const LEFTUPPERARM_FINISH_FALL = -1.50;
const LEFTLOWERARM_FINISH_FALL = -2.3;
const LEFTUPPERLEG_FINISH_FALLX = -0.9;
const LEFTUPPERLEG_FINISH_FALLZ = 0.1;
const LEG_FINISH_FALL = -1.57;
const RIGHTUPPERLEG_FINISH_FALLZ = -0.1;
const LOWERLEG_FINISH_FALL = 1.3;
const BONES_POS_FALLY = 20;
const BONES_POS_FALLZ = -130;
const LEFTFOOT_FINISH_FALL = 1.0;
const HEAD_FINISH_FALL = 0.5;
/** MODELS */
// model file 
const CHARACTER_URL = 'resources/models/character.glb';
const CAR_URL = 'resources/models/car.glb';
const CAR_SHADOW_URL = 'resources/textures/car_shadow.png';
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
/** GAME SETTINGS */
const Z_SPEED = -6;
const OBJ_MASS = 500000;
const GAME_BORDER = 340;

const BUILDING_INTERVAL = 5000;
const CAR_INTERVAL = 2500;
const COINS_INTERVALS = [1000, 2500, 4000];
const WALLS_INTERVAL = 60;

const IS_DEBUG = false; // set to true to enable helpers and collision boxes

/** UTIL FUNCTIONS */
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}