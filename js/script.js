var columns = [
    document.getElementById("column1"),
    document.getElementById("column2"),
    document.getElementById("column3"),
    document.getElementById("column4")
]
var boxes = [
    document.getElementById("box1"),
    document.getElementById("box2"),
    document.getElementById("box3"),
    document.getElementById("box4")
]
var hearts = [
    document.getElementById("heart1"),
    document.getElementById("heart2"),
    document.getElementById("heart3")
]
var themeBtns = [
    document.getElementById("theme_dark"),
    document.getElementById("theme_light")
]

var themeColors = {
    "dark": [
        "rgb(27, 27, 61)", //Primary color
        "rgb(49, 49, 107)", //Secondary color
        "rgb(8, 0, 47)", //Border color
        "rgb(63, 62, 62)" //Background color
    ],
    "light": [
        "#86b3fc", //Primary color
        "#bfd8ff", //Secondary color
        "#2c4bd4", //Border color
        "#c2d2ff" //Background color
    ]
}

var currentLevel;

var theme = "dark"

var currentTarget = -1;

var targets = []

var intervals = [];
var spawnTimeout;
var totalTimerInterval;

var gameEnd = false;
var victory = false;

var keys = ["KeyQ", "KeyW", "KeyO", "KeyP"];

var difficultySpeed = 75;

var difficultyLifeBallChance = 75;

var spawnSpeeds = [300];

var score = 0;
var bestScore = 0;

var lives = 3;

var currentWave = 1;

var hitSound = document.getElementById("hitSound");

var missSound = document.getElementById("missSound");

var gameOverSound = document.getElementById("gameOverSound");

var lifeGainSound = document.getElementById("lifeGainSound")

var countDownSEC = 3

var totalTimeSEC = 1;
var totalTimeMIN = 0;



// all local saved storage changes men ///////////////////
document.body.onload = function() {
        if (localStorage.getItem("keyBinds_local") != null) {
            keys = localStorage.getItem("keyBinds_local");
            keys = keys.split(",")
        }
        for (i = 0; i < boxes.length; i++) {
            boxes[i].innerHTML = keys[i][(keys[i].length - 1)]
            document.getElementById("keyBind" + (i + 1)).innerHTML = keys[i][(keys[i].length - 1)]
        }
        if (localStorage.getItem("bestScore_local") != null) {
            bestScore = localStorage.getItem("bestScore_local")
        }
        if (localStorage.getItem("theme") != null) {
            for (i = 0; i < themeBtns.length; i++) {
                themeBtns[i].style.border = "none";
            }
            theme = localStorage.getItem("theme");
            document.getElementById("theme_" + theme).style.border = "solid green 5px"
            paintPage(theme)
        }
        if(localStorage.getItem("levels_local") != null) {
            levels = JSON.parse(localStorage.getItem("levels_local"));
        }
        loadCampaign()
    }
    ////////////////////////////////////////////////////

document.addEventListener("keypress", function(e) {
    if (e.code == keys[0] || e.code == keys[1] || e.code == keys[2] || e.code == keys[3]) {
        if (gameEnd == false && countDownSEC == -1) {

            if (e.code == checkFirst().key) {
                if (checkFirst().lifeBall == true) {
                    hearts[lives].className = "fas fa-heart"
                    lifeGainSound.pause();
                    lifeGainSound.currentTime = 0;
                    lifeGainSound.play()
                    lives++
                }
                if (currentLevel != "survival") {
                    if (checkFirst().index == levels["level_" + currentLevel["levelNumber"]]["waveEnd"][currentWave - 1] - 1) {
                        nextWave();
                    }
                }

                if (checkFirst().lastBall == true) {
                    gameFinished()
                }
                clearInterval(intervals[checkFirst().index])
                document.getElementById(checkFirst().id).remove()
                boxes[checkFirst().column].style.backgroundColor = "green";
                var temp = boxes[checkFirst().column]
                setTimeout(function() {
                    temp.style.backgroundColor = themeColors[theme][0];
                }, 200)
                targets[checkFirst().index].active = false
                if (checkFirst() != "none") {
                    document.getElementById(checkFirst().id).style.backgroundColor = "rgb(161, 255, 148)";
                }
                score++
                document.getElementById("LIVE_score_text").innerHTML = "Score : " + score;
                hitSound.pause();
                hitSound.currentTime = 0;
                hitSound.play();


            } else {
                boxes[keys.indexOf(e.code)].style.backgroundColor = "red";
                setTimeout(function() {
                    boxes[keys.indexOf(e.code)].style.backgroundColor = themeColors[theme][0];
                }, 200)
                loseLife()
            }
        }
    }
})

