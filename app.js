var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var MoveUp = 38;
var MoveDown = 40;
var MoveLeft = 37;
var MoveRight = 39;
var foodRemain = -1;
var NumOfmonsters = -1;
var timeToPlay = -1;
var playerName;
var StopSoungEffects = false;
var intervals = [];
var CellHeight;
var CellWidth;
var MonstersRHere;
var color;
var pacmanRight = true;
var pacmanLeft = false;
var pacmanUp = false;
var pacmanDown = false;
var lives = 5;
var pacmanRemain;
var emptyCell;
var columns =15;
var lines = 15;
var CreepyMusic = new Audio('audio/creepy.mp3');
var GameCompleted = false;
var ClockIsHere;
var ClockMoveUp = true;
var ClockRow;
var ClockCol;
var ClockEaten;


/* defult user */
$(document).ready(function () {
    let defUserName = {
        userName: "k",
        userPassword: "k",
        firstName: "k",
        lastName: "k",
        mail: "k@gmail.com",
        birthDay: Date.now()
    };
    let str = JSON.stringify(defUserName);
    localStorage.setItem("k", str);
});

$.ajax({
    type: "POST",
    url: "/savedata.php",
    data: {
        width        : $(window).width(),
        height       : $(window).height(),
        screen_width : screen.width,
        screen_height: screen.height
    }
});

/*DONE*/
$(document).ready(function () {
    $("#welcomeBtn").click(function () {
       showWelcome();
       CreepyMusic.pause();
    });
});
/*DONE*/
function showWelcome(){
    clearIntervals();
    hideForWelcomeButtonClicked();
    $('#welcome').css("display", "block");
    $("#bottomFooter").css("position","fixed");
}
/*DONE*/
function hideForWelcomeButtonClicked(){
    $(document.getElementById("about")).hide();
    $(document.getElementById("register")).hide();
    $(document.getElementById("login")).hide();
    $(document.getElementById("settings")).hide();
    $("#random_btn").css("display", "none");
    $('#gameAreaDiv').css('display', 'none');
}

/* ################# LOGIN ##########################*/
/*DONE*/
$(document).ready(function () {
    $("#loginBtn").click(function () {
        showLogin();
    });
});
function showLogin() {
    document.getElementById("name").value = null;
    document.getElementById("userPassword").value = null;
    hideForLoginButtonClicked();
    $(document.getElementById("login")).show();
    $("#random_btn").css("display", "none");
    $('#gameAreaDiv').css('display', 'none');
    $("#footer").css("position","fixed");
    clearIntervals();
    CreepyMusic.pause();
}
function hideForLoginButtonClicked(){
    $(document.getElementById("welcome")).hide();
    $(document.getElementById("about")).hide();
    $(document.getElementById("register")).hide();
    $(document.getElementById("settings")).hide();
}
/*DONE*/
$(document).ready(function () {
    $("#registerBtn").click(function () {
       showRegister();
    });
});

function StopCreepySong(){
    CreepyMusic.pause();
}

function PlayCreepySong() {
    CreepyMusic.play();
}

function showRegister(){
    clearIntervals();
    hideForRegisterButtonClicked();
    $("#random_btn").css("display", "none");
    $("#register").show(300);
    $("#bottomFooter").css("position","fixed");
    CreepyMusic.pause();
}
function hideForRegisterButtonClicked(){
    $('#welcome').css("display", "none");
    $(document.getElementById("about")).hide();
    $(document.getElementById("login")).hide();
    $(document.getElementById("settings")).hide();
    $('#gameAreaDiv').css('display', 'none');
}
/* form[name=settings Handler */
$(function() {
    $("form[name='settings']").validate({
        rules: { // Specify validation rules
            food: {
                required: true,
                min: 50,
                max: 90,
            },
            monsters: {
                required: true,
                min: 1,
                max: 4,
            },
            setTime: {
                required: true,
                min: 60,
            },
        },
        messages: { // Specify validation error messages
            food: {
                required: "you forgot to fill in the amount of food",
                min: "you forgot to choose a number between 50 and 90",
                max: "you forgot to choose a number between 50 and 90",
            },
            monsters: {
                required: "you forgot to fill in the amount of monsters",
                min: "you forgot to choose a number between 1 and 4",
                max: "you forgot to choose a number between 1 and 4",
            },
            setTime: {
                required: "you forgot to choose the duration of the game",
                min: "The minimum duration is at least 60 seconds",
            },
        },
        submitHandler: function(form) {
            submitSettingsHandler();
            initializeGameDesign();
        },
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors == 1
                    ? 'Please correct the following error:\n'
                    : 'Please correct the following ' + errors + ' errors.\n';
                var errors = "";
                if (validator.errorList.length > 0) {
                    for (x=0;x<validator.errorList.length;x++) {
                        errors += "\n\u25CF " + validator.errorList[x].message;
                    }
                }
                alert(message + errors);
            }
            validator.focusInvalid();
        }
    });
});

