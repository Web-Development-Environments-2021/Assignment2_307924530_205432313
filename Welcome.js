$(document).ready(function () {
    $("#welcomeButton").click(function () {
        clearIntervals();
        $(document.getElementById("register")).hide();
        $(document.getElementById("login")).hide();
        $('#welcome').css("display", "block");
        $(document.getElementById("setting")).hide();
        $("#random_btn").css("display", "none");
        $('#score_time_life').css('display', 'none');
        $("#foot").css("position","fixed");
        stopSong();
    });
});