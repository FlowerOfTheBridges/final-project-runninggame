const RUNNING_SPEED = 120;
const MOVING_SPEED = 10;

const UPPER_LEG_FINISH = -1.0;
const LEG_FINISH = 3.0;
const ARM_FINISH = -0.5;
const HAND_FINISH = 1.3;

const CHARACTER_URL = 'resources/models/character.glb';
const BOX_OPACITY = 0.01;

const OBJ_DISTANCE = 55;

const Z_SPEED = -4;
const OBJ_MASS = 500000;

const BUILDING_INTERVAL = 5000;
const CAR_INTERVAL = 2500;
const COINS_INTERVALS = [1000, 2500, 4000];
const WALLS_INTERVAL = 60;

const IS_DEBUG = false; // set to true to enable helpers and collision boxes


function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}