function loadCampaign() {
    var starAmount = 0;
    var temp;
    document.getElementById("campaign_levels").innerHTML = ""
    for (x in levels) {
        if (x != "level_1" && levels[temp]["stars"] > 0) {
            levels[x]["locked"] = false;
        }
        temp = x
        var create_div = document.createElement("div")
        create_div.id = "level_" + levels[x]["levelNumber"] + "_box"
        create_div.setAttribute('data-levelnumber', levels[x]["levelNumber"])
        var create_h1 = document.createElement("h1")

        create_h1.innerHTML = levels[x]["levelNumber"]
        create_div.appendChild(create_h1)

        document.getElementById("campaign_levels").appendChild(create_div)

        for (i = 0; i < 3; i++) {
            var create_i = document.createElement("i")
            create_i.className = "fas fa-star star"
            create_i.id = "level_" + levels[x]["levelNumber"] + "star_" + (i + 1);
            create_div.appendChild(create_i);
        }
        for (i = 0; i < levels[x]["stars"]; i++) {
            document.getElementById("level_" + levels[x]["levelNumber"] + "star_" + (i + 1)).style.color = "gold"
        }
        if (levels[x]["locked"] == true) {
            var create_i = document.createElement("i")
            create_i.className = "fas fa-lock lock"
            create_div.appendChild(create_i);
        } else {
            create_div.onclick = function() {
                loadLevel(levels["level_" + this.dataset.levelnumber])
            }         
        }
    }
    for(x in levels){
        starAmount = starAmount + levels[x]["stars"]
    }
    document.getElementById("chapter_2").innerHTML = starAmount +  "/30 Chapter 2"
}


function loadLevel(level) {
    reloadGame()
    currentLevel = level
    spawnSpeeds = level["spawnSpeed"]
    difficultySpeed = level["targetSpeed"]

}

function makeTarget() {
    var createTarget = document.createElement("div");
    currentTarget++
    createTarget.id = "target" + currentTarget;

    if (currentLevel == "survival") {
        var randomNumber = Math.floor(Math.random() * 4)
        kaas = randomNumber
        kaas3 = difficultySpeed
    } else {
        kaas = levels["level_" + currentLevel["levelNumber"]]["targetColumn"][currentTarget]
        kaas3 = levels["level_" + currentLevel["levelNumber"]]["targetSpeed"][currentWave - 1]
    }


    var obj = {
        "id": "target" + currentTarget,
        "index": currentTarget,
        "positionY": -100,
        "moveTarget": function() {
            var trgt = this
            intervals[currentTarget] = setInterval(function() {
                targets[trgt.index]["positionY"] = targets[trgt.index]["positionY"] + 50;
                document.getElementById("target" + trgt.index).style.top = targets[trgt.index]["positionY"] + "px";
                if (trgt.positionY > 700) {
                    clearInterval(intervals[trgt.index])
                    if (gameEnd == false) {
                        boxes[trgt.column].style.backgroundColor = "red";
                        var temp = boxes[trgt.column]
                        setTimeout(function() {
                            temp.style.backgroundColor = themeColors[theme][0];
                        }, 200)
                        loseLife()
                        if (gameEnd == false && currentLevel != "survival") {
                            if (trgt.index == levels["level_" + currentLevel["levelNumber"]]["waveEnd"][currentWave - 1] - 1) {
                                nextWave();
                            }
                            if (trgt.lastBall == true) {
                                gameFinished();
                            }
                        }
                    }
                    trgt.active = false;
                    document.getElementById(trgt.id).remove();
                }
            }, this.speed)
        },
        "inWave": currentWave,
        "spawnSpeed": spawnSpeeds[kaas2],
        "column": kaas,
        "speed": kaas3, /////////////////////////////////////////////
        "active": true,
        "key": keys[kaas],
        "lifeBall": false,
        "lastBall": false
    }
    targets.push(obj)

    createTarget.style.transition = "linear " + targets[currentTarget].speed + "ms"

    columns[kaas].appendChild(createTarget);

    document.getElementById(checkFirst().id).style.backgroundColor = "rgb(161, 255, 148)"

    targets[currentTarget].moveTarget();
    lifeBallCreate(currentTarget);

    if (currentLevel != "survival" && currentTarget + 1 == levels["level_" + currentLevel["levelNumber"]]["qtyTargets"]) {
        targets[currentTarget].lastBall = true;
    }
} 