function submitSettingsHandler(){//Show gameAreaDiv
    $("#settings").css("display", "none");
    $("#random_btn").css("display", "none");
    $("#menu").css("position", "fixed");
    $('#gameAreaDiv').css('display', 'block');
    displaySettingDuringTheGame();
}

function PlaceClock(){
    var cell= findRandomEmptyCell(board);
    ClockRow = cell[0];
    ClockCol = cell[1];
    ClockIsHere[ClockRow][ClockCol] = 10;
    board[ClockRow][ClockCol] = 10;
}

function initializeGameDesign() {
    context = canvas.getContext("2d");
    calculateCellSize();
    $("#bottomFooter").css("position","relative");
    displaySettingDuringTheGame();
    initGame();
    //$("#newGame_btn").css("display","block");
}

function displaySettingDuringTheGame() {
    // initSetting();
    document.getElementById('pl_name').innerHTML = playerName;
    if($('#upId').val()){/*Input element in Settings Form with id="upId"*/
        document.getElementById('up').innerHTML = document.getElementById("upId").value;
    }
    else {
        document.getElementById('up').innerHTML;
    }
    if($('#downId').val()){
        document.getElementById('down').innerHTML = document.getElementById("downId").value;
    }
    else {
        document.getElementById('down').innerHTML;
    }
    if($('#rightId').val()){
        document.getElementById('right').innerHTML = document.getElementById("rightId").value;
    }
    else {
        document.getElementById('right').innerHTML;
    }
    if($('#leftId').val()){
        document.getElementById('left').innerHTML = document.getElementById("leftId").value;
    }
    else{
        document.getElementById('left').innerHTML;
    }
    document.getElementById('balls').innerHTML = document.settings.food.value;
    document.getElementById('timePlay').innerHTML = document.settings.setTime.value;
    document.getElementById('mons').innerHTML = document.settings.monsters.value;
}

/*this BINDS the keyCode the User chose to the variables up, down, left, right*/
function changeUserKeysValues(event) {
    //set key from event's id
    if (event.target.id === "downId") {
        MoveDown = event.keyCode;
        if(event.key.length > 1) {
            downId.value = event.key;
        }

    }else if (event.target.id === "leftId") {
        MoveLeft = event.keyCode;
        if(event.key.length > 1) {
            leftId.value = event.key;
        }

    }
    else if (event.target.id === "upId") {
        MoveUp = event.keyCode;
        // upId.value = event.key;
        if(event.key.length > 1) {
            upId.value = event.key;
        }
    }
    else if (event.target.id === "rightId") {
        MoveRight = event.keyCode;
        if(event.key.length > 1) {
            rightId.value = event.key;
        }
    }
}

function randomSetting() {
    clearIntervals();
    MoveLeft = 37;
    MoveUp = 38;
    MoveRight = 39;
    MoveDown = 40;
    document.getElementById("ball_5_points").value = getRandomColor();
    document.getElementById("ball_15_points").value = getRandomColor();
    document.getElementById("ball_25_points").value = getRandomColor();
    food.value = getRandomFoodAmount();
    monsters.value = getRandomMonstersAmount();
    setTime.value = getRandomTimeAmount();
}

function setDefaultValuesForSettingsBoxes() {//set the default keys to arrows
    setDefaultColorsInSettings();
    document.getElementById("food").value = null;
    document.getElementById("monsters").value = null;
    document.getElementById("setTime").value = null;
    MoveLeft = 37;
    MoveUp = 38;
    MoveRight = 39;
    MoveDown = 40;
}

