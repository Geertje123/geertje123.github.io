var stats = {
    username: "",
    posts: 0,
    threads: 0,
    reputation: 10
};

var register = function () {
    var inputUsername = $("#input_username").val();

    if (inputUsername.length > 0 && inputUsername.length < 16) {
        hideContent("#content-register");
        setStat("username", inputUsername);
        setStat("posts", stats.posts);
        setStat("threads", stats.threads);
        setStat("reputation", stats.reputation);
        startGame();
    } else {
        Materialize.toast("Please enter a valid username", 4000);
    }
};

var startGame = function () {
    Materialize.toast("Welcome, " + stats.username + "! Let's start by posting some low quality thank you post, to boost your post count!", 10000);
    showContent("#content-generalStats");
    showContent("#content-postButtons");
};

var showContent = function (query) {
    $(query).removeClass("invisible");
};

var hideContent = function (query) {
    $(query).addClass("invisible");
};

var setStat = function (statKey, statValue) {
    stats[statKey] = statValue;
    $("#stats-" + statKey).text(statValue);
};


$("a[id^='btn-']").click(function () {
    var thisButton = $(this);
    var section = thisButton.prop("id").split("-")[1];
    var button = thisButton.prop("id").split("-")[2];

    if (!$(this).hasClass("disabled")) {
        buttonDisable(thisButton);
        var duration = 0;
        var increment = 0;
        var stat = "";

        if (section === "post") {
            if (button === "thankYou") {
                duration = 2000;
                increment = 1;
                stat = "posts";
            }
        }

        increaseProgress(section, button, duration, function () {
            setStat(stat, stats[stat] + increment);
            buttonEnable(thisButton);
        });
    }
});

var buttonDisable = function (button) {
    button
        .removeClass("waves-effect")
        .removeClass("waves-light")
        .addClass("disabled")
        .click(function (e) {
            e.preventDefault();
        });
};

var buttonEnable = function (button) {
    button
        .addClass("waves-effect")
        .addClass("waves-light")
        .removeClass("disabled");
};

var increaseProgress = function (section, button, duration, callback) {
    var progressBar = $("#progress-" + section + "-" + button);
    var startTime = new Date().getTime();
    var width = 0;

    var intervalId = setInterval(function () {
        var currentTimeTotal = new Date().getTime();
        var currentTime = currentTimeTotal - startTime;

        width = Math.round((currentTime * 100) / duration);
        progressBar.width(width + "%");

        if (currentTime >= duration) {
            clearInterval(intervalId);
            setTimeout(function() {
                progressBar.width("0%");
                callback();
            }, 350);
        }
    }, 5);


    /** Works, but the real-time duration is not 5 seconds, so it doesn't work... sort of... I guess... **//*
    var progressBar = $("#progress-" + section + "-" + button);
    var width = 0;
    var duration = 5000;
    var currentMs = 0;

    var intervalId = setInterval(function () {
        if (currentMs % 10 === 0) {
            width = (currentMs * 100) / duration;
            progressBar.width(width + "%");
        }

        if (currentMs === duration) {
            clearInterval(intervalId);
            callback();
        } else {
            currentMs++;
        }
    }, 1);
    */
};

setInterval(function () {
    localStorage.setItem("ucclick-stats", JSON.parse(stats));
}, 2000);