// TEXT.JS handles text styling and output to the 'console'

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

		switch (style) {
			default:
				newLine.classList.add('gray');
				break;
			case 'red':
				newLine.classList.add('red');
				break;
			case 'white':
				newLine.classList.add('white');
				break;
			case 'cyan':
				newLine.classList.add('cyan');
				newLine.classList.add('bold');
				break;
			case 'bg-red':
				newLine.classList.add('bg-red');
				break;

			case 'chartreuse':
				newLine.classList.add('green');
				break;

			case 'bg-green':
				newLine.classList.add('bg-green');
				newLine.classList.add('black');
				break;

			case 'red-bold':
				newLine.classList.add('red');
				newLine.classList.add('bold');
				break;

			case 'white-bold':
				newLine.classList.add('white');
				newLine.classList.add('bold');
				break;
		}

		consoleContainer.scrollTop = consoleContainer.scrollHeight;
	}
}
