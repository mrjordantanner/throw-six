// CLASSES
//#region [Blue]
// Creates Die objects for use in play
class Die {

    constructor(value, div, held, scoring) {
			this.value = value;         // the rolled value of the die
			this.div = div;             // reference to visual element in window
            this.held = held;           // bool, is die in the held area?
            this.scoring = scoring;     // bool, is die currently worth any points?

            this.div = document.createElement('div');
            this.div.classList.add('die');
            // playArea.appendChild(this.div);
            const val = Math.floor(Math.random() * 6 + 1);
            this.value = val;
            this.div.innerText = val;

            console.log(this);
		}
}

// Controls game flow and functions
class Game {

    constructor() {};

    // ROUND FLOW

    // user throws X = 6 dice
    // values of dice are displayed on screen, scoring dice highlighted matching colors or borders

    // if at least one scoring die rolled,

    // user can:
        // click Y scoring dice (or scoring group) to move them to held area
            // end turn, gaining Z+=value points
            // roll again with X-Y remaining dice
    
    // if no scoring dice rolled, end of turn with 0 points earned

    // if END TURN, end of turn with Z points earned

        throw(num) {
            // Create num dice in play area

            for (let i = 1; i <= num; i++) {
                const newDie = new Die();
                dice.push(newDie);
                playArea.appendChild(newDie.div);
            }
        }

        // Removes die from array as well as play/held area
        removeDie() {




        }


}
//#endregion




// INITIALIZATION
//#region [Blue]

const game = new Game();
const dice = [];
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');


// Event listeners
playArea.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.classList.contains('die')) {
        moveDie(e.target);
    }
})

heldArea.addEventListener('click', (e) => {
	e.preventDefault();

	if (e.target.classList.contains('die')) {
		moveDie(e.target);
	}
});

buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();

	const diceInPlay = playArea.querySelectorAll('.die');
    const numberOfDice = diceInPlay.length;

    diceInPlay.forEach((die) => {
        die.remove();
    })


	game.throw(numberOfDice);
});

//#endregion

// const myDie = new Die();
// playArea.appendChild(myDie.div);

// const myDie2 = new Die();
// playArea.appendChild(myDie2.div);

game.throw(6);

// console.log('Dice in play:')
// console.log(diceInPlay);


function moveDie(die) {

    const inPlay = checkParent(playArea, die);

        if (inPlay) {
            heldArea.appendChild(die);
            die.held = true;
        }
        // else
        // {
        //     playArea.appendChild(die);
        //     die.held = false;
        // }

}


function checkParent(parent, child) {
	if (parent.contains(child)) return true;
	return false;
} 