function spawnTargets() {
    if (currentLevel == "survival") {
        var randomNumber = Math.floor(Math.random() * spawnSpeeds.length);
        kaas2 = randomNumber
    } else {
        kaas2 = currentTarget + 1
    }
    if (currentTarget != currentLevel["qtyTargets"] - 1) {
        spawnTimeout = setTimeout(function() {
            makeTarget();
            spawnTargets();
        }, spawnSpeeds[kaas2])
    }
}

function nextWave() {
    setTimeout(function(){
        document.getElementById("countDown_text").style.fontSize = "34px"
        document.getElementById("countDown").style.display = "initial"
        document.getElementById("countDown_text").innerHTML = "Wave " + currentWave+ " Finished"
        currentWave++
        setTimeout(function(){
            document.getElementById("countDown").style.display = "none"
            document.getElementById("countDown_text").style.fontSize = "86px"
        }, 3000)
    }, 500)
}

function lifeBallCreate(targetName) {
    var randomLifeChance = Math.floor(Math.random() * difficultyLifeBallChance)
    if (randomLifeChance == 0 && lives < 3) {
        document.getElementById(targets[targetName].id).innerHTML = "<i class='fas fa-heart'></i>"
        targets[targetName].lifeBall = true;
    } else {
        targets[targetName].lifeBall = false;
    }
}

function checkFirst() {
    var activeTargets = []
    for (i = 0; i < targets.length; i++) {
        if (targets[i].active == true) {
            activeTargets.push(targets[i])
        }
    }
    if (activeTargets.length == 0) {
        return "none"
    } else {
        return activeTargets[0]
    }
}

function loseLife() {
    hearts[lives - 1].className = "fas fa-heart-broken"
    lives--
    missSound.pause();
    missSound.currentTime = 0;
    missSound.play();

    if (lives == 0) {
        gameOver()
    }

}

function gameFinished() {
    gameEnd = true;
    victory = true;
    giveStars()
    document.getElementById("gameVictory_content").style.display = "block"
    clearTimeout(spawnTimeout)
    clearInterval(totalTimerInterval);
    if (score > bestScore) {
        bestScore = score
        localStorage.setItem("bestScore_local", bestScore);
    }
    document.getElementById("score_text").innerHTML = "Score : " + score
    document.getElementById("highscore_text").innerHTML = "Best : " + bestScore
    document.getElementById("Totaltime_text").innerHTML = "Time : " + totalTimeMIN + "m " + totalTimeSEC + "s"
    document.getElementById("gameStats").style.display = "none"
    localStorage.setItem("levels_local", JSON.stringify(levels));
}

function gameOver() {
    gameEnd = true;
    giveStars()
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    clearInterval(totalTimerInterval);
    if (score > bestScore) {
        bestScore = score
        localStorage.setItem("bestScore_local", bestScore);
    }
    document.getElementById("gameOver_content").style.display = "block"
    document.getElementById("score_text").innerHTML = "Score : " + score
    document.getElementById("highscore_text").innerHTML = "Best : " + bestScore
    document.getElementById("Totaltime_text").innerHTML = "Time : " + totalTimeMIN + "m " + totalTimeSEC + "s"
    document.getElementById("gameStats").style.display = "none"
    localStorage.setItem("levels_local", JSON.stringify(levels));
}

function giveStars() {
    for (i = 0; i < currentWave - 1; i++) {
        levels["level_" + currentLevel["levelNumber"]]["stars"]++
    }
    if (currentWave == 3 && victory == true) {
        levels["level_" + currentLevel["levelNumber"]]["stars"]++
    }
}

function countDownTimer() {
    document.getElementById("countDown_text").style.fontSize = "86px"
    countDownSEC--
    document.getElementById("countDown_text").innerHTML = countDownSEC;
    if (countDownSEC == 0) {
        document.getElementById("countDown_text").innerHTML = "GO!";
    } else if (countDownSEC == -1) {
        totalTimerInterval = setInterval(totalTimer, 1000)
        spawnTargets()
        document.getElementById("countDown").style.display = "none";
        clearInterval(countDownInterval)
    }

}

