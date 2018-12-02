module.exports = {
	input: 'src/index.js',
	output: [{
		file: 'dist/speech-inquirer.js',
		format: 'cjs'
	},
	{
		file: 'dist/speech-inquirer.min.js',
		format: 'iife',
		name: "speechInquirer"
	},
	]
};