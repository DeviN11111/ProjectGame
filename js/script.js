var test = document.getElementById("columns")

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

var currentTarget = -1;

var targets = []

var totalTimer;
var intervals = [];

var gameEnd = false


var keys = [113, 119, 111, 112];

var speeds = [300];

var score = 0;

var lives = 3;

var hitSound = document.getElementById("hitSound");

var missSound = document.getElementById("missSound");

var gameOverSound = document.getElementById("gameOverSound");

var countDownSEC = 3

var totalTimeSEC = 1;
var totalTimeMIN = 0;

document.addEventListener("keypress", function(e) {
    console.log(e.keyCode)
    if (e.keyCode == keys[0] || e.keyCode == keys[1] || e.keyCode == keys[2] || e.keyCode == keys[3]) {
        if (gameEnd == false) {
            if (e.keyCode == checkFirst().key) {
                clearInterval(intervals[checkFirst().index])
                document.getElementById(checkFirst().id).remove()
                boxes[checkFirst().column].style.backgroundColor = "green";
                var temp = boxes[checkFirst().column]
                setTimeout(function() {
                    temp.style.backgroundColor = "white";
                }, 200)
                targets[checkFirst().index].active = false
                if (checkFirst() != "none") {
                    document.getElementById(checkFirst().id).style.backgroundColor = "green";
                }
                score++
                document.getElementById("LIVE_score_text").innerHTML = "Score : " + score;
                hitSound.pause();
                hitSound.currentTime = 0;
                hitSound.play();
            } else {
                boxes[keys.indexOf(e.keyCode)].style.backgroundColor = "red";
                setTimeout(function() {
                    boxes[keys.indexOf(e.keyCode)].style.backgroundColor = "white";
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
                            temp.style.backgroundColor = "white";
                        }, 200)
                        loseLife()
                    }
                    trgt.active = false;
                    document.getElementById(trgt.id).remove();

                }
            }, this.speed)
        },
        "speed": 100,
        "active": true,
        "column": randomNumber,
        "key": keys[randomNumber]
    }
    targets.push(obj)

    createTarget.style.transition = "linear " + targets[currentTarget].speed + "ms"

    columns[randomNumber].appendChild(createTarget);

    document.getElementById(checkFirst().id).style.backgroundColor = "green"

    targets[currentTarget].moveTarget();
}


function spawnTargets() {
    var randomNumber = Math.floor(Math.random() * speeds.length);
    setTimeout(function() {
        makeTarget();
        spawnTargets();
    }, speeds[randomNumber])
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
        clearInterval(totalTimer);
        document.getElementById("gameOver_content").style.display = "block"
        document.getElementById("score_text").innerHTML = "Score : " + score
        document.getElementById("Totaltime_text").innerHTML = "Time : " + totalTimeMIN + "m " + totalTimeSEC + "s"
    }

}


var countDownTimer = setInterval(countDownTimer, 1000)

function countDownTimer() {
    countDownSEC--
    document.getElementById("countDown_text").innerHTML = countDownSEC;
    if (countDownSEC == 0) {
        document.getElementById("countDown_text").innerHTML = "GO!";
    } else if (countDownSEC == -1) {
        totalTimer = setInterval(totalTimer, 1000)
        spawnTargets()
        document.getElementById("countDown").style.display = "none";
        clearInterval(countDownTimer)
        countDownSEC = 3
    }

}


function totalTimer() {
    totalTimeSEC++
    if (totalTimeSEC == 60) {
        totalTimeSEC = 0;
        totalTimeMIN++
    }
}



document.getElementById("retry").onclick = function() {
    location.reload();
}