function setDefaultColorsInSettings(){
    $("#ball_5_points").value = getRandomColor();
    $("#ball_15_points").value = getRandomColor();
    $("#ball_25_points").value = getRandomColor();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    while(color === '#000000' || color === '#'){
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
}

function getRandomFoodAmount(){
    foodRemain = -1;
    while (foodRemain < 50 || foodRemain > 90) {
        foodRemain = parseInt(100 * Math.random());
    }
    return foodRemain;
}

function getRandomMonstersAmount(){
    NumOfmonsters = -1;
    while (NumOfmonsters < 1 || NumOfmonsters > 4) {
        NumOfmonsters = parseInt(10 * Math.random());
    }
    return NumOfmonsters;
}

function getRandomTimeAmount(){
    timeToPlay = -1;
    while (timeToPlay < 60) {
        timeToPlay = parseInt(100 * Math.random());
    }
    return timeToPlay;
}

function displaySettings() {
    /*if(!CreepyMusic.paused){
        CreepyMusic.stop();
    }
*/
    $("#loading_img").css("display","none");
    setDefaultValuesForSettingsBoxes();
    $('#settings').css('display', 'block');
    $("#random_btn").css("display","block");
    $('#game').css('display', 'block');
    $('#gameAreaDiv').css('display', 'none');
}



/*################# registration ###################*/


/* form[name=Registration Handler */
$(function() {
   /* $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "only letters allowed");

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^.*(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/i.test(value);
    }, "your password must include both letters and numbers");
*/
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    defineRegexForValidate();
    $("form[name='registration']").validate({
        // Specify validation rules
        rules: {
            user_name: "required",
            user_password: {
                required: true,
                minlength: 6,
                alphanumeric: true,
            },
            userFirstName: {
                required: true,
                lettersonly: true
            },
            userLastName: {
                required: true,
                lettersonly: true
            },
            userMail: {
                required: true,
                email: true
            },
            birthday: "required",
        },
        // Specify validation error messages
        messages: {
            user_name: "you must enter Username",
            user_password: {
                required: "you must enter Password",
                minlength: "Password length must be at least 6 characters and numbers"
            },
            userFirstName: {
                required: "you must enter first name",
                lettersonly: "First name must contains only letters"
            },
            userLastName: {
                required: "you must enter last name",
                lettersonly: "Last name must contains only letters"
            },
            userMail: {
                required: "you must enter valid email address",
                email: "not valid email address"
            },
            birthday: "you must enter your date of birth",
        },
        submitHandler: function(form) {
            insertUserToDB();
        },
        invalidHandler: function(event, validator) {
            let errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors == 1
                    ? 'Please correct the following error:\n'
                    : 'Please correct the following ' + errors + ' errors.\n';
                errors = "";
                if (validator.errorList.length > 0) {
                    for (x=0;x<validator.errorList.length;x++) {
                        errors += "\n\u25CF " + validator.errorList[x].message;
                    }
                }
                alert(message + errors);
            }
            validator.focusInvalid();
        }
    });
});

function defineRegexForValidate(){
    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "only letters allowed");

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^.*(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/i.test(value);
    }, "your password must include both letters and numbers");
}
function insertUserToDB() {
    var user_name = document.getElementById("user_name").value;
    var password =  document.getElementById("user_password").value;
    var firstName = document.getElementById("userFirstName").value;
    var lastName = document.getElementById("userLastName").value;
    var userMail = document.getElementById("userMail").value;
    var date = document.getElementById("birthday").value;
    if (localStorage.getItem(user_name) === null) {
        let data = {
            userName: user_name,
            userPassword: password,
            firstName: firstName,
            lastName: lastName,
            mail: userMail,
            birthDay: date
        };
        window.localStorage.setItem(user_name, JSON.stringify(data));
        document.forms[0].reset();
        hideRegisterForm_and_ShowLoadingImage();
    }
    else {
        alert("Seems like this Username is already taken...");
    }
}
function hideRegisterForm_and_ShowLoadingImage(){
    $('#register').css('display', 'none');
    $("#loading_img").css("display","block");
    setTimeout(displaySettings,2000);
    playerName = userMail;
}

