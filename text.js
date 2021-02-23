//#region [Purple]
// Handles text styling and output
class Text {

	constructor() {}

	clear() {
		let allConsoleLines = document.querySelectorAll('.console-line');
		let numberOfLines = allConsoleLines.length;
		if (numberOfLines > 0) {
			for (let i = 0; i < numberOfLines; i++) {
				allConsoleLines[i].remove();
			}
		}

		allConsoleLines = [];
		allConsoleLines.length = 0;
	}

	write(msg, style) {
		const newText = document.createTextNode(msg);
		const newLine = document.createElement('p');

		newLine.appendChild(newText);
		consoleContainer.appendChild(newLine);
		consoleLines.push(newLine);
		newLine.classList.add('console-line');
		newLine.innerText = msg;
		let css;

		switch (style) {
			default:
				css = 'color: gray;';
				newLine.classList.add('gray');
				break;
			case 'red':
				css = 'color: red; font-weight: bold;';
				newLine.classList.add('red');
				break;
			case 'white':
				css = 'color: white;';
				newLine.classList.add('white');
				break;
			case 'cyan':
				css = 'color: cyan; font-weight: bold;';
				newLine.classList.add('cyan');
				newLine.classList.add('bold');
				break;
			case 'bg-red':
				css = 'background: red; color: white;';
				newLine.classList.add('bg-red');
				break;

			case 'chartreuse':
				css = 'color: chartreuse;';
				newLine.classList.add('green');
				break;

			case 'bg-green':
				css = 'background: chartreuse; color: black;';
				newLine.classList.add('bg-green');
				newLine.classList.add('black');
				break;

			case 'red-bold':
				css = 'color: red; font-weight:bold';
				newLine.classList.add('red');
				newLine.classList.add('bold');
				break;

			case 'white-bold':
				css = 'color: white; font-weight:bold';
				newLine.classList.add('white');
				newLine.classList.add('bold');
				break;
		}

		if (printToConsole) {
			console.log('%c ' + msg, css);
		}

		consoleContainer.scrollTop = consoleContainer.scrollHeight;
	}
}
//#endregion