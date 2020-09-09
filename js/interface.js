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

function createUI() {
    document.getElementById("menu").hidden = true;
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
    coinCount.style.font = "italic bold 40px arial,serif";
    coinCount.style.fontSize = 'xx-large';
    coinCount.style.color = 'white';
    coinCount.id = "coinCount";
    coinCount.innerText = "0";
    scoreDom.appendChild(coinCount)
    document.body.appendChild(scoreDom);

    for (let i = lifeCount; i > 0; i--) {
        let lifeDom = document.createElement('div');
        lifeDom.id = "life_"+i;
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
}

function removeBag(){
    let div = document.getElementById("life_"+lifeCount);
    div.remove();
}

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
        sessionStorage.setItem('highScores', JSON.stringify(highScores));
    }
    setTimeout(() => {
        $("#gameOverModal").modal();
        document.getElementById('gameOverCoins').innerHTML = score;
        if (isHighScore) {
            document.getElementById("newRecord").innerHTML = "New Record!";
        }
    }, 5000);
}

function updateScore(score) {
    document.getElementById("coinCount").innerHTML = score;
}