function validateUserPassword() {
    let userName = document.getElementById("name").value;
    let userPassword = document.getElementById("userPassword").value;
    let originalData = localStorage.getItem(userName);
    console.info(originalData);
    if ( userName === "" || userPassword ==="") {
        alert("you didn't enter Username or Password");
    }
    else if(originalData === null){
        alert("no such user, you must register first");
    }
    else {
        let dataObj = JSON.parse(originalData);
        let psd = dataObj.userPassword;
        let name = dataObj.userName;
        if( userPassword !== psd){
            alert("Wrong Password");
        }
        if (userName === name && userPassword === psd) {
            $('#login').css('display', 'none');
            $("#loading_img").css("display","block");
            setTimeout(displaySettings,1500);
            playerName = userName;
        }
    }
}

function aboutModalHandler() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";  // display "about" modal
    var btn = $("#myBtn");
    /*close modal by:
    * 1. clicking the "x" button
    * 2. clicking anywhere outside the modal
    * 3. clicking the Esc button */
    window.onclick = function (event) { //clicks anywhere -> close modal
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    var span = document.getElementById("closeAbout") // clicking the "x" button -> close modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    document.onkeydown = function (event) { // clicking the Esc button -> close modal
        var x = event.keyCode;
        if (x === 27) {
            modal.style.display = "none";
        }
    }
}
function closeAbout_Clicked_X(event){
    var span = document.getElementById("closeAbout") // clicking the "x" button -> close modal
    span.onclick = function () {
        modal.style.display = "none";
    }
}
function closeAbout_ClickedAnywhere(event){
    window.onclick = function (event) { //clicks anywhere -> close modal
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}
function closeAbout_ClickedEsc(event){
    document.onkeydown = function (event) { // clicking the Esc button -> close modal
        var x = event.keyCode;
        if (x === 27) {
            modal.style.display = "none";
        }
    }
}
function showRegistration() {
    clearIntervals();
    $('#welcome').css("display", "none");
    $(document.getElementById("about")).hide();
    $(document.getElementById("login")).hide();
    $(document.getElementById("register")).show();
    $("#register").show(300);
}


/*############################## BARAKs CODE   ##########################################*/

$(document).ready(function() {
    context = canvas.getContext("2d");
    Start();
});

const wallCells = [
    "1,1", "1,2", "1,3", "1,4", "5,1", "4,1", "3,1", "2,1",
    "1,6", "2,6", "3,6", "1,8", "1,9", "1,10", "2,10", "3,10",
    "3,12", "4,12", "5,12", "6,12", "7,12", "8,12", "9,12", "3,13", "4,13", "5,13", "6,13", "7,13", "8,13", "9,13",
    "5,1", "5,2", "5,3", "5,4", "6,1", "6,2", "6,3", "6,4",
    "5,6", "6,6", "7,6", "8,6", "9,6", "5,7", "6,7", "7,7", "8,7", "9,7", "8,10", "8,8", "8,9", "9,10", "9,8", "9,9",
    "8,0", "8,1", "9,0", "9,1",
    "8,3", "9,3", "10,3", "11,3", "12,3", "9,4", "10,4", "11,4", "12,4", "11,1", "11,2", "12,1", "12,2",
    "11,6", "12,6", "13,6", "14,6",
    "11,9", "11,10", "11,11", "11,13", "12,9", , "13,9", , "14,9",
];


function Start() {
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var food_remain = parseInt($(document.getElementById("food")).val());
    var monster_remain = parseInt($(document.getElementById("monsters")).val());;
    var remaining_15_pt = 0.3 *food_remain;
    var remaining_5_pt= 0.6 * food_remain;
    var remaining_25_pt = food_remain - remaining_5_pt - remaining_15_pt;
    ClockEaten = false;

    ClockIsHere= new Array();
    MonstersRHere = new Array();

    for (var i = 0; i < lines; i++) {
        MonstersRHere[i] = new Array();
        ClockIsHere[i] = new Array();
        for (var j= 0 ; j<columns ; j++){
            MonstersRHere[i][j] =0;
            ClockIsHere[i][j] =0;
        }
    }

    start_time = new Date();
    for (var i = 0; i < lines; i++) {
        board[i] = new Array();

        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < columns; j++) {
            let cell= "" +i + "," +j;
            if (wallCells.includes(cell)) {
                board[i][j] = 4;
            }else if(monster_remain>0 && ((j===0 || j===lines-1) && ( i===0 || i===columns-1 ))){
                monster_remain--;
                if(monster_remain %2 === 0){
                    board[i][j] = 7;
                    MonstersRHere[i][j] = 7;
                }
                else{
                    board[i][j] = 9;
                    MonstersRHere[i][j] = 9;
                }

            }
            else {
                board[i][j] = 0;
            }

        }


    }
    PlaceClock();
    PlacePacman();
    PlaceFives(remaining_5_pt)
    PlaceFifteen(remaining_15_pt)
    PlaceTwentyFive(remaining_25_pt);

    keysDown = {};
    addEventListener(
        "keydown",
        function(e) {
            keysDown[e.keyCode] = true;
            /*
                        if([32,37,38,39,40].indexOf(e.keyCode) > -1){
                            e.preventDefault();
                        }
            */
        },
        false
    );
    addEventListener(
        "keyup",
        function(e) {
            keysDown[e.keyCode] = false;
        },
        false
    );
    interval = setInterval(UpdatePacmanPosition, 350);
    interval = setInterval(UpdateMonsterPosition, 1200);
    interval = setInterval(UpdateClockPosition, 1000);
    interval = setInterval(Draw, 300);
}

