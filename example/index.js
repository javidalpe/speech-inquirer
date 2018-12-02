document.addEventListener("click", () =>
	speechInquirer
		.prompt([

			{
				type: "input",
				name: "name",
				message: "¿Cual es tu nombre?"
			},
			{
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
				type: "confirm",
				name: "confirm",
				message: "¿Guardar cambios?"
			}
		])
		.then(answers => {
			console.log(answers);
		}));