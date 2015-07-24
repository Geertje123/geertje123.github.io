// TODO: Random names on rep messages

var version = "0.1.001";

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

var stats = {
    username: "",
    title: titles[0][0],
    posts: 0,
    threads: 0,
    reputation: 10,
    knowledge: 0,
    isStaff: false,
    executedEvents: []
};

var events = [
    // posts
    {
        id: 0,
        on: function() {
            return stats.posts > 5;
        },
        give: function() {
            Materialize.toast("Someone noticed you are spamming thank you posts everywhere! &nbsp; <span class='red-text lighten-3'>-15 rep</span>", 4000);
            setStat("reputation", stats.reputation - 15);
        }
    },
    {
        id: 1,
        on: function() {
            return stats.posts > 7;
        },
        give: function() {
            Materialize.toast("Maybe we should post some valuable content for once. Learning tab unlocked!", 4000);
            showContent("#tabbutton-learning");
        }
    },
    {
        id: 2,
        on: function() {
            return stats.posts > 20;
        },
        give: function() {
            Materialize.toast("You are beginning to gain some popularity on the forums. Keep it going!", 4000);
        }
    },
    // learning
    {
        id: 3,
        on: function() {
            return stats.knowledge > 0;
        },
        give: function() {
            Materialize.toast("Looks like someone is finally taking the effort to learn something!", 4000);
        }
    },
    {
        id: 4,
        on: function() {
            return stats.knowledge > 5;
        },
        give: function() {
            Materialize.toast("You've picked up basic knowledge!", 4000);
        }
    }
];

$(document).ready(function () {
    if (checkIfSaveExists()) {
        getSaveData();
    } else {
        setSaveData();
    }
});

var checkIfSaveExists = function () {
    return localStorage.getItem("ucclicker-version") !== null &&
        localStorage.getItem("ucclicker-stats") !== null &&
        localStorage.getItem("ucclicker-events") !== null;
};

var getSaveData = function () {
    var savedVersion = JSON.parse(localStorage.getItem("ucclicker-version"));
    stats = JSON.parse(localStorage.getItem("ucclicker-stats"));
    var eventsRan = JSON.parse(localStorage.getItem("ucclicker-events"));

    if (version !== savedVersion) {
        // uhhhhhhh
    }
};

var setSaveData = function () {
    localStorage.setItem("ucclicker-version", JSON.stringify(version));
    localStorage.setItem("ucclicker-stats", JSON.stringify(stats));
    localStorage.setItem("ucclicker-events", JSON.stringify(events));
};

var startGame = function (username) {
    // Shows all the different menu options, stats and so on.
    showContent("#tabbutton-posts");
    showContent("#tabcontent-posts");
    showContent("#content-generalStats");
    showContent("#content-navigation");

    // Displays the stats.
    setStat("username", username);
    setStat("title", titles[0][0]); $("#stats-title").attr("style", "color: " + titles[0][2] + ";");
    setStat("posts", stats.posts);
    setStat("threads", stats.threads);
    setStat("reputation", stats.reputation);
    setStat("knowledge", stats.knowledge);

    // Makes the tab underline the right colour.
    $(".indicator").addClass("teal").addClass("lighten-1");

    // Gives the user a welcome message.
    Materialize.toast("Welcome, " + stats.username + "! Let's start by posting some low quality content and boost your post count!", 10000);
};

var register = function () {
    var inputUsername = $("#input_username").val();

    if (inputUsername.length > 0 && inputUsername.length < 16) {
        hideContent("#content-register");
        startGame(inputUsername);
    } else {
        Materialize.toast("Please enter a valid username", 4000);
    }
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

$(".reward-button").each(function () {
    var button = $(this);

    $(button).click(function () {
        if (!button.hasClass("disabled")) {
            buttonDisable(button);

            var progressBar = button.parent().parent().find(":nth-child(2)").find(".determinate" );
            progressBar.animate({ width: "100%" }, button.data("duration"), "linear", function () {
                // Enable button and move back the line.
                buttonEnable(button);
                progressBar.animate({ width: 0 }, 250);

                // Update stats.
                setStat("posts", stats.posts + button.data("postreward"));
                setStat("threads", stats.threads + button.data("threadreward"));
                setStat("knowledge", stats.knowledge + button.data("knowledgereward"));

                runEvents();

                // Check for unlocks and rep gains.
                if (button.data("section") === "posts") {
                    checkIfNewTitleUnlocked();
                    doRepGainOrLoss(button.data("repchance"));
                }
                checkForButtonUnlock(button);
            });
        }
    });
});

var runEvents = function() {
    for (var key in events) {
        // because jslint sucks and it'll complain if hasOwnProperty is not used
        // here, therefore it exists here so it's no longer an annoyance for us
        if (events.hasOwnProperty(key)) {
            if (events[key].hasRun !== undefined)
                continue;

            if (events[key].on()) {
                events[key].give();
                events[key].hasRun = true;

                stats.executedEvents.push(events[key].id);
            }
        }
    }
};

var markCompletedEvents = function() {
    for (var key in events) {
        // see bitchy comment in runEvents
        if (events.hasOwnProperty(key)) {
            // rip <= ie8
            if (stats.executedEvents.indexOf(events[key].id) > -1) {
                events[key].hasRun = true;
            }
        }
    }
};

var giveRep = function(calculatedRep) {
    var msg = "Someone";

    if (calculatedRep > 0) {
        msg += " liked your post! &nbsp; <span class='green-text lighten-3'>+";
    } else {
        msg += " didn't like your post! &nbsp; <span class='red-text lighten-3'>-";
    }

    setStat("reputation", stats.reputation - calculatedRep);
    msg += calculatedRep + " rep</span>";

    Materialize.toast(msg, 4000);
};


var doRepGainOrLoss = function (repChance) {
    var calculatedRep = 0;

    if (Math.floor((Math.random() * 100) + 1) <= repChance) {
        calculatedRep = Math.floor((Math.random() * 15) + 1);
    } else if (Math.floor((Math.random() * 100) + 1) <= Math.floor(repChance / 4)) {
        calculatedRep = Math.floor((Math.random() * 10) + 1);
    }

    if (calculatedRep !== 0) {
        giveRep(calculatedRep);
    }
};

var checkForButtonUnlock = function (button) {
    $(".reward-button").each(function () {
        if ($(this) !== button) {
            var iteratedButton = $(this);

            if (stats.posts >= iteratedButton.data("postreq") &&
                stats.posts >= iteratedButton.data("threadreq") &&
                stats.knowledge >= iteratedButton.data("knowledgereq") &&
                iteratedButton.parent().parent().hasClass("invisible")) {
                Materialize.toast("New " + iteratedButton.data("section") + " button unlocked!", 4000);

                iteratedButton.parent().parent().removeClass("invisible");
            }
        }
    });
};

var checkIfNewTitleUnlocked = function () {
    var oldTitle = stats.title;
    var postCount = stats.posts;
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



