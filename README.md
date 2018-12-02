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

# Plugins

# Contributing

## Plugins

You can develop your own extensions for speech-inquirer.js. Just register a new question, a function that expects a 
question object and return and answer object.

# License

MIT