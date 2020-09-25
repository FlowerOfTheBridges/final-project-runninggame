/**
 * show the home screen
 */
function homeDisplay() { 
    document.getElementById('clickMe').style.display="none";
    document.getElementById('presentation-display').style.display="none";
    document.getElementById('startGame').style.display="block";
    IS_SOUND_ON = document.getElementById("volumeSwitch").checked;
    IS_SOUND_ON && loadSounds();
}

/**
 * retrieve high score from local storage and show them on main menu
 */
function getHighScores() {
    let highScores = JSON.parse(sessionStorage.getItem("highScores"));

    if (highScores != null) {
        document.getElementById("forestHighScore").innerHTML = highScores['forest'] != null ? highScores['forest'] : 0;
        document.getElementById("cityHighScore").innerHTML = highScores['city'] != null ? highScores['city'] : 0;
    }
    else {
        document.getElementById("forestHighScore").innerHTML = 0;
        document.getElementById("cityHighScore").innerHTML = 0;
    }
}

/**
 * get the day time chosen for the scenario which will be played by the player
 * @param {string} scenario the scenario chosen by the player
 */
function getDayTime(scenario) {
    let dayTimesRadio = document.getElementsByName(scenario + 'Radio');
    let dayTime = null;
    for (radio in dayTimesRadio) {
        if (dayTimesRadio[radio].checked) {
            dayTime = dayTimesRadio[radio].value;
        }
    };
    return dayTime;
}

/**
 * creates the user interfaces that will be displayed during the game (score and life count)
 */
function createUI() {
    document.getElementById("menu").hidden = true;
    // score
    let scoreDom = document.createElement('div');
    scoreDom.style.position = 'absolute';
    scoreDom.style.top = 10 + 'px';
    scoreDom.style.right = 10 + 'px';
    let coinImage = document.createElement('img');
    coinImage.src = 'resources/textures/coin.png';
    coinImage.setAttribute("width", 50);
    coinImage.setAttribute("height", 50);
    scoreDom.appendChild(coinImage);
    let coinCount = document.createElement('p');
    coinCount.style.font = "Press Start 2P";
    coinCount.style.fontSize = 'xx-large';
    coinCount.style.color = 'black';
    coinCount.id = "coinCount";
    coinCount.innerText = "0";
    scoreDom.appendChild(coinCount)
    document.body.appendChild(scoreDom);
    // bags (life count)
    for (let i = lifeCount; i > 0; i--) {
        let lifeDom = document.createElement('div');
        lifeDom.id = "life_" + i;
        lifeDom.style.position = 'absolute';
        lifeDom.style.top = 10 + 'px';
        lifeDom.style.left = (65 * i) + 'px';
        let bagImage = document.createElement('img');
        bagImage.src = 'resources/textures/bag.png';
        bagImage.setAttribute("width", 50);
        bagImage.setAttribute("height", 50);
        lifeDom.appendChild(bagImage);
        document.body.appendChild(lifeDom);
    }
    //loading info
    let loading = document.createElement('div');
    loading.id = "loading";
    loading.style.position = 'absolute';
    loading.style.bottom = 10 + 'px';
    loading.style.right = 10 + 'px';
    let loadingInfo = document.createElement('p');
    loadingInfo.style.font = "Press Start 2P";
    loadingInfo.style.fontSize = 'xx-large';
    loadingInfo.style.color = 'black';
    loadingInfo.id = "loadingInfo";
    loading.appendChild(loadingInfo)
    document.body.appendChild(loading);
}

/**
 * remove a bag image from the screen
 */
function removeBag() {
    let div = document.getElementById("life_" + lifeCount);
    div.remove();
}

/**
 * show the game over modal while checking if a new high score has been made by the player
 */
function showGameOver() {
    let isHighScore = false;
    let highScores = JSON.parse(sessionStorage.getItem("highScores"));
    if (highScores != null) {
        if (highScores[currentScenario] == null) {
            highScores[currentScenario] = 0;
        }
        if (score > highScores[currentScenario]) {
            highScores[currentScenario] = score;
            sessionStorage.setItem('highScores', JSON.stringify(highScores));
            isHighScore = true;
        }
    }
    else {
        highScores = {};
        highScores[currentScenario] = score;
        isHighScore = true;
        sessionStorage.setItem('highScores', JSON.stringify(highScores));
    }
    setTimeout(() => {
        IS_SOUND_ON && sound.play('game_over');
        $("#gameOverModal").modal();
        document.getElementById('gameOverCoins').innerHTML = score;
      
        if (isHighScore) {
            document.getElementById("newRecord").innerHTML = "New Record!";
        }
    }, 5000);
}

/**
 * update the score count
 * @param {number} score the new score count
 */
function updateScore(score) {
    document.getElementById("coinCount").innerHTML = score;
}

/**
 * update the loading count written on the screen
 * @param {number} assets loaded at the moment 
 * @param {number} total number of assets 
 */
function updateLoading(assets, total) {
    let loading = document.getElementById("loading").childNodes[0];
    if (assets != null && total != null) {
        loading.innerHTML = "Loading assets... (" + assets + "/" + total + ")";
    }
    else{
        loading.innerHTML = "Assets loaded. Waiting..."
    }
}

/**
 * remove the loading writing from the screen
 */
function removeLoading(){
    let loading = document.getElementById("loading");
    loading.remove();
}