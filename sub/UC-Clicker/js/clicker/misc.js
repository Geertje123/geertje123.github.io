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
    ["UnKnoWnCheaTeR", 800, "gold"],
    ["Master Contributor", 1000, "navy"],
    ["A Forum Hero", 1400, "red"],
    ["<b>Hacked North Korea</b>", 2000, "gold"],
    ["<b>Hacked the universe</b>", 3000, "navy"],
    ["<b>Expert Hacker</b>", 4000, "red"],
    ["<b><em>Unknown Hacker</em></b>", 5000, "gold"],
    ["<b><em>Infinite Poster</em></b>", 7500, "navy"],
    ["<b><em>MVP</em></b>", 10000, "red"]
];

var userlevels = [
    ["Member", "black"],
    ["Wiki Moderator", "#B87333"],
    ["Forum Moderator", "navy"],
    ["Lead Moderator", "#348781"],
    ["Super Moderator", "blue"],
    ["Forum Administrator", "darkred"],
    ["Site Administrator", "red"]
];

var randomNames = {
    names: ["Roverturbo", "Winslow", "learn_more", "Geertje123", "evolution536", "NotAdam"],
    getRandom: function() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }
};