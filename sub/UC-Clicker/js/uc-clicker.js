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
    Materialize.toast("Welcome, " + stats.username + "! Let's start by posting some low quality thank you post, to boost your post count up!", 10000);
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

var buttonClick = function (section, button) {
    if (section === "post") {
        if (button === "thankYou") {
            increaseProgress("post", "thankYou", function () {
                setStat("posts", stats.posts + 1);
            });
        }
    }
};

var increaseProgress = function (section, button, callback) {
    var progressBar = $("#progress-" + section + "-" + button);
    var width = 0;

    while (width < 100) {
        width++;
        progressBar.width(width + "%");
    }

    //progressBar.width("0%");

    callback();
};

setInterval(function () {
    localStorage.setItem("ucclick-stats", JSON.parse(stats));
}, 2000);