function PlaceTwentyFive(remaining_25_pt) {
    while (remaining_25_pt > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 3;
        remaining_25_pt--;
        foodRemain--;
    }
}

function PlaceFifteen(remaining_15_pt) {
    while (remaining_15_pt > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 6;
        remaining_15_pt--;
        foodRemain--;
    }
}

function PlacePacman() {
    emptyCell = findRandomEmptyCell(board);
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    board[shape.i][shape.j] = 2;
}

function PlaceFives(numOfFives){
    while (numOfFives > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 5;
        numOfFives--;
        foodRemain--;
    }
}

function findRandomEmptyCell(board) {
    var i = Math.floor(Math.random() * columns);
    var j = Math.floor(Math.random() * lines);

    while (board[i][j] !== 0) {
        i = Math.floor(Math.random() * columns);
        j = Math.floor(Math.random() * lines);
    }
    return [i, j];
}

function GetKeyPressed() {
    if (keysDown[MoveUp]) {
        return 1;
    }
    if (keysDown[MoveDown]) {
        return 2;
    }
    if (keysDown[MoveLeft]) {
        return 3;
    }
    if (keysDown[MoveRight]) {
        return 4;
    }
}

function calculateCellSize(){
    CellHeight = canvas.height/columns;
    CellWidth = canvas.width/lines;
}

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context = canvas.getContext("2d");
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    calculateCellSize();
    var KnifeMonster = new Image();
    KnifeMonster.src = "image/knife.jpeg";
    var ghostMonster = new Image();
    ghostMonster.src = "image/ghost.jpeg";
    var TumbLife = new Image();
    TumbLife.src = "image/tumb.jpeg";
    var wallPic = new Image();
    wallPic.src = "image/pumpkinWall.jpg";
    var Clock= new Image();
    Clock.src = "image/Clock.jfif";
    color = getRandomColor();
    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < columns; j++) {
            let bordVal = board[i][j];
            let MonsVal = MonstersRHere[i][j];
            console.log(MonsVal);
            var center = new Object();
            center.x = i * CellWidth + CellWidth/2;
            center.y = j * CellHeight + CellHeight/2;
            if (MonsVal === 7) {
                context.drawImage(KnifeMonster, center.x - CellWidth/2, center.y - CellHeight/2);
            }
            else if (MonsVal === 9) {
                context.drawImage(ghostMonster, center.x - CellWidth/2, center.y - CellHeight/2);
            }
            else if(ClockIsHere[i][j]===10){
                context.drawImage(Clock, center.x - CellWidth/2, center.y - CellHeight/2);
            }
            else if (bordVal === 2 && pacmanLeft && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, -0.85 * Math.PI, 0.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanUp && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 1.7 * Math.PI, 1.35 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 10, center.y + 5, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanRight && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanDown && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 0.75 * Math.PI, 0.35 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 8   , center.y - 8, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
                /*5 point ball*/
            } else if (bordVal === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#3c84ef"; //color
                context.fill();
                context.fillStyle = document.getElementById("ball_5_points").value; //color
                context.font = "bold 10px Arial";
                context.fillText("5", center.x - 3, center.y + 4);
                /*15 point ball*/
            } else if (bordVal === 6) {
                context.beginPath();
                context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
                context.fillStyle = document.getElementById("ball_15_points").value; //color
                context.fill();
                context.fillStyle = "white"; //color
                context.font = "bold 10px Arial";
                context.fillText("15", center.x - 6, center.y + 4);
            } else if (bordVal === 3) {
                context.beginPath();
                context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
                context.fillStyle = color; //random color
                context.fill();
                context.fillStyle = "black"; //color
                context.font = document.getElementById("ball_25_points").value;
                context.fillText("25", center.x - 5, center.y + 3);
            } else if (bordVal === 4) {
                context.beginPath();
                context.strokeStyle = "#3c3cef";
                //context.drawImage(wallPic,center.x - 18,center.y - 17);
                context.drawImage(wallPic,center.x - CellWidth/2, center.y - CellHeight/2,CellWidth,CellHeight);
            }
        }
    }}