function totalTimer() {
    totalTimeSEC++
    if (totalTimeSEC == 60) {
        totalTimeSEC = 0;
        totalTimeMIN++
    }
}

function reloadGame() {
    clearTimeout(spawnTimeout)
    for (i = 0; i < columns.length; i++) {
        columns[i].innerHTML = "";
    }
    for (i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i])
    }
    for (i = 0; i < hearts.length; i++) {
        hearts[i].className = "fas fa-heart"
    }
    currentTarget = -1
    targets = [];
    intervals = []
    score = 0;
    lives = 3;
    countDownSEC = 3;
    totalTimeSEC = 1;
    totalTimeMIN = 0;
    currentWave = 1;
    gameEnd = false;
    victory = false;
    document.getElementById("campaign_page").style.display = "none";
    document.getElementById("LIVE_score_text").innerHTML = "Score : 0";
    document.getElementById("countDown_text").innerHTML = "3";
    document.getElementById("countDown").style.display = "block"
    document.getElementById("gameOver_content").style.display = "none"
    document.getElementById("gameStats").style.display = "block"
    document.getElementById("menu_content").style.display = "none"
    document.getElementById("gameStats").style.visibility = "visible"
    countDownInterval = setInterval(countDownTimer, 1000)
}

document.getElementById("retry").onclick = function() {
    reloadGame()
}

document.getElementById("home").onclick = function() {
    document.getElementById("menu_content").style.display = "block"
    document.getElementById("gameStats").style.visibility = "hidden"
}
document.getElementById("home1").onclick = function() {
    document.getElementById("menu_content").style.display = "block"
    document.getElementById("gameStats").style.visibility = "hidden"
}

document.getElementById("survival").onclick = function() {
    currentLevel = "survival"
    reloadGame()
}


// buttons for credits page
document.getElementById("credits").onclick = function() {
    document.getElementById("credits_page").style.display = "block";
}

document.getElementById("leave_credits_page").onclick = function() {
    document.getElementById("credits_page").style.display = "none";
}

// slider and buttons for settings page

var slider = document.getElementById("volume_selector");
var output = document.getElementById("volume_value");
document.getElementById("medium").style.border = "solid orange 5px";

output.innerHTML = slider.value + '%';
slider.oninput = function() {
    output.innerHTML = this.value + "%";
    document.getElementById("gameOverSound").volume = (this.value / 100)
    document.getElementById("hitSound").volume = (this.value / 100)
    document.getElementById("missSound").volume = (this.value / 100)
    document.getElementById("lifeGainSound").volume = (this.value / 100)
    if (this.value == 0) {
        output.innerHTML = "<i class='fas fa-volume-mute'></i>"
    }
}

document.getElementById("easy").onclick = function() {
    document.getElementById("easy").style.border = "solid green 5px";
    document.getElementById("medium").style.border = "";
    document.getElementById("hard").style.border = "";
    difficultySpeed = 100;
    spawnSpeeds = [500];
    document.getElementById("difficulty_text").innerHTML = "Difficulty : Easy"
    difficultyLifeBallChance = 50;
}

document.getElementById("medium").onclick = function() {
    document.getElementById("medium").style.border = "solid orange 5px";
    document.getElementById("easy").style.border = "";
    document.getElementById("hard").style.border = "";
    difficultySpeed = 75;
    spawnSpeeds = [300];
    document.getElementById("difficulty_text").innerHTML = "Difficulty : Medium"
    difficultyLifeBallChance = 75;
}

document.getElementById("hard").onclick = function() {
    document.getElementById("hard").style.border = "solid red 5px";
    document.getElementById("easy").style.border = "";
    document.getElementById("medium").style.border = "";
    difficultySpeed = 40;
    spawnSpeeds = [250];
    document.getElementById("difficulty_text").innerHTML = "Difficulty : Hard"
    difficultyLifeBallChance = 100;
}

document.getElementById("leave_settings_page").onclick = function() {
    document.getElementById("settings_page").style.display = 'none'
}

document.getElementById("settings").onclick = function() {
    document.getElementById("settings_page").style.display = 'block'
    document.getElementById("settings_page").onclick = function() {
        document.removeEventListener("keypress", keyFunction)
        for (i = 0; i < 4; i++) {
            document.getElementById("keyBind" + (i + 1)).style.border = "solid gray 5px"
        }
    }
}

//////////////////////THEME SELECTOR MEN/////////////////////////////////

document.getElementById("theme_dark").style.border = "solid green 5px";

