'use strict';

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

class SpeechEnquirer {
	constructor() {
		this.questions = {};
	}

	prompt(questions) {
		return new Promise((resolve, reject) => {
			const firstQuestion = questions[0];
			if (!firstQuestion.hasOwnProperty('type'))
				throw Error("The question type is required");
			if (!this.questions.hasOwnProperty(firstQuestion.type))
				throw Error("Question type not recognized");

			const handler = this.questions[firstQuestion.type];
			handler(firstQuestion).then(answer => {
				const answerHash = {[questions[0].name]: answer};
				if (questions.length > 1) {
					speech.prompt(questions.slice(1)).then(answers => resolve({...answerHash, ...answers}));
				} else {
					resolve(answerHash);
				}
			});
		});
	}

	registerQuestion(type, handler) {
		this.questions[type] = handler;
	}
}


const handleListQuestion = (question) => new Promise((resolve, reject) => {
	console.log(question);
	const menu = question.choice.map((o, i) => `${i + 1}, ${o}. `).join('\n');
	speak(`${question.message}:\n${menu}`).then(() =>
		listen().then(command => {
			if (question.choice.includes(command)) {
				resolve(command);
			} else {
				speak("Lo siento, no te he entendido.")
					.then(() => {
						console.log("Otro prompt");
						handleListQuestion(question).then(command => resolve(command));
					});
			}
		})
	);
});

const handleConfirmQuestion = (question) => new Promise((resolve, reject) => {
	console.log(question);
	const menu = `${question.message}. Diga: aceptar o cancelar.`;
	speak(menu).then(() =>
		listen().then(command => {
			if (['aceptar', 'cancelar'].includes(command)) {
				resolve(command);
			} else {
				speak("Lo siento, no te he entendido.")
					.then(() => {
						console.log("Otro prompt");
						handleConfirmQuestion(question).then(command => resolve(command));
					});
			}
		})
	);
});

const handleInput = (question) => new Promise((resolve, reject) => {
	speak(question.message).then(() =>
		listen().then(command => {
			if (command.length) {
				resolve(command);
			} else {
				speak("Lo siento, no te he entendido.")
					.then(() => {
						console.log("Otro prompt");
						handleInput(question).then(command => resolve(command));
					});
			}
		})
	);
});


const listen = () => new Promise((resolve, reject) => {
	const recognition = new window.SpeechRecognition();

	//recognition.continuous = false;
	recognition.lang = 'es-ES';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;
	recognition.onresult = (event) => {
		const command = event.results[0][0].transcript;
		console.log("Escucha: " + command);
		resolve(command);
	};
	recognition.onnomatch = () => {
		console.log("No ecucha:");
		resolve("");
	};
	recognition.onerror = () => {
		console.log("Error:");
		resolve("");
	};
	recognition.start();
});

const speak = (text) => new Promise((resolve, reject) => {
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = text;
	utterance.onend = () => {
		console.log("Habla: " + text);
		resolve();
	};
	window.speechSynthesis.speak(utterance);
});

const speech = new SpeechEnquirer();
speech.registerQuestion("list", handleListQuestion);
speech.registerQuestion("confirm", handleConfirmQuestion);
speech.registerQuestion("input", handleInput);

module.exports = speech;
