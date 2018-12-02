window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const speech = {
	prompt: (questions) =>
		new Promise((resolve, reject) => {
			handleQuestion(questions[0]).then(answer => {
				if (questions.length > 1) {
					speech.prompt(questions.slice(1)).then(answers => resolve([answer].concat(answers)));
				} else {
					resolve([answer]);
				}
			});
		})
}

const handleQuestion = (question) => new Promise((resolve, reject) => {
	console.log(question);
	const menu = question.choice.map((o, i) => `${i + 1}, ${o}. `).join('\n');
	speak(`${question.message}:\n${menu}`).then(() =>
		listen().then(command => {
			if (question.choice.includes(command)) {
				resolve(command)
			} else {
				speak("Lo siento, no te he entendido.")
					.then(() => {
						console.log("Otro prompt");
						handleQuestion(question).then(command => resolve(command))
					});
			}
		})
	)
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
})

const speak = (text) => new Promise((resolve, reject) => {
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = text;
	utterance.onend = () => {
		console.log("Habla: " + text);
		resolve();
	};
	window.speechSynthesis.speak(utterance);
})