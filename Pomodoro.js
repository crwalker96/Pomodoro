var timerRunning = false;
var sessionTime = 25;
var breakTime = 5;
var minutes = null;
var seconds = 0;
var session = true;
var displayTime = "";
var totalSeconds = 0;
var buttonColor = "#2FE1E9";
function generateSVG(curSec, totSec) {
    var baseHTML = ""
    var percentOfTotal = Math.ceil((curSec/totSec)*100)/100;
    if (percentOfTotal === 1) {
        baseHTML += "<svg id = 'svg-hourglass' height='200' width='200'></svg>";
    } else if (percentOfTotal >= 0.50) {
        var angle = Math.PI/2 - (1 - percentOfTotal)*2*Math.PI;
        var xCoord = 100*(1 + Math.cos(angle));
        var yCoord = 100*(1 - Math.sin(angle));
        baseHTML += "<svg id = 'svg-hourglass' height='200' width='200'><path d='M 100 0 A 100 100 0 0 1 " + xCoord + " " + yCoord + " L 100 100 Z' /></svg>";
    } else if (percentOfTotal === 0) {
        baseHTML += "<svg id = 'svg-hourglass' height='200' width='200'><circle cx = '100' cy = '100' r = '100' /></svg>";
    } else {
        var angle = Math.PI/2 - (1 - percentOfTotal)*2*Math.PI;
        var xCoord = 100*(1 + Math.cos(angle));
        var yCoord = 100*(1 - Math.sin(angle));
        baseHTML += "<svg id = 'svg-hourglass' height='200' width='200'><path d='M 100 0 A 100 100 0 1 1 " + xCoord + " " + yCoord + " L 100 100 Z' /></svg>";
    }
    $("#clock-filler").html(baseHTML);
}
function decrementTimer() {
    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0 && seconds === 0) {
        seconds = 59;
        minutes--;
    } else if (minutes === 0 && seconds === 0) {
        session = !session;
        if (session) {
            minutes = sessionTime;
            $(".color-block").css("background-color", "#3FC1C9");
            buttonColor = "#2FE1E9";
            $("#sess-break").html("Session");
        } else {
            minutes = breakTime;
            $(".color-block").css("background-color", "#FC5185");
            buttonColor = "#FC71A5";
            $("#sess-break").html("Break");
        }
        totalSeconds = 60*minutes;
    }
    if (seconds.toString().length === 1) {
        displayTime = minutes.toString() + ":0" + seconds.toString();
    } else {
        displayTime = minutes.toString() + ":" + seconds.toString();
    }
    $("#clock-face").text(displayTime);
    generateSVG(minutes*60 + seconds, totalSeconds);
}
function startTimer() {
    timerRunning = true;
    session = true;
    if (minutes === null) {
        minutes = sessionTime;
        totalSeconds = minutes*60;
        $("#clock-face").text(minutes.toString() + ":0" + seconds.toString());
    } 
    timer = setInterval(decrementTimer, 1000);
}
function stopTimer() {
    timerRunning = false;
    clearInterval(timer);
}
function resetTimer() {
    if (timerRunning) {
        stopTimer();
    }
    if (!session) {
        $("#sess-break").html("Session");
    }
    minutes = null;
    seconds = 0;
    $("#clock-filler").html("<svg id = 'svg-hourglass' height='200' width='200'></svg>");
    $("#clock-face").text(sessionTime.toString());
}
function handleButtonClick(buttonText, parentID) {
    if (buttonText === "+") {
        if (parentID ==="session-set") {
            sessionTime++;
            $("#" + parentID + " .time-inc").html(sessionTime.toString());
        } else if (parentID ===  "break-set") {
            breakTime++;
            $("#" + parentID + " .time-inc").html(breakTime.toString());
        } else {
            throw Error("Something incredibly wonky happened.");
        }
    } else if (buttonText === "-") {
        if (parentID ==="session-set" && sessionTime > 1) {
            sessionTime--;
            $("#" + parentID + " p .time-inc").html(sessionTime.toString());
        } else if (parentID ===  "break-set" && breakTime > 1) {
            breakTime--;
            $("#" + parentID + " p .time-inc").html(breakTime.toString());
        } else {
            throw Error("Something incredibly wonky happened. Or you are trying to go too low on the timer. No time under 1 minute is allowed.");
        }
    } else {
        throw Error("Something incredibly wonky happened.");
    }
    if (parentID === "session-set") {
        $("#clock-face").text(sessionTime.toString());
    }
}
function handleClockClick() {
    if (timerRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}
$(document).ready(function(){
    $('.big-button').bind("mouseover", function(){
        var prevColor  = $(this).css("background-color");
        $(this).css("background-color", buttonColor);
        $(this).bind("mouseout", function(){
           $(this).css("background", prevColor);
        })    
    })    
    $(".button").click(function() {
        handleButtonClick($(this).text(), $(this).parent().parent().attr("id")); //get the text from the button and the parent's id
    });
    $("#start-stop").click(function() {
        handleClockClick();
    });
    $("#reset").click(function() {
        resetTimer();
    });
});