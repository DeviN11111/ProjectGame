var page_1 = document.getElementById("page_1");

var levelNumber = document.getElementById("levelNumber");
var levelLength = document.getElementById("levelLength");
var nextBtn = document.getElementById("nextBtn");
var error = document.getElementById("error");

nextBtn.onclick = function() {
    if (isNaN(levelNumber.value) || isNaN(levelLength.value) || levelNumber.value == "" || levelLength.value == "") {
        error.style.display = "block"
        error.innerHTML = "<strong>ERROR : </strong> invoer moet nummers zijn"
    } else if (levelLength.value % 3 != 0) {
        error.style.display = "block"
        error.innerHTML = "<strong>ERROR : </strong> level lengte moet deelbaar door 3 zijn"
    } else {
        error.style.display = "none";
        page_1.style.display = "none";
    }
}

var timeInMS;
var firstPress = true;
var timeStampsNofilter = [];
var timeStampsfilter = [];
var columnArray = [];
document.addEventListener("keypress", function(e) {
    if (e.code == "Digit1" || e.code == "Digit2" || e.code == "Digit3" || e.code == "Digit4") {
        columnArray.push(e.code[5] - 1)
        document.getElementById('levelCreater').innerHTML = timeStampsNofilter
        timeStampsNofilter.push(timeInMS)
        console.log(columnArray)
        console.log(timeStampsNofilter)
    }

    if (e.code == "KeyR") {
        filterStamps();
        console.log(timeStampsfilter)
    }

    if (e.code == "Space") {
        if (firstPress == true) {
            timertieMen();
            firstPress = false
        }
    }



})


function filterStamps() {
    timeStampsfilter.push(timeStampsNofilter[0])
    for (i = 0; i < timeStampsNofilter.length - 1; i++) {
        timeStampsfilter.push(timeStampsNofilter[i + 1] - timeStampsNofilter[i])
    }
    for (i = 0; i < timeStampsfilter.length; i++) {
        var kroket = timeStampsfilter[i] / 25
        timeStampsfilter[i] = Math.round(kroket) * 25
    }
    for (i = 0; i < timeStampsfilter.length; i++) {
        if (timeStampsfilter[i] < speeds * 2 + 10) {
            timeStampsfilter[i] = speeds * 2 + 10
        }
    }
}