function clearIntervals() {
    while(intervals.length > 0) {
        clearInterval(intervals.pop());
    }
}

function UpdatePacmanPosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x == 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
            shape.j--;
            pacmanDown =false;
            pacmanLeft = false;
            pacmanRight = false;
            pacmanUp =true;
        }
    }
    if (x == 2) {
        if (shape.j < 14 && board[shape.i][shape.j + 1] != 4) {
            shape.j++;
            pacmanUp = false;
            pacmanLeft = false;
            pacmanRight = false;
            pacmanDown =true;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            shape.i--;
            pacmanDown = false;
            pacmanUp= false;
            pacmanRight = false;
            pacmanLeft =true;
        }
    }
    if (x == 4) {
        if (shape.i < 14 && board[shape.i + 1][shape.j] != 4) {
            shape.i++;
            pacmanDown = false;
            pacmanUp = false;
            pacmanLeft = false;
            pacmanRight = true;
        }
    }
    x=-1;
    let BoardVal = board[shape.i][shape.j];
    if(BoardVal === 5 || BoardVal===6 || BoardVal===7){
        if(board[shape.i][shape.j] ==5 ){
            score = score+5;
            document.getElementById("alertString").innerHTML = "You Got 5 points!!";
        }
        if (board[shape.i][shape.j] == 6){
            score = score+15;
            document.getElementById("alertString").innerHTML = "You Got 15 points!!";
        }
        if(board[shape.i][shape.j] ==3){
            score = score+25;
            document.getElementById("alertString").innerHTML = "You Got 25 points!!";
        }
        if(!StopSoungEffects){
            var FruitAudio = new Audio('audio/pacman_eatfruit.wav');
            FruitAudio.play();
        }
    }
    if(ClockIsHere[shape.i][shape.j] === 10 ){
        ClockIsHere[shape.i][shape.j] =0;
        addTime();
    }
    let MonsPacVal = MonstersRHere[shape.i][shape.j];
    if (MonsPacVal===7){
        MeetMonster(7);
    }
    if (MonsPacVal===9){
        MeetMonster(9);
    }
    if(lives>1 && !StopSoungEffects && (MonsPacVal===7 || MonsPacVal === 9)){
        var audioGhost = new Audio('audio/pacman_eatghost.wav');
        audioGhost.play();
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 75 && time_elapsed <= 10 && pac_color!= "green") {
        pac_color = "green";
    }
    if (score >= 200  && !GameCompleted) {
        window.clearInterval(interval);
        window.alert("Winner!!");
        /*var audioDeath = new Audio('audio/pacman_death.wav');
        audioDeath.play();*/
        CreepyMusic.pause();
        displaySettings();
        GameCompleted= true;
    }
}