document.getElementById("theme_dark").onclick = function() { // Dark Theme
    document.getElementById("credits_page").className = "scrollbar scrl_dark"
    document.getElementById("theme_dark").style.border = "solid green 5px";
    document.getElementById("theme_light").style.border = "";
    localStorage.setItem("theme", "dark")
    theme = localStorage.getItem("theme")
    paintPage("dark")
}

document.getElementById("theme_light").onclick = function() { // Light theme
    document.getElementById("credits_page").className = "scrollbar scrl_light"
    document.getElementById("theme_light").style.border = "solid green 5px";
    document.getElementById("theme_dark").style.border = "";
    localStorage.setItem("theme", "light")
    theme = localStorage.getItem("theme")
    paintPage("light")
}

function paintPage(theme) {
    document.body.style.background = themeColors[theme][3];
    document.getElementById("menu_content").style.backgroundColor = themeColors[theme][0];
    document.getElementById("stage").style.border = "5px solid " + themeColors[theme][2];
    document.getElementById("gameStats").style.border = "5px solid " + themeColors[theme][2];
    document.getElementById("gameStats").style.borderBottom = "none"
    document.getElementById("controls").style.borderTop = "5px solid " + themeColors[theme][2];
    document.getElementById("settings_page").style.backgroundColor = themeColors[theme][0];
    document.getElementById("gameStats").style.backgroundColor = themeColors[theme][0];
    document.getElementById("columns").style.backgroundColor = themeColors[theme][1];
    document.getElementById("credits_page").style.backgroundColor = themeColors[theme][0];
    for (i = 0; i < document.getElementById("credits_authors").children.length; i++) {
        document.getElementById("credits_authors").children[i].style.border = "solid " + themeColors[theme][2];
    }
    for (i = 0; i < boxes.length; i++) {
        boxes[i].style.backgroundColor = themeColors[theme][0];
        boxes[i].style.borderRight = "5px solid " + themeColors[theme][2];
    }
    boxes[boxes.length - 1].style.borderRight = "none"
}


//////////////////////KEYBIND SELECTOR MEN/////////////////////////////////

var columnKey;
var keyFunction = function(e) {
    if (!keys.includes(e.code) && e.key != " " && e.key != "Enter") {
        columnKey.innerHTML = e.key
        keys[columnKey.dataset.number - 1] = e.code;
        localStorage.setItem("keyBinds_local", keys)
        document.getElementById("box" + columnKey.dataset.number).innerHTML = e.key;
        columnKey.style.border = "solid green 5px"
        setTimeout(function() {
            document.getElementById("keyBind" + (keys.indexOf(e.code) + 1)).style.border = "solid gray 5px"
        }, 500)
    } else {
        columnKey.style.border = "solid gray 5px"
        if (keys[columnKey.dataset.number - 1] == e.code) {
            document.getElementById("keyBind" + (keys.indexOf(e.code) + 1)).style.border = "solid gray 5px"
        } else {
            if (e.key == " " || e.key == "Enter") {
                document.getElementById("keyBind" + columnKey.dataset.number).style.border = "solid red 5px"
                setTimeout(function() {
                    document.getElementById("keyBind" + columnKey.dataset.number).style.border = "solid gray 5px"
                }, 500)
            } else {
                document.getElementById("keyBind" + (keys.indexOf(e.code) + 1)).style.border = "solid red 5px"
                setTimeout(function() {
                    document.getElementById("keyBind" + (keys.indexOf(e.code) + 1)).style.border = "solid gray 5px"
                }, 500)
            }

        }
    }
    document.removeEventListener("keypress", keyFunction)
}

for (i = 0; i < 4; i++) {
    document.getElementById("keyBind" + (i + 1)).onclick = function(event) {
        columnKey = this
        for (i = 0; i < 4; i++) {
            document.getElementById("keyBind" + (i + 1)).style.border = "solid gray 5px"
        }
        columnKey.style.border = "solid #363636 5px"
        document.addEventListener("keypress", keyFunction)
        event.stopPropagation()
    }
}
//////////////////////////////// campaign page ///////////////////////////
document.getElementById("leave_campaign_page").onclick = function() {
    document.getElementById("campaign_page").style.display = "none";
}

document.getElementById("campaign").onclick = function() {
    document.getElementById("campaign_page").style.display = "block";
    document.getElementById("campaign_page").style.display = "block";
    loadCampaign()
}

