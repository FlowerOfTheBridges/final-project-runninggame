const RUNNING_SPEED = 180;
const MOVING_SPEED = 10;
const MOVING_TORSO = 180;
const MOVING_FALL = 2000;

const UPPER_LEG_FINISH = -1.0;
const LEG_FINISH = 1.0;
const ARM_FINISH = 1.0;
const HAND_FINISH = 1.4;
const TORSO_FINISH = -0.3;
const FOOT_FINISH = 1.5;

//fall 
const BONES_FINISH_FALL = -1.57;
const TORSO_FINISH_FALL = 2.00;
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

const CHARACTER_URL = 'resources/models/character.glb';
const BOX_OPACITY = 0.01;

const OBJ_DISTANCE = 55;

const Z_SPEED = -6;
const OBJ_MASS = 500000;

const BUILDING_INTERVAL = 5000;
const CAR_INTERVAL = 2500;
const COINS_INTERVALS = [1000, 2500, 4000];
const WALLS_INTERVAL = 60;

const IS_DEBUG = false; // set to true to enable helpers and collision boxes


function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}