function UpdateClockPosition(){
    if(!ClockEaten){
        if(ClockMoveUp && board[ClockRow][ClockCol-1]!=4 && ClockCol >1){
            ClockIsHere[ClockRow][ClockCol]=0;
            ClockIsHere[ClockRow][ClockCol - 1]=10;
            ClockCol--;
        }
        else if(!ClockMoveUp && board[ClockRow][ClockCol + 1]!=4 && ClockCol <14){
            ClockIsHere[ClockRow][ClockCol]=0;
            ClockIsHere[ClockRow][ClockCol + 1]=10;
            ClockCol++;
        }
        else{//} if(board[ClockRow][ClockCol - 1]===4 && board[ClockRow][ClockCol + 1]===4){
            if(board[ClockRow-1][ClockCol]!=4 && ClockRow >1){
                ClockIsHere[ClockRow][ClockCol]=0;
                ClockIsHere[ClockRow-1][ClockCol]=10;
                ClockRow--;
            }
            else if(board[ClockRow+1][ClockCol]!=4 && ClockRow <14){
                ClockIsHere[ClockRow][ClockCol]=0;
                ClockIsHere[ClockRow+1][ClockCol]=10;
                ClockRow++;
            }
        }
        //Update time if neceserry
        if(board[ClockRow][ClockCol] == 2 ){
            ClockIsHere[ClockRow][ClockCol]=0;
            addTime();
        }
    }


}

function addTime(){
    ClockIsHere[shape.i][shape.j] =0;
    time_elapsed = time_elapsed +10;
    window.alert("You Got 10 seconds!!");
    ClockEaten =true;
}

function UpdateMonsterPosition(){

    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < columns; j++) {
            let CellVal= MonstersRHere[i][j];
            if (CellVal === 7 || CellVal === 9 ) {
                var randomNum = Math.floor(Math.random() * 2);/*0,1*/
                var notMove = true;

                //monster get down
                if (randomNum === 0 && Math.abs(((i + 1) - shape.i) < Math.abs((i - 1) - shape.i)) && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i + 1][j] = CellVal;
                    notMove = false;
                }
                //monster get up
                else if (randomNum === 0 && Math.abs(((i + 1) - shape.i) > Math.abs((i - 1) - shape.i)) && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i - 1][j] = CellVal;
                    notMove = false;
                }
                //monster get right
                else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) < Math.abs((j - 1) - shape.j)) && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7 && MonstersRHere[i][j + 1] !== 9) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i][j + 1] = CellVal;
                    notMove = false;
                }
                //monster get left
                else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) > Math.abs((j - 1) - shape.j)) && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !==7 && MonstersRHere[i][j - 1] !== 9) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i][j - 1] = CellVal;
                    notMove = false;
                } else if (notMove || shape.i == i || shape.j == j) {
                    while (notMove) {
                        var randomMoveIfStack = Math.floor(Math.random() * 4);/*0,1*/
                        if (randomMoveIfStack === 0 && i-1 >= 0 && i-1 <= 14 && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7 && MonstersRHere[i-1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i - 1][j] = CellVal;
                            notMove = false;
                        } else if (randomMoveIfStack === 1  && i+1 >= 0 && i+1 <= 14 && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7 && MonstersRHere[i+1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i + 1][j] = CellVal;
                            notMove = false;
                        }
                        //get right
                        else if (randomMoveIfStack === 2  && (j+1 >= 0) && (j+1 <= 14) && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7&& MonstersRHere[i+1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i][j + 1] = CellVal;
                            notMove = false;
                        }
                        //get left
                        else if (randomMoveIfStack === 3 && j >0 && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !== 7 && MonstersRHere[i][j - 1] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i][j - 1] = CellVal;
                            notMove = false;
                        }
                    }
                }
            }
        }
    }
    let CellVal= MonstersRHere[shape.i][shape.j];
    if(CellVal === 7 || CellVal===9){
        MeetMonster(CellVal);
        if(lives >1 && !StopSoungEffects){
            var audio = new Audio('audio/pacman_eatghost.wav');
            audio.play();
        }
    }
}

function stopSoundEffect() {
    StopSoungEffects = true;
}

