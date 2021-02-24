//#region [Purple]
function checkScoring() {
	console.log('4 - checkScoring');
	// Make an object of arrays to hold our dice sorted by their rolled values
	const sorted = {
		ones: [],
		twos: [],
		threes: [],
		fours: [],
		fives: [],
		sixes: [],
	};

	diceInPlay.forEach((die) => {
		// take inventory of how many of each number there are
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
	
    // Functions
    // creates a new scoring group, assigns dice to it, and gives the group some values
    function groupDice(array, styleClass, type, value) {
        // make new scoring group to assign these dice to
        const thisGroup = new ScoringGroup(0, '', []);
        // 'register' this group to keep track of it
        scoringGroupsInPlay.push(thisGroup);

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

    // treat singles slightly different to make sure they're really alone
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

    // Conditionals
    // PATTERN RECOGNITION and ASSIGNING GROUPS

    // THREE OR MORE OF A KIND
	// Iterate through Sorted object's properties (the arrays sorted by dice face value)
    // 'Sorted' is an object with this format-- { ones: [], twos: [], etc }
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
				groupDice(array, 'scoring-straight', 'Partial Straight 2-6', 500);
			} else if (six) {
				const array = [two, three, four, five, six];
				groupDice(array, 'scoring-straight', 'Partial Straight 1-5', 750);
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

	updateUI();

    // Bust Check
	// If no scoring dice were produced during the roll, end turn and gain 0 points 
	if (!anyScoring(diceInPlay)) {
		// bust();
        text.write('BUSTED! No scoring dice rolled!', 'red-bold');
        //messageText.innerText='BUSTED! No scoring dice rolled! 0 pts earned.';
        //enable(messageText);
        roundTotal = 0;
        playArea.style.background = 'red';
        busted = true;
        buttonEnd.innerText = 'End Turn';
        //return endTurn();
	}
}
//#endregion


// CALCULATE "OF-A-KIND" VALUES
//#region [Black]
function ofAKindValue(dice) {
    // TODO: DRY this up! consolidate conditionals, text.write generic formula to arrive at end value
    
        // Check for multiple 1's first bc they have higher point values
        // Check for other 'of-a-kind's
        switch (dice.length) {
            case 3:
                if (dice.some((die) => die.faceValue === 1)) {
                    return 1000;
                }
                // return [`Three ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 1];
                else return dice[0].faceValue * 100 * 1;
                break;
    
            case 4:
                if (dice.some((die) => die.faceValue === 1)) {
                    return 2000;
                }
                // return [`Four ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 2];
                else return dice[0].faceValue * 100 * 2;
                break;
    
            case 5:
                if (dice.some((die) => die.faceValue === 1)) {
                    return 4000;
                }
                // return [`Five ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
                else return dice[0].faceValue * 100 * 4;
                break;
    
            case 6:
                if (dice.some((die) => die.faceValue === 1)) {
                    return 8000;
                }
                // return [`Six ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
                return dice[0].faceValue * 100 * 4;
                break;
        }
    }
    //#endregion