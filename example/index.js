document.addEventListener("click", () =>
	speech
		.prompt([{
			type: "list",
			name: "color",
			message: "¿Cual es tu color favorito?",
			choice: [
				"rojo",
				"azul",
				"verde"
			]
		},
			{
				type: "list",
				name: "ciudad",
				message: "¿En qué ciudad vives?",
				choice: [
					"Madrid",
					"Barcelona",
					"Oviedo"
				]
			}
		])
		.then(answers => {
			console.log(answers);
		}));