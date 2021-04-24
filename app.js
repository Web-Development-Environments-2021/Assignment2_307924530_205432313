var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var CellHeight;
var CellWidth;
var MonstersRHere;
var ExtraScoreMoves;
var color;
var pacmanRight = true;
var pacmanLeft = false;
var pacmanUp = false;
var pacmanDown = false;
var lives = 5;





$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});


function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var food_remain = 50;
	var pacman_remain = 1;
	var monster_remain = 4;
	var remaining_15_pt = 0.3 *food_remain;
	var remaining_5_pt= 0.6 * food_remain;
	var remaining_25_pt = food_remain - remaining_5_pt - remaining_15_pt;


	MonstersRHere = new Array();
	for (var i = 0; i < 15; i++) {
		MonstersRHere[i] = new Array();
		for (var j= 0 ; j<15 ; j++){
			MonstersRHere[i][j] =0;
		}
	}

	start_time = new Date();
	for (var i = 0; i < 15; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 15; j++) {
			if (
				(i==1 && j==1) || (i==1 && j==2) ||
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2) ||
				(i == 7 && j == 2) ||
				(i == 9 && j == 0) ||
				(i == 9 && j == 1) ||
				(i == 9 && j == 2) ||
				(i == 9 && j == 4) ||
				(i == 8 && j == 4) ||
				(i == 7 && j == 4) ||
				(i==10 && j==5) || (i==10 && j==6) || (i==10 && j==7) ||
				(i==9 && j==13) || (i==8 && j==13)
			) {
				board[i][j] = 4;
			}else if(monster_remain>0 && ((j==0 && (i==0 || i==14))  || (j==14 && (i==0 || i==14)))){
				monster_remain--;
				board[i][j] = 7;
				MonstersRHere[i][j] = 7;
			}
			else {
				board[i][j] = 0;
			}

		}


	}
	if(pacman_remain > 0 ){
		var emptyCell = findRandomEmptyCell(board);
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		board[shape.i][shape.j] = 2;
		pacman_remain--;
	}
	while (remaining_5_pt > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 5;
		remaining_5_pt--;
		food_remain--;
	}
	while (remaining_15_pt > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 6;
		remaining_15_pt--;
		food_remain--;
	}
	while (remaining_25_pt > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 3;
		remaining_25_pt--;
		food_remain--;
	}
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
	interval = setInterval(UpdatePosition, 250);
	interval = setInterval(UpdateMonsterPosition, 500);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 15);
	var j = Math.floor(Math.random() * 15);

	while (board[i][j] !== 0) {
		i = Math.floor(Math.random() * 15);
		j = Math.floor(Math.random() * 15);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function calculateCellSize(){
	CellHeight = canvas.height/15;
	CellWidth = canvas.width/15;
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	calculateCellSize();
	var monster = new Image();
	monster.src = "pictures/whiteMonster.jpg";
	var greenMonster = new Image();
	greenMonster.src = "pictures/greenMonster.jpg";
	var wallPic = new Image();
	wallPic.src = "pictures/pumpkinWall.jpg";
	color = getRandomColor();
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			var center = new Object();
			center.x = i * CellWidth + CellWidth/2;
			center.y = j * CellHeight + CellHeight/2;
			if (board[i][j] === 5 && MonstersRHere[i][j] == 0) {
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue"; //color
				context.fill();
				context.fillStyle = "white"; //color
				context.font = "bold 10px Arial";
				context.fillText("5", center.x - 3, center.y + 4);
				/*15 point ball*/
			}else if (board[i][j] === 2 && pacmanUp && lives>0) {
				context.beginPath();
				context.arc(center.x, center.y, 20, 1.7 * Math.PI, 1.35 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 10, center.y + 5, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] === 2 && pacmanRight && lives>0) {
				context.beginPath();
				context.arc(center.x, center.y, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] === 2 && pacmanDown && lives>0) {
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
			}else if (board[i][j] === 2 && pacmanLeft && lives>0) {
				context.beginPath();
				context.arc(center.x, center.y, 20, -0.85 * Math.PI, 0.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if (board[i][j] === 4) {
				context.beginPath();
				context.strokeStyle = "#3c3cef";
				context.drawImage(wallPic,center.x - CellWidth/2, center.y - CellHeight/2,CellWidth,CellHeight);
			}

			else if (MonstersRHere[i][j] === 7) {
				context.drawImage(monster, center.x - CellWidth/2, center.y - CellHeight/2);
			}
			if (MonstersRHere[i][j] === 8) {
				context.drawImage(greenMonster, center.x - CellHeight/2, center.y - CellHeight/2);
			}

			else if (board[i][j] === 3 && MonstersRHere[i][j] == 0) {
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = "#ef4b3c"; //color
				context.fill();
				context.fillStyle = "white"; //color
				context.font = "bold 10px Arial";
				context.fillText("15", center.x - 6, center.y + 4);
			}if (board[i][j] === 6 && MonstersRHere[i][j] == 0) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color; //color
				context.fill();
				context.fillStyle = "black"; //color
				context.font = "bold 10px Arial";
				context.fillText("25", center.x - 5, center.y + 3);
			}
		}
	}
}
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	if(color === '#000000'){
		getRandomColor();
	}
	return color;
}
function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			pacmanDown, pacmanLeft, pacmanRight = false, false, false;
			pacmanUp =true;
		}
	}
	if (x == 2) {
		if (shape.j < 14 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			pacmanUp, pacmanLeft, pacmanRight = false, false, false;
			pacmanDown =true;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			pacmanDown, pacmanUp, pacmanRight = false, false, false;
			pacmanLeft =true;
		}
	}
	if (x == 4) {
		if (shape.i < 14 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			pacmanDown, pacmanUp, pacmanLeft = false, false, false;
			pacmanRight = true;
		}
	}
	x=-1;
	if(board[shape.i][shape.j]){
		if(board[shape.i][shape.j] ==5 ){
			score = score+5;
		}
		if (board[shape.i][shape.j] == 6){
			score = score+15;
		}
		if(board[shape.i][shape.j] ==3){
			score = score+25;
		}

		if (board[shape.i][shape.j]==7){
			lives--;
			if(lives==0){
				window.clearInterval(interval);
				window.alert("Game completed");

			}
		}
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function UpdateMonsterPosition(){
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (MonstersRHere[i][j] === 7) {
				var randomNum = Math.floor(Math.random() * 2);/*0,1*/
				var notMove = true;
				//monster get down
				if (randomNum === 0 && Math.abs(((i + 1) - shape.i) < Math.abs((i - 1) - shape.i)) && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7) {
					MonstersRHere[i][j] = 0;
					/*board[i][j] = 0;*/
					MonstersRHere[i + 1][j] = 7;
					/*board[i + 1][j] = 7;*/
					notMove = false;
				}
				//monster get up
				else if (randomNum === 0 && Math.abs(((i + 1) - shape.i) > Math.abs((i - 1) - shape.i)) && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7) {
					MonstersRHere[i][j] = 0;
					/*board[i][j] = 0;*/
					MonstersRHere[i - 1][j] = 7;
					/*board[i-1][j] = 7;*/
					notMove = false;
				}
				//monster get right
				else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) < Math.abs((j - 1) - shape.j)) && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7) {
					MonstersRHere[i][j] = 0;
					/*board[i][j] = 0;*/
					MonstersRHere[i][j + 1] = 7;
					/*board[i][j+1] = 7;*/
					notMove = false;
				}
				//monster get left
				else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) > Math.abs((j - 1) - shape.j)) && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !==7) {
					MonstersRHere[i][j] = 0;
					/*board[i][j] = 0;*/
					MonstersRHere[i][j - 1] = 7;
					/*board[i][j-1] = 7;*/
					notMove = false;
				} else if (notMove || shape.i == i || shape.j == j) {
					while (notMove) {
						var randomMoveIfStack = Math.floor(Math.random() * 4);/*0,1*/
						if (randomMoveIfStack === 0 && i-1 >= 0 && i-1 <= 14 && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7) {
							MonstersRHere[i][j] = 0;
							/*board[i][j] = 0;*/
							MonstersRHere[i - 1][j] = 7;
							/*board[i-1][j] = 7;*/
							notMove = false;
						} else if (randomMoveIfStack === 1  && i+1 >= 0 && i+1 <= 14 && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7) {
							MonstersRHere[i][j] = 0;
							/*board[i][j] = 0;*/
							MonstersRHere[i + 1][j] = 7;
							/*board[i+1][j] = 7;*/
							notMove = false;
						}
						//get right
						else if (randomMoveIfStack === 2  && j+1 >= 0 && j+1 <= 14 && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7) {
							MonstersRHere[i][j] = 0;
							/*board[i][j] = 0;*/
							MonstersRHere[i][j + 1] = 7;
							/*board[i][j+1] = 7;*/
							notMove = false;
						}
						//get left
						else if (randomMoveIfStack === 3 && j >0 && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !== 7) {
							MonstersRHere[i][j] = 0;
							/*board[i][j] = 0;*/
							MonstersRHere[i][j - 1] = 7;
							/*board[i][j-1] = 7;*/
							notMove = false;
						}
					}
				}
			}
		}
	}
}

