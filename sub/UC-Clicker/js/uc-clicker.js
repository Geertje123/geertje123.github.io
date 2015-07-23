/**
 * TODO: Make the unlock system dynamic
 * TODO: Add more buttons
 * TODO: Add a staff tab
 * TODO: Being able to apply for staff at 50 posts (more posts && more rep === higher chance)
 */

var stats = {
    username: "",
    title: "A Pathetic n00bie",
    posts: 0,
    threads: 0,
    reputation: 10,
    knowledge: 0,
    //infractions: [],
    isStaff: false
};
var eventHappened = {
    posts: 0,
    learning: 0
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

var actionSections = {
    "post": {
        "thankYou": {
            unlocked: true,
            duration: 2000,
            friendlyName: "Thank You",
            requirements: {
                posts: 10,
                knowledge: 0
            },
            grants: {
                posts: 1,
                knowledge: 0,
                repChance: 1
            },
            buffs: {
                repChance: 8
            }
        },
        "giveGuiAdvice": {
            unlocked: false,
            duration: 3000,
            friendlyName: "Give GUI Advice",
            requirements: {
                posts: 10,
                knowledge: 0
            },
            grants: {
                posts: 1,
                knowledge: 0,
                repChance: 1
            },
            buffs: {
                repChance: 8
            }
        }
    },

    "learn": {
        "progForDummies": {
            unlocked: true,
            duration: 2000,
            friendlyName: "Read Programming For Dummies",
            requirements: {
                posts: 10,
                knowledge: 0
            },
            grants: {
                posts: 0,
                knowledge: 1,
                repChance: 0
            },
            buffs: {
                repChance: 0
            }

        },
        "readCppBook": {
            unlocked: false,
            duration: 3000,
            friendlyName: "Read CPP Book",
            requirements: {
                posts: 0,
                knowledge: 10
            },
            grants: {
                posts: 0,
                knowledge: 2,
                repChance: 0
            },
            buffs: {
                repChance: 0
            }

        }
    }
};

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
        //setStat("infractions", stats.infractions);
        startGame();
    } else {
        Materialize.toast("Please enter a valid username", 4000);
    }
};

var startGame = function () {
    Materialize.toast("Welcome, " + stats.username + "! Let's start by posting some low quality content, to boost your post count!", 10000);
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

// add buttons and shit


$("a[id^='btn-']").click(function () {





    /** Old and gay **//*
    var thisButton = $(this);
    var section = thisButton.prop("id").split("-")[1];
    var button = thisButton.prop("id").split("-")[2];


    if (section === "post" || section === "learn") {
        if (!$(this).hasClass("disabled")) {
            buttonDisable(thisButton);
            var duration = 0;
            var increment = 0;
            var repChance = 0;

            if (section === "post") {
                if (button === "thankYou") {
                    duration = 2000;
                    increment = 1;
                    repChance = 1;
                } else if (button === "giveAdviceOnGUI") {
                    duration = 3000;
                    increment = 2;
                    repChance = 8;
                }

                increaseProgress("post", button, duration, function () {
                    setStat("posts", stats.posts + increment);
                    buttonEnable(thisButton);
                    checkTitleUpdate(stats.posts);
                    checkForButtonUnlock("post");

                    // Deduct or add reputation by chance
                    if (Math.floor((Math.random() * 100) + 1) <= repChance) {
                        var gainedRep = Math.floor((Math.random() * 15) + 1);
                        Materialize.toast("Someone liked your post! &nbsp; <span class='green-text lighten-3'>+" + gainedRep + " rep</span>", 4000);
                        setStat("reputation", stats.reputation + gainedRep);
                    }
                    if (Math.floor((Math.random() * 100) + 1) <= Math.floor(repChance / 4)) {
                        var lostRep = Math.floor((Math.random() * 10) + 1);
                        Materialize.toast("Someone did not like your post! &nbsp; <span class='red-text lighten-3'>-" + lostRep + " rep</span>", 4000);
                        setStat("reputation", stats.reputation - lostRep);
                    }

                    // Handle events. Looks like shit I know.
                    if (stats.posts >= 6 && eventHappened.posts === 0) {
                        Materialize.toast("Someone noticed you are spamming thank you posts everywhere! &nbsp; <span class='red-text lighten-3'>-15 rep</span>", 4000);
                        setStat("reputation", stats.reputation - 15);
                        eventHappened.posts++;
                    }
                    if (stats.posts >= 7 && eventHappened.posts === 1) {
                        Materialize.toast("Maybe we should post some valuable content for once. Learning tab unlocked!", 4000);
                        showContent("#tabbutton-learning");
                        eventHappened.posts++;
                    }
                    if (stats.posts >= 20 && eventHappened.posts === 2) {
                        Materialize.toast("You are beginning to gain some popularity on the forums. Keep it going!", 4000);
                        eventHappened.posts++;
                    }
                    if (stats.posts >= 25 && eventHappened.posts === 3) {
                        Materialize.toast("New learning type unlocked!", 4000);
                        showContent("#learn-readCppBook");
                        eventHappened.posts++;
                    }
                });
            } else if (section === "learn") {
                if (button === "progForDummies") {
                    duration = 2000;
                    increment = 1;
                }
                if (button === "readCppBook") {
                    duration = 3000;
                    increment = 2;
                }

                increaseProgress("learn", button, duration, function () {
                    setStat("knowledge", stats.knowledge + increment);
                    buttonEnable(thisButton);

                    if (stats.knowledge >= 1 && eventHappened.learning === 0) {
                        Materialize.toast("Looks like someone is finally taking the effort to learn something!", 4000);
                        eventHappened.learning++;
                    }
                    if (stats.knowledge >= 5 && eventHappened.learning === 1) {
                        Materialize.toast("You've picked up basic knowledge. New post type unlocked!", 4000);
                        showContent("#post-giveAdviceOnGUI");
                        eventHappened.learning++;
                    }
                });
            }
        }
    }
    */
});

var checkForButtonUnlock = function (section) {
    // actionSections[section] do something with this
};

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

    progressBar.animate({
        width: "100%"
    }, duration, "linear", function() {
        callback();
        // move it back quickly but nicely :D
        progressBar.animate({
            width: 0
        }, 250);
    });
};

setInterval(function () {
    localStorage.setItem("ucclick-stats", JSON.parse(stats));
}, 2000);