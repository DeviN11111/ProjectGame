var mainMenu = document.getElementById("mainMenu");
var game = document.getElementById("game")
var startBtn = document.getElementById("startBtn");

var lane2 = document.getElementById("lane2");
var arrow = document.getElementById("arrow")
var aimBoxL2 = document.getElementById("aimBoxL2")

var targetL2 = document.getElementById("targetL2")

var score = 0;

var arrowDirs = ["arrow-down", "arrow-up", "arrow-left", "arrow-right"];


var targetPosX = 40;
startBtn.onclick = function() {
    mainMenu.style.display = "none"
    game.style.display = "block"
    var moverTarget = setInterval(function(){
        aimBoxL2.style.backgroundColor = "#FF7229"
        targetL2.style.transition = "linear .1s"
        targetL2.style.marginRight = targetPosX+"px"
        targetPosX = targetPosX + 40;
        // console.log(targetPosX)
        if (targetPosX >= 600) {
            targetL2.remove();
            console.log("GAME OVER")
        }
        

    },50)
}

document.addEventListener("keydown", arrowPress);

function arrowPress(e) {
    if (targetPosX >= 480 && targetPosX < 600) {
        if  (e.code == "ArrowDown" && arrow.className == "fas fa-arrow-down") {
            var randomNum = Math.floor(Math.random() * arrowDirs.length)
            arrow.className = "fas fa-"+arrowDirs[randomNum]
            console.log("hit")
            targetL2.style.transition = "none"
            targetL2.style.marginRight = 0;
            targetPosX = 0;
            score++;
            aimBoxL2.style.backgroundColor = "green"
        }
        else if (e.code == "ArrowRight" && arrow.className == "fas fa-arrow-right") {
            var randomNum = Math.floor(Math.random() * arrowDirs.length)
            arrow.className = "fas fa-"+arrowDirs[randomNum]
            console.log("hit")
            targetL2.style.transition = "none"
            targetL2.style.marginRight = 0;
            targetPosX = 0;
            score++;
            aimBoxL2.style.backgroundColor = "green"
        }
        else if (e.code == "ArrowUp" && arrow.className == "fas fa-arrow-up"){
            var randomNum = Math.floor(Math.random() * arrowDirs.length)
            arrow.className = "fas fa-"+arrowDirs[randomNum]
            console.log("hit")
            targetL2.style.transition = "none"
            targetL2.style.marginRight = 0;
            targetPosX = 0;
            score++;
            aimBoxL2.style.backgroundColor = "green"
        }
        else if (e.code == "ArrowLeft" && arrow.className == "fas fa-arrow-left"){
            var randomNum = Math.floor(Math.random() * arrowDirs.length)
            arrow.className = "fas fa-"+arrowDirs[randomNum]
            console.log("hit")
            targetL2.style.transition = "none"
            targetL2.style.marginRight = 0;
            targetPosX = 0;
            score++;
            aimBoxL2.style.backgroundColor = "green"
        }
        else {
            targetL2.remove();
            console.log("GAME OVER")
        }
    }
    else {
        targetL2.remove();
        console.log("GAME OVER")
    }
        
}