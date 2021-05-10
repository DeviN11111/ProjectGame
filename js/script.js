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

var colors = [
    "rgb(27, 27, 61)" // Default color
]



var currentTarget = -1;

var targets = []

var intervals = [];
var spawnTimeout;
var totalTimerInterval;

var gameEnd = false

var keys = ["KeyQ", "KeyW", "KeyO", "KeyP"];

var difficultySpeed = 75;

var difficultyLifeBallChance = 75;

var spawnSpeeds = [300];

var score = 0;
var bestScore = 0;

var lives = 3;

var hitSound = document.getElementById("hitSound");

var missSound = document.getElementById("missSound");

var gameOverSound = document.getElementById("gameOverSound");

var lifeGainSound = document.getElementById("lifeGainSound")

var countDownSEC = 3

var totalTimeSEC = 1;
var totalTimeMIN = 0;


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
                clearInterval(intervals[checkFirst().index])
                document.getElementById(checkFirst().id).remove()
                boxes[checkFirst().column].style.backgroundColor = "green";
                var temp = boxes[checkFirst().column]
                setTimeout(function() {
                    temp.style.backgroundColor = colors[0];
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
                    boxes[keys.indexOf(e.code)].style.backgroundColor = colors[0];
                }, 200)
                loseLife()
            }
        }
    }
})

function makeTarget() {

    var createTarget = document.createElement("div");
    currentTarget++
    createTarget.id = "target" + currentTarget;

    var randomNumber = Math.floor(Math.random() * 4)

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
                            temp.style.backgroundColor = colors[0];
                        }, 200)
                        loseLife()
                    }
                    trgt.active = false;
                    document.getElementById(trgt.id).remove();

                }
            }, this.speed)
        },
        "speed": difficultySpeed,
        "active": true,
        "column": randomNumber,
        "key": keys[randomNumber],
        "lifeBall": false
    }
    targets.push(obj)

    createTarget.style.transition = "linear " + targets[currentTarget].speed + "ms"

    columns[randomNumber].appendChild(createTarget);

    document.getElementById(checkFirst().id).style.backgroundColor = "rgb(161, 255, 148)"

    targets[currentTarget].moveTarget();
    lifeBallCreate(currentTarget);
}

function spawnTargets() {
    var randomNumber = Math.floor(Math.random() * spawnSpeeds.length);
    spawnTimeout = setTimeout(function() {
        makeTarget();
        spawnTargets();
    }, spawnSpeeds[randomNumber])
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
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        gameEnd = true;
        clearInterval(totalTimerInterval);
        if (score > bestScore) {
            bestScore = score
            localStorage.setItem("bestScore_local", bestScore);
        }
        document.getElementById("gameOver_content").style.display = "block"
        document.getElementById("score_text").innerHTML = "Score : " + score
        document.getElementById("highscore_text").innerHTML = "Best : " + localStorage.getItem("bestScore_local");
        document.getElementById("Totaltime_text").innerHTML = "Time : " + totalTimeMIN + "m " + totalTimeSEC + "s"
        document.getElementById("gameStats").style.display = "none"
    }

}


function countDownTimer() {
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
    gameEnd = false;
    document.getElementById("LIVE_score_text").innerHTML = "Score : 0";
    document.getElementById("countDown_text").innerHTML = "3";
    document.getElementById("countDown").style.display = "block"
    document.getElementById("gameOver_content").style.display = "none"
    document.getElementById("gameStats").style.display = "block"
    countDownInterval = setInterval(countDownTimer, 1000)
}

document.getElementById("retry").onclick = function() {
    reloadGame()
}

document.getElementById("home").onclick = function() {
    document.getElementById("menu_content").style.display = "block"
    document.getElementById("gameStats").style.visibility = "hidden"
}

document.getElementById("survival").onclick = function() {
    document.getElementById("menu_content").style.display = "none"
    document.getElementById("gameStats").style.visibility = "visible"
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
    colors = [
        "rgb(27, 27, 61)", //Primary color
        "rgb(49, 49, 107)", //Secondary color
        "rgb(8, 0, 47)", //Border color
        "rgb(63, 62, 62)" //Background color
    ]
    document.getElementById("credits_page").className = "scrollbar scrl_dark"
    document.getElementById("theme_dark").style.border = "solid green 5px";
    document.getElementById("theme_light").style.border = "";
    paintPage()
}

document.getElementById("theme_light").onclick = function() { // Light theme
    colors = [
        "#86b3fc", //Primary color
        "#bfd8ff", //Secondary color
        "#2c4bd4", //Border color
        "#c2d2ff" //Background color
    ]
    document.getElementById("credits_page").className = "scrollbar scrl_light"
    document.getElementById("theme_light").style.border = "solid green 5px";
    document.getElementById("theme_dark").style.border = "";
    paintPage()
}

function paintPage() {
    document.body.style.background = colors[3];
    document.getElementById("menu_content").style.backgroundColor = colors[0];
    document.getElementById("stage").style.border = "5px solid " + colors[2];
    document.getElementById("gameStats").style.border = "5px solid " + colors[2];
    document.getElementById("gameStats").style.borderBottom = "none"
    document.getElementById("controls").style.borderTop = "5px solid " + colors[2];
    document.getElementById("settings_page").style.backgroundColor = colors[0];
    document.getElementById("gameStats").style.backgroundColor = colors[0];
    document.getElementById("columns").style.backgroundColor = colors[1];
    document.getElementById("credits_page").style.backgroundColor = colors[0];
    for (i = 0; i < document.getElementById("credits_authors").children.length; i++) {
        document.getElementById("credits_authors").children[i].style.border = "solid " + colors[2];
    }
    for (i = 0; i < boxes.length; i++) {
        boxes[i].style.backgroundColor = colors[0];
        boxes[i].style.borderRight = "5px solid " + colors[2];
    }
    boxes[boxes.length - 1].style.borderRight = "none"
}


//////////////////////KEYBIND SELECTOR MEN/////////////////////////////////

var columnKey;
var keyFunction = function(e) {
    if (!keys.includes(e.code) && e.key != " " && e.key != "Enter") {
        columnKey.innerHTML = e.key
        keys[columnKey.dataset.number - 1] = e.code;
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

// Store
localStorage.setItem("lastname", kaas);
localStorage.setItem("lastname1", kaas2);
// Retrieve
document.getElementById("result").innerHTML = localStorage.getItem("lastname")