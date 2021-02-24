//#region [Violet]
// class Game {
// 	constructor() {}

// Create and 'throw' num dice
function throwDice(num) {
	dice.length = 0;
	let rolledMessage = `Rolled `;
	// Create num dice in play area
	text.write(`Throwing ${num} dice`, 'blue');
	for (let i = 0; i < num; i++) {
		const newDie = new Die();

        // it it's the cpu's turn, add a class to each die that prevents mouse pointer events
        if (!playersTurn) {
            newDie.div.classList.add('no-click');
        }

		// Manually set the dice value for testing
		if (useRiggedDice) {
			newDie.faceValue = riggedDice[i];
		}

		rolledMessage += newDie.faceValue.toString() + ' ';

		dice.push(newDie);
		diceInPlay.push(newDie);
		playArea.appendChild(newDie.div);
	}

	text.write(rolledMessage, 'cyan');
}

function startPlayerTurn() {
    busted = false;
	playersTurn = true;
	text.write("== Start of Player's turn", 'bg-green');
}

function startCPUTurn() {
    busted = false;
    playersTurn = false;
	text.write("== Start of CPU's turn", 'bg-red');
	disable(buttonRoll);
	disable(buttonStand);
	setTimeout(cpuTurn, gameSpeed);
	console.log('1 - startCpuTurn');
}

// Control cpu's turn
function cpuTurn() {

	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
        throwDice(6);
	} else {
        throwDice(remainingDice);
	}

    checkScoring();
    if (busted) {
        roundTotal = 0;
        setTimeout(endTurn, gameSpeed);
        return;
    }
	updateUI();

    setTimeout(moveScoringGroups, gameSpeed);

}

// Called on player turns from the roll button
// TODO move this to event listener?
function handleDiceThrow() {

	disable(buttonRoll);
    disable(buttonStand);

	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
		throwDice(6);
	} else {
		throwDice(remainingDice);
	}

	checkScoring();
	updateUI();

    if (busted) {
        enable(buttonEnd);
    }
}

// Called on cpu turn
// Method for the cpu to move all scoring dice over to the held area
function moveScoringGroups() {
	console.log(`MovingScoringGroups: ${scoringGroupsInPlay.length}`);
	scoringGroupsInPlay.forEach((scoringGroup) => {
		if (scoringGroup.type === 'Single') {
			console.log('CPU picks a single');
			roundTotal += scoringGroup.value;
			moveDie(scoringGroup.members[0].div);
		} else {
			scoringGroup.members.forEach((die) => {
				moveDie(die.div);
			});
			roundTotal += scoringGroup.value;
			console.log(`CPU picks a group: ${scoringGroup.type}`);
		}
	});

	// "Decide" for the CPU when to stop rolling the dice and end the turn
	// Chooses from a pool of three possibilities with three weighted values 
	const rollThreshold = randomWeighted(1, 2, 3, 15, 85);
	console.log(`rollThreshold: ${rollThreshold}`)

    if (diceInPlay.length > rollThreshold) {
        setTimeout(cpuTurn, gameSpeed);

	} else {
        setTimeout(endTurn, gameSpeed);
	}
}

function endTurn() {
	resetBoard();
	disable(messageText);

	if (playersTurn) {
		labelNameCpu.classList.add('turn-indicator');
		labelNamePlayer.classList.remove('turn-indicator');
		document.body.style.background = cpuTurnColor;
		playerScore += roundTotal;
		text.write('Player ended their turn.', 'chartreuse');
		text.write(`Earned ${roundTotal} points.`, 'chartreuse');
		disable(buttonRoll);
		disable(buttonStand);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			//do gameover message, effects, etc
			setTimeout(initialize, 5000);
		}
		else {
			startCPUTurn();
		}
	} else {
		labelNameCpu.classList.remove('turn-indicator');
		labelNamePlayer.classList.add('turn-indicator');
		document.body.style.background = playerTurnColor;
		//heldArea.style.background = 'black';
		cpuScore += roundTotal;
		text.write(`CPU ended their turn.`, 'red');
		text.write(`Earned ${roundTotal} points.`, 'red');
		enable(buttonRoll);
		// disable(buttonStand);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			//do gameover message, effects, etc
			setTimeout(initialize, 5000);
		}
		else {
			startPlayerTurn();
		}
	}

	updateUI();
}

// If player 'busts' and doesn't roll any scoring die, enter this state
// function bust() {

// }

function checkForWin() {

	// Player wins
	if (playerScore >= scoreGoal) {
		disable(buttonRoll);
		text.write(`You have reached ${scoreGoal} points.`, 'green');
		text.write('YOU WIN!', 'bg-green');
		messageText.innerText = `You reached ${scoreGoal} points. YOU WIN!`;
		messageText.style.color = 'white';
		enable(messageText);
		gameOver = true;

	}
	// cpu wins
	else if (cpuScore >= scoreGoal) {
		disable(buttonRoll);
		text.write(`CPU has reached ${scoreGoal} points.`, 'red');
		text.write('YOU LOSE.', 'bg-red');
		messageText.innerText = `CPU reached ${scoreGoal} points. You Lose.`;
		messageText.style.color = 'red';
		enable(messageText);
		gameOver = true;
	}

}

// }
//#endregion



// HTML for dice faces
const html_dice1 = '<span class="dot"></span>';
const html_dice2 = '<span class="dot"></span>' + '<span class="dot"></span>';
const html_dice3 =
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>';
const html_dice4 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';
const html_dice5 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';
const html_dice6 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';




	// AUDIO
	// https://www.w3schools.com/graphics/game_sound.asp
	function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function(){
		  this.sound.play();
		}
		this.stop = function(){
		  this.sound.pause();
		}
	  }




	  snd_tic1 = new sound("tic-1.wav");
	  snd_tic2 = new sound("tic-2.wav");
	  snd_menuChange1 = new sound("menu-change-1.wav");
	  	  snd_menuChange2 = new sound("menu-change-2.wav");
	  snd_bloop1 = new sound("bloop-1.wav");