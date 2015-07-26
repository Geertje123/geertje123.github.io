// TODO: Random names on rep messages
// TODO: Username specific actions

/**
 * Wiki Moderator
 *   "ban user from wiki"
 *   "approve new wiki content"
 * Forum Moderator
 *   "warn user"
 *   "infract user"
 *   "ban user"
 *   "update hack & tools list"
 *   "bitch about that one annoying user"
 * Lead Moderator
 *   "give forum mods advice"
 * Super Moderator
 *   "educate staff"
 *   "talk shit privately"
 *   "introduce new moderator"
 *   "Remove pawel from staff"
 * Forum Administrator
 *   "ban staff member"
 *   "talk shit secretly"
 *   "improve forum"
 *   "fix vB's shitty coding"
 *   "fix issue in vb plugin"
 * Site Administrator
 *   "reply with dickpick to EA lawsuit mail"
 *   "send fuck off in crayon to activision"
 *   "Accept donations"
 *   "Pay for cloudflare and servers"
 */

var version = "0.1.003";

var stats = {
    username: "",
    title: titles[0][0],
    userlevel: "",
    posts: 0,
    threads: 0,
    wikiarticles: 0,
    reputation: 10,
    knowledge: 0,
    isStaff: false,
    executedEvents: []
};

$(document).ready(function () {
    if (checkIfSaveExists()) {
        resumeGame();
    } else {
        showContent("#content-register");
    }
});

var checkIfSaveExists = function () {
    return localStorage.getItem("ucclicker-version") !== null &&
        localStorage.getItem("ucclicker-stats") !== null;
};

var resumeGame = function () {
    var storedVersion = JSON.parse(localStorage.getItem("ucclicker-version"));
    var storedStats = JSON.parse(localStorage.getItem("ucclicker-stats"));

    // If there is a different saved version found, make it compatible.
    if (version !== storedVersion) {
        for (var key in stats) {
            if (storedStats[key] === undefined) {
                storedStats[key] = stats[key];
            }
        }
        for (var key in storedStats) {
            if (stats[key] === undefined) {
                delete storedStats[key];
            }
        }
        localStorage.setItem("ucclicker-version", JSON.stringify(version));
    }
    stats = storedStats;

    markCompletedEvents();

    Materialize.toast("Welcome back, " + stats.username + "!", 5000);

    // Now display everything unlocked.
    // This needs to be optimized, but let's get it to work first.
    if (stats.posts >= 0) {
        showContent("#tabcontent-posts");
        showContent("#tabbutton-posts");
    }
    if (stats.posts >= 8) {
        showContent("#tabcontent-learning");
        showContent("#tabbutton-learning");
    }
    if (stats.posts >= 50) {
        showContent("#tabcontent-staff");
        showContent("#tabbutton-staff");
    }

    checkForButtonUnlock();

    showContent("#content-generalStats");
    showContent("#content-navigation");
    $(".indicator").addClass("teal").addClass("lighten-1");

    for (var key in stats){
        setStat(key, stats[key]);
    }

    saveData();
};

var saveData = function () {
    localStorage.setItem("ucclicker-version", JSON.stringify(version));
    localStorage.setItem("ucclicker-stats", JSON.stringify(stats));
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
    setStat("userlevel", userlevels[0][0]); $("#stats-userlevel").attr("style", "color: " + titles[0][1] + ";");
    setStat("posts", stats.posts);
    setStat("threads", stats.threads);
    setStat("wikiarticles", stats.wikiarticles);
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
        saveData();
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

    button.click(function () {
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

                // save every time something important happens
                saveData();
            });
        }
    });
});

$(".promotion-button").each(function () {
    var button = $(this);

    button.click(function () {
        if (!button.hasClass("disabled")) {
            buttonDisable(button);

            var progressBar = button.parent().parent().find(":nth-child(2)").find(".determinate" );
            progressBar.animate({ width: "100%" }, button.data("duration"), "linear", function () {
                // Enable button and move back the line.
                buttonEnable(button);
                progressBar.animate({ width: 0 }, 250);

                // Calculate the chance of promotion based on stats
                var promotionChance = 0;
                var breakpoint = Math.floor((Math.random() * 100) + 1);

                promotionChance += Math.floor(stats.posts / (button.data("postreq") + 1));
                promotionChance += Math.floor(stats.threads / (button.data("threadreq") + 1));
                promotionChance += Math.floor(stats.knowledge / (button.data("knowledgereq") + 1));

                console.log("promotionChance:", promotionChance);

                if (breakpoint <= promotionChance) {
                    setStat("userlevel", button.data("name"));

                    var index = 0;
                    $.each(titles, function (i) {
                        if (titles[i][0] === button.data("name")) {
                            index = i;
                        }
                    });

                    $("#stats-userlevel").attr("style", "color: " + titles[index][1] + ";");
                    button.parent().parent().addClass("invisible");

                    if (button.data("name") === "Wiki Moderator") {
                        Materialize.toast("Welcome to the staff team. You are now a " + button.data("name") + "!", 4000);
                    } else {
                        Materialize.toast("You have been promoted to " + button.data("name") + "!", 4000);
                    }
                } else {
                    Materialize.toast("Promotion failed!", 4000);
                }

                saveData();
            });
        }
    });
});

var runEvents = function () {
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

var markCompletedEvents = function () {
    for (var key in events) {
        // see bitchy comment in runEvents
        if (events.hasOwnProperty(key)) {
            // rip <= ie8
            // lol like anyone cares anyway
            if (stats.executedEvents.indexOf(events[key].id) > -1) {
                events[key].hasRun = true;
            }
        }
    }
};

var giveRep = function (calculatedRep) {
    var msg = randomNames.getRandom();

    if (calculatedRep > 0) {
        msg += " liked your post! &nbsp; <span class='green-text lighten-3'>+";
    } else {
        msg += " didn't like your post! &nbsp; <span class='red-text lighten-3'>-";
    }

    setStat("reputation", stats.reputation + calculatedRep);
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

    $(".promotion-button").each(function () {
        if ($(this) !== button) {
            var iteratedButton = $(this);

            if (stats.posts >= iteratedButton.data("postreq") &&
                stats.posts >= iteratedButton.data("threadreq") &&
                stats.knowledge >= iteratedButton.data("knowledgereq") &&
                stats.userlevel === iteratedButton.data("userlevelreq") &&
                iteratedButton.parent().parent().hasClass("invisible")) {

                Materialize.toast("New promotion button unlocked!", 4000);
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



