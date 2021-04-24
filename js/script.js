var test = document.getElementById("columns")

var columns = [
    document.getElementById("column1"),
    document.getElementById("column2"),
    document.getElementById("column3"),
    document.getElementById("column4")
]
var currentTarget = -1;

var targets = []


var speeds = [1000];

document.addEventListener("keypress", function(e) {
    console.dir(targets)

    if (e.keyCode == checkFirst().key) {
        document.getElementById(checkFirst().id).style.transition = "none";
        document.getElementById(checkFirst().id).style.opacity = "0";
        targets[checkFirst().index].active = false
    } else {
        alert("game over")
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
            var move = setInterval(function() {
                targets[trgt.index]["positionY"] = targets[trgt.index]["positionY"] + 50;
                document.getElementById("target" + trgt.index).style.top = targets[trgt.index]["positionY"] + "px";
                if (trgt.positionY > 700) {
                    clearInterval(move)
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
spawnTargets()

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