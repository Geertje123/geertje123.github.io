var register = function () {
    var inputUsername = $("#input_username").val();

    if (inputUsername.length > 0 && inputUsername.length < 16) {
        $("#content-register").remove();

        Materialize.toast("Welcome, " + inputUsername + "!", 4000);
        startGame(inputUsername);
    } else {
        Materialize.toast("Please enter a valid username", 4000);
    }
};

var startGame = function (username) {

};