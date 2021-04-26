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

var intervals = [];

var gameEnd = false


var speeds = [200, 300, 400, 100, 600];

var score = 0;

var lives = 3;



var hitSound = document.getElementById("hitSound");

var missSound = document.getElementById("missSound");

var gameOverSound = document.getElementById("gameOverSound");

var timeSEC = 3

document.addEventListener("keypress", function(e) {
    if (e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52) {
        if (gameEnd == false) {
            if (e.keyCode == checkFirst().key) {
                clearInterval(intervals[checkFirst().index])
                document.getElementById(checkFirst().id).remove()
                console.log(checkFirst().key)
                boxes[checkFirst().key - 49].style.backgroundColor = "green";
                var temp = boxes[checkFirst().key - 49]
                setTimeout(function() {
                    temp.style.backgroundColor = "white";
                }, 200)
                targets[checkFirst().index].active = false
                document.getElementById(checkFirst().id).style.backgroundColor = "green";
                score++
                document.getElementById("gameScore").innerHTML = "Score : " + score;
                hitSound.pause();
                hitSound.currentTime = 0;
                hitSound.play();
            } else {
                boxes[e.keyCode - 49].style.backgroundColor = "red";
                setTimeout(function() {
                    boxes[e.keyCode - 49].style.backgroundColor = "white";
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
                        boxes[checkFirst().key - 49].style.backgroundColor = "red";
                        var temp = boxes[checkFirst().key - 49]
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
        "key": randomNumber + 49
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
    return activeTargets[0]
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
        document.getElementById("gameOver_content").style.display = "block"
        document.getElementById("score_text").innerHTML = "Score : " + score
    }

}


var stopTimer = setInterval(timer, 1000)
function timer(){
    timeSEC--
    document.getElementById("countDownText").innerHTML = timeSEC
    if(timeSEC == -1){
        document.getElementById("countDownText").innerHTML = "GO!"
    } else if(timeSEC == -2){
        spawnTargets()
        document.getElementById("countDown").style.display = "none"
        clearInterval(stopTimer)
    }
    
}



document.getElementById("retry").onclick = function(){
    location.reload(); 
}



