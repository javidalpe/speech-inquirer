Make your web conversable

# Introduction

Speech-inquirer.js lets you create conversational web apps. It wraps the 
[Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/9a0075d25326/speechapi.html) and exposes a interface based
 on the famous command line library [Inquirer](https://github.com/SBoudrias/Inquirer.js). 

## Support

This library requieres Speech Synthesis API and Speech Recognition API. Check [canisue](https://caniuse.com/#search=speech) to see the actual browser support for both.

# Instalation


```shell
npm install speech-inquirer --save
```

# Usage

```js
var speechInquirer = require('speech-inquirer');
speechInquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  });
```

> [Chrome Deprecation] speechSynthesis.speak() without user activation is deprecated and will be removed in M71, around December 2018. See https://www.chromestatus.com/features/5687444770914304 for more details.

### Docuemntation

#### Methods

##### `inquirer.prompt(questions) -> promise`

Start conversation (inquiry session)

- **questions** (Array) containing [Question Object](#question)
- returns a **Promise**


#### Objects

<a name="objects"></a>

##### Question

<a name="questions"></a>
A question object is a `hash` containing question related values:

- **type**: (String) Type of the prompt. Defaults: `input` - Possible values: `input`, `confirm`,
  `list`
- **name**: (String) The name to use when storing the answer in the answers hash. If the name contains periods, it will define a path in the answers hash.
- **message**: (String|Function) The question to print. If defined as a function, the first parameter will be the current inquirer session answers. Defaults to the value of `name` (followed by a colon).
- **default**: (String|Number|Boolean|Array|Function) Default value(s) to use if nothing is entered, or a function that returns the default value(s). If defined as a function, the first parameter will be the current inquirer session answers.
- **choices**: (Array|Function) Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers.
  Array values can be simple `strings`, or `objects` containing a `name` (to display in list), a `value` (to save in the answers hash) and a `short` (to display after selection) properties. The choices array can also contain [a `Separator`](#separator).
- **validate (TODO)**: (Function) Receive the user input and answers hash. Should return `true` if the value is valid, and an error message (`String`) otherwise. If `false` is returned, a default error message is provided.
- **filter (TODO)**: (Function) Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the _Answers_ hash.
- **transformer (TODO)**: (Function) Receive the user input, answers hash and option flags, and return a transformed value to display to the user. The transformation only impacts what is shown while editing. It does not modify the answers hash.
- **when (TODO)**: (Function, Boolean) Receive the current user answers hash and should return `true` or `false` depending on whether or not this question should be asked. The value can also be a simple boolean.


#### Answers

<a name="answers"></a>
A key/value hash containing the client answers in each prompt.

- **Key** The `name` property of the _question_ object
- **Value** (Depends on the prompt)
  - `confirm`: (Boolean)
  - `input` : User input (filtered if `filter` is defined) (String)
  - `list` : Selected choice value (or name if no value specified) (String)

### Example
```js
var speechInquirer = require('speech-inquirer');
speechInquirer
  .prompt([{
	type: "list",
	name: "color",
	message: "Choose a color",
	choice: [
		"red",
		"green"
	]	
  }])
  .then(answers => {
    alert(answers.color);
  });
```

# Plugins

# Contributing

**Documentation** Add documentation for every API change. Feel free to send typo fixes and better docs!

## Plugins

You can develop your own extensions for speech-inquirer.js. Just register a new question, a function that expects a 
question object and return and answer object.

```js
speechInquirer.registerQuestion("input", handleInput)
```

# License

MIT