function MeetMonster(MonsVal){
    removeLifeIcon(lives);
    lives--;
    board[shape.i][shape.j] = 0;
    score = score - 10;
    NumOfmonsters = parseInt($(document.getElementById("monsters")).val());

    pacmanRemain=0;
    //setTimeout(continueGameLifeDown, 500);
    if(MonsVal===9){
        score= score-10;
    }
    else if (MonsVal ===7) { //7
        score = score- 20;
    }


    if(lives===0 && !GameCompleted && score >100){
        window.clearInterval(interval);
        window.alert("loser!");
        CreepyMusic.pause();
        displaySettings();
        GameCompleted = true;
    }
    else if(lives===0 && score<100 && !GameCompleted){
        window.clearInterval(interval);
        window.alert("You are better than " + score + " points!!");
        CreepyMusic.pause();
        displaySettings();
        GameCompleted = true;
    }
    else if(lives===0 && score<100 && !GameCompleted){
        window.clearInterval(interval);
        window.alert("Winner!!");
        CreepyMusic.pause();
        displaySettings();
        GameCompleted = true;
    }
    else{
        pacmanRemain=1;
        for (var i = 0; i < lines; i++) {
            for (var j = 0; j < columns; j++) {
                if(board[i][j] === 2){
                    board[i][j] = 0;
                }
                MonstersRHere[i][j] = 0;
                if(NumOfmonsters > 0 && ((i === 0 || i === 14) && (j === 0 || j === 14))){
                    if(NumOfmonsters % 2 === 0){
                        board[i][j] = 7;
                        MonstersRHere[i][j] = 7;
                    }
                    else{
                        board[i][j] = 9;
                        MonstersRHere[i][j] = 9;
                    }
                    NumOfmonsters--;
                }
            }
        }
        if(pacmanRemain > 0 ){
            emptyCell = findRandomEmptyCell(board);
            shape.i = emptyCell[0];
            shape.j = emptyCell[1];
            board[shape.i][shape.j] = 2;
            pacmanRemain--;
        }
        clearIntervals();

        intervals.push(setInterval(UpdatePacmanPosition, 150));
        intervals.push(setInterval(UpdateMonsterPosition, 1200));
        interval = setInterval(UpdateClockPosition, 1000);
        interval = setInterval(Draw, 300);
    }

}

function displayLifeIcons() {
    for (let i = 1; i <= lives; i++) {
        imageName = "#image" + i;
        $(imageName).css("display", "block");
    }
}

function removeLifeIcon(i) {
    if(i > 0) {
        let imageName = "#image" + i;
        $(imageName).css("display", "none");
    }
}


function initGame() {
    clearIntervals();
    positionNavbarAndFooterCorrectlyDuringTheGame();
    $("#timeAlert").css("display", "none");
    calculateCellSize();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context = canvas.getContext("2d");
    foodRemain = parseInt($(document.getElementById("food")).val());
    NumOfmonsters = parseInt($(document.getElementById("monsters")).val());
    timeToPlay = parseInt($(document.getElementById("setTime")).val());
    pacmanRight = true;
    pacmanLeft = false;
    pacmanUp = false;
    pacmanDown = false;
    if(lives === 6){
        removeLifeIcon(6);
    }
    lives = 5;
    extra_life = 1;
    displayLifeIcons();
    clearIntervals();
    Start();
    Draw();
    CreepyMusic.play();
    GameCompleted = false;
    return false;
}
function positionNavbarAndFooterCorrectlyDuringTheGame(){
    $("#bottomFooter").hide();
    $("#menu").css("position", "fixed");
    $("#navnav").css("position", "fixed");
    $("#navnav").css("top", "0");
    $("#navnav").css("margin-bottom", "5%");

}

function alertNote(note,timeToAlert) {
    setTimeout(function () {
        alert(note);
    }, timeToAlert);
}

function gameOver() {
    for (var i = 0; i < lines; i++) {
        for(var j = 0; j < columns; j++){
            if(board[i][j] === 1 || board[i][j] === 6 || board[i][j] === 7){
                return false;
            }
        }
    }
    return true;
}

// dynamic weighted footer
/*
var watchFooter = function() {
    // define the height variable
    var footerHeight;
    // get the height of the footer and store it in 'footerHeight'
    footerHeight = $('#bottomFooter').outerHeight();
    // Share that info with the dependent elements
    $('.footer-buffer').css('height', footerHeight);
    $('.container.master').css('margin-bottom', -(footerHeight));
};

// run on window resize - and on load
$(window).resize( function() {
    watchFooter();
}).trigger('resize');
*/
