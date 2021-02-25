// Analyzes rolled dice for patterns and groups them
function checkScoring() {

	// Make an object of arrays to hold our dice sorted by their rolled values
	const sorted = {
		ones: [],
		twos: [],
		threes: [],
		fours: [],
		fives: [],
		sixes: [],
	};

    // take inventory of how many of each number there are
	diceInPlay.forEach((die) => {
		switch (die.faceValue) {
			case 1:
				sorted.ones.push(die);
				break;

			case 2:
				sorted.twos.push(die);
				break;

			case 3:
				sorted.threes.push(die);
				break;
			case 4:
				sorted.fours.push(die);
				break;

			case 5:
				sorted.fives.push(die);
				break;

			case 6:
				sorted.sixes.push(die);
				break;
		}
	});

	// creates a new scoring group, assigns dice to it, and gives the group some values
	function groupDice(array, styleClass, type, value) {
		// make new scoring group to assign these dice to
		const thisGroup = new ScoringGroup(0, '', []);
		// 'register' this group to keep track of it
		scoringGroupsInPlay.push(thisGroup);

        // Groups
		array.forEach((die) => {
			// mark each die as 'scoring' and add styling
			die.scoring = true;
			die.div.classList.add('scoring');
			die.div.classList.add(styleClass);
			// Assign values to the scoring group
			thisGroup.members.push(die);
			thisGroup.type = type;
			thisGroup.value = value;
			// give each die a reference to the group it's in
			die.group = thisGroup;
		});

		text.write(`Rolled ${thisGroup.type}`, 'white-bold');
	}

	// Singles
	function groupSingle(array, type, value) {
		array.forEach((die) => {
			if (die.group.type === 'None') {
				const thisGroup = new ScoringGroup(0, '', []);
				thisGroup.value = value;
				thisGroup.type = type;
				thisGroup.members.push(die);
				scoringGroupsInPlay.push(thisGroup);
				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring');
				die.div.classList.add('scoring-solo');
				text.write(`Rolled ${thisGroup.type}`, 'white-bold');
			}
		});
	}

	// Calculate 'of-a-kind' values
	function ofAKindValue(dice) {
		switch (dice.length) {
			case 3:
				if (dice.some((die) => die.faceValue === 1)) {
					return 1000;
				} else return dice[0].faceValue * 100 * 1;
				break;

			case 4:
				if (dice.some((die) => die.faceValue === 1)) {
					return 2000;
				} else return dice[0].faceValue * 100 * 2;
				break;

			case 5:
				if (dice.some((die) => die.faceValue === 1)) {
					return 4000;
				} else return dice[0].faceValue * 100 * 4;
				break;

			case 6:
				if (dice.some((die) => die.faceValue === 1)) {
					return 8000;
				}
				return dice[0].faceValue * 100 * 4;
				break;
		}
	}

	// Pattern recognition and group assignment
	// THREE OR MORE OF A KIND
	Object.entries(sorted).forEach((entry) => {
		if (entry[1].length >= 3) {
			const typeText = `${entry[1].length} ${entry[0]}`;
			const value = ofAKindValue(entry[1]);
			groupDice(entry[1], 'scoring-group', typeText, value);
		}
	});

	// STRAIGHTS
	const one = getDieByFaceValue(1);
	const two = getDieByFaceValue(2);
	const three = getDieByFaceValue(3);
	const four = getDieByFaceValue(4);
	const five = getDieByFaceValue(5);
	const six = getDieByFaceValue(6);

	if (two && three && four && five) {
		if (one && six) {
			const array = [one, two, three, four, five, six];
			groupDice(array, 'scoring-straight', 'Full Straight', 1500);
		} else if (one) {
			const array = [one, two, three, four, five];
			groupDice(array, 'scoring-straight', 'Partial Straight 1-5', 500);
		} else if (six) {
			const array = [two, three, four, five, six];
			groupDice(array, 'scoring-straight', 'Partial Straight 2-6', 750);
		}
	}

	// SINGLE DICE
	// Check for single 1's
	if (sorted.ones.length > 0 && sorted.ones.length < 3) {
		groupSingle(sorted.ones, 'Single 1', 100);
	}
	// Check for single 5's
	if (sorted.fives.length > 0 && sorted.fives.length < 3) {
		groupSingle(sorted.fives, 'Single 5', 50);
	}

    // Either enter bust state if no scoring dice rolled, or select scoring dice
	if (anyScoring(diceInPlay)) {
		busted = false;
		if (!playersTurn) {
			setTimeout(moveScoringGroups, 1200);
		}
	} else {
		setTimeout(handleBust, 800);
	}

    // Handle 'Bust' and 'End Turn' states for player and cpu
	function handleBust() {
		busted = true;
		roundTotal = 0;
		document.body.style.background = bustedColor;
		disable(buttonStand);
		snd_bloop1.play();

		if (playersTurn) {
			enable(buttonRoll);
			buttonRoll.innerText = 'END TURN';
			enable(messageText);
			messageText.innerText = 'Busted!  No scoring dice rolled.';
			text.write('Busted! No scoring dice rolled.', 'red-bold');
			messageText.style.color = 'white';
			buttonRoll.style.color = 'black';
			buttonRoll.style.border = '4px solid black';
		} else {
			setTimeout(endTurn, 1000);
            text.write('CPU Busted! No scoring dice rolled.', 'red-bold');
		}
	}
}
