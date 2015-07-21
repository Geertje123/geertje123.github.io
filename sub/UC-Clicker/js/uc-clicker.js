var stats = {
    username: "",
    title: "A Pathetic n00bie",
    posts: 0,
    threads: 0,
    reputation: 10,
    knowledge: 0
};

var titles = [
    ["A Pathetic n00bie", 0, "red"],
    ["n00bie", 1, "cyan"],
    ["Posting Well", 25, "navy"],
    ["Junior Member", 35, "orange"],
    ["Member", 55, "green"],
    ["Senior Member", 75, "red"],
    ["h4x0!2", 90, "blue"],
    ["1337 H4x0!2", 120, "purple"],
    ["God-Like", 145, "gold"],
    ["A God", 170, "gold"],
    ["Super l337", 200, "gold"],
    ["Hacker Supreme", 220, "gold"],
    ["A Legend", 250, "gold"],
    ["UC Supporter", 280, "gold"],
    ["Super H4x0r", 310, "gold"],
    ["Supreme G0d", 350, "gold"],
    ["The 0n3", 410, "red"],
    ["The Legendary Cheater", 470, "blue"],
    ["Supreme H4x0|2", 570, "yellow"],
    ["I Own Everyone", 700, "green"],
    ["UnKnoWnCheaTeR", 800, "gold"]
];

var register = function () {
    var inputUsername = $("#input_username").val();

    if (inputUsername.length > 0 && inputUsername.length < 16) {
        hideContent("#content-register");
        setStat("username", inputUsername);
        setStat("title", titles[0][0]);
        $("#stats-title").attr("style", "color: " + titles[0][2] + ";");
        setStat("posts", stats.posts);
        setStat("threads", stats.threads);
        setStat("reputation", stats.reputation);
        setStat("knowledge", stats.knowledge);
        startGame();
    } else {
        Materialize.toast("Please enter a valid username", 4000);
    }
};

var startGame = function () {
    Materialize.toast("Welcome, " + stats.username + "! Let's start by posting some low quality thank you post, to boost your post count!", 10000);
    showContent("#tabbutton-posts");
    showContent("#content-generalStats");
    showContent("#content-navigation");
    showContent("#content-postButtons");
    $(".indicator").addClass("teal").addClass("lighten-1");
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
            checkTitleUpdate(stats[stat]);

            if (stats.posts === 7) {
                Materialize.toast("Someone noticed you are spamming thank you posts everywhere! &nbsp; <span class='red-text lighten-3'>-15 rep</span>", 4000);
                setStat("reputation", stats.reputation - 15);
            }
            if (stats.posts === 9) {
                Materialize.toast("Maybe we should post some valuable content for once. We need to learn to do that though!", 4000);
                showContent("#tabbutton-learning");
            }
        });
    }
});

var checkTitleUpdate = function (postCount) {
    var oldTitle = stats.title;
    var newTitle = "";
    var newColour = "";

    $.each(titles, function (i) {
        if (postCount >= titles[i][1]) {
            newTitle = titles[i][0];
            newColour = titles[i][2];
        }
    });

    if (oldTitle !== newTitle) {
        Materialize.toast("New title achieved!", 4000);
        setStat("title", newTitle);
        $("#stats-title").attr("style", "color: " + newColour + ";")
    }
};

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