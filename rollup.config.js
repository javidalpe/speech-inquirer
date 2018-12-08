/*module.exports = {
	input: 'src/index.js',
	output: [{
		file: 'dist/speech-inquirer.js',
		format: 'cjs'
	},
	{
		file: 'dist/speech-inquirer.min.js',
		format: 'iife',
		name: "speechInquirer"
	}]
};*/

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: [{
		file: 'dist/speech-inquirer.js',
		format: 'cjs'
	},
	{
		file: 'dist/speech-inquirer.min.js',
		format: 'iife',
		name: "speechInquirer"
	}],
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**' // only transpile our source code
		})
	]
};
