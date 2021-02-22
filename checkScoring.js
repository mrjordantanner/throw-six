//#region [Purple]
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
	
    // PATTERN RECOGNITION and ASSIGNING GROUPS

    // THREE OR MORE OF A KIND
	// Iterate through Sorted object's properties (the arrays sorted by dice face value)
    // 'Sorted' is an object with this format-- { ones: [], twos: [], etc }
	Object.entries(sorted).forEach((entry) => {
		// Iterate through the sorted arrays
		if (entry[1].length >= 3) {

            // Make an empty scoring group to assign values to to describe this group of dice

            // TODO: Make a function out of this called assignScoringGroup
            const thisGroup = new ScoringGroup(0, '', []);
            scoringGroupsInPlay.push(thisGroup);    //'register' this group
            //console.log(`Registered scoring group ${thisGroup}`);

			entry[1].forEach((die) => {

				die.scoring = true;
				die.div.classList.add('scoring-group');

                // Assign values to the scoring group
                thisGroup.members.push(die);
                const typeText = `${entry[1].length} ${entry[0]}`;
                thisGroup.type = typeText;
                thisGroup.value = ofAKindValue(entry[1]);
                // give each die a reference to the group it's in
                die.group = thisGroup;
			});
            //console.log(`Rolled ${entry[1].length} ${entry[0]}!`);
		}
	});

    // STRAIGHTS
    // TODO: DRY THIS UP, consolidate into one function
    const one = getDieByFaceValue(1);
    const two = getDieByFaceValue(2);
    const three = getDieByFaceValue(3);
    const four = getDieByFaceValue(4);
    const five = getDieByFaceValue(5);
    const six = getDieByFaceValue(6);

    if (two && three && four && five) {
        if (one && six) {
        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);  
        //console.log(`Registered scoring group ${thisGroup}`);
            const array = [one, two, three, four, five, six];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');
							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Full Straight';
							thisGroup.value = 1500;
							// give each die a reference to the group it's in
							die.group = thisGroup;
						});
                        text.write(`Got ${thisGroup.type}`,'white-bold');

        } else if (one) {
        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);   
        //console.log(`Registered scoring group ${thisGroup}`);
            const array = [one, two, three, four, five];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight 1-5';
							thisGroup.value = 500;
							die.group = thisGroup;
						});
                        text.write(`Got ${thisGroup.type}`, 'white-bold');
        } else if (six) {
        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);   
        //console.log(`Registered scoring group ${thisGroup}`);
            const array = [two, three, four, five, six];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight 2-6';
							thisGroup.value = 750;
							die.group = thisGroup;
						});
                        text.write(`Got ${thisGroup.type}`, 'white-bold');
        }
    }

    // SINGLE DICE
	// Check for single 1's
	if (sorted.ones.length > 0 && sorted.ones.length < 3) {
		sorted.ones.forEach((die) => {
			if (die.group.type === 'None') {
                const thisGroup = new ScoringGroup(0, '', []);
				thisGroup.value = 100;
				thisGroup.type = 'Single 1';
				thisGroup.members.push(die);
                scoringGroupsInPlay.push(thisGroup);    
                //console.log(`Registered scoring group ${thisGroup.type}`);
				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring-solo');
                text.write(`Got ${thisGroup.type}`, 'white-bold');
			}
		});

	}
	// Check for single 5's
	if (sorted.fives.length > 0 && sorted.fives.length < 3) {

		sorted.fives.forEach((die) => {
			if (die.group.type === 'None') {
                const thisGroup = new ScoringGroup(0, '', []);
				thisGroup.value = 50;
				thisGroup.type = 'Single 5';
				thisGroup.members.push(die);
                scoringGroupsInPlay.push(thisGroup);   
                //console.log(`Registered scoring group ${thisGroup.type}`);
				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring-solo');
                text.write(`Got ${thisGroup.type}`, 'white-bold');
			}
		});
  	}

	updateDiceUI();

	// If no scoring dice were produced during the roll, end turn and gain 0 points 
	if (!anyScoring(diceInPlay)) {
		// bust();
        text.write('BUSTED! No scoring dice rolled!', 'red-bold');
        //messageText.innerText='BUSTED! No scoring dice rolled! 0 pts earned.';
        //enable(messageText);
        roundTotal = 0;
        playArea.style.background = 'red';
        busted = true;
        //return endTurn();
	}
}
//#endregion