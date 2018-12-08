'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

var SpeechEnquirer =
/*#__PURE__*/
function () {
  function SpeechEnquirer() {
    _classCallCheck(this, SpeechEnquirer);

    this.questions = {};
  }

  _createClass(SpeechEnquirer, [{
    key: "prompt",
    value: function prompt(questions) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var firstQuestion = questions[0];
        if (!firstQuestion.hasOwnProperty('type')) throw Error("The question type is required");
        if (!_this.questions.hasOwnProperty(firstQuestion.type)) throw Error("Question type not recognized");
        var handler = _this.questions[firstQuestion.type];
        handler(firstQuestion).then(function (answer) {
          var answerHash = _defineProperty({}, questions[0].name, answer);

          if (questions.length > 1) {
            speech.prompt(questions.slice(1)).then(function (answers) {
              return resolve(_objectSpread({}, answerHash, answers));
            });
          } else {
            resolve(answerHash);
          }
        });
      });
    }
  }, {
    key: "registerQuestion",
    value: function registerQuestion(type, handler) {
      this.questions[type] = handler;
    }
  }]);

  return SpeechEnquirer;
}();

var handleListQuestion = function handleListQuestion(question) {
  return new Promise(function (resolve, reject) {
    console.log(question);
    var menu = question.choice.map(function (o, i) {
      return "".concat(i + 1, ", ").concat(o, ". ");
    }).join('\n');
    speak("".concat(question.message, ":\n").concat(menu)).then(function () {
      return listen().then(function (command) {
        if (question.choice.includes(command)) {
          resolve(command);
        } else {
          speak("Lo siento, no te he entendido.").then(function () {
            console.log("Otro prompt");
            handleListQuestion(question).then(function (command) {
              return resolve(command);
            });
          });
        }
      });
    });
  });
};

var handleConfirmQuestion = function handleConfirmQuestion(question) {
  return new Promise(function (resolve, reject) {
    console.log(question);
    var menu = "".concat(question.message, ". Diga: aceptar o cancelar.");
    speak(menu).then(function () {
      return listen().then(function (command) {
        if (['aceptar', 'cancelar'].includes(command)) {
          resolve(command === 'aceptar');
        } else {
          speak("Lo siento, no te he entendido.").then(function () {
            console.log("Otro prompt");
            handleConfirmQuestion(question).then(function (command) {
              return resolve(command);
            });
          });
        }
      });
    });
  });
};

var handleInput = function handleInput(question) {
  return new Promise(function (resolve, reject) {
    speak(question.message).then(function () {
      return listen().then(function (command) {
        if (command.length) {
          resolve(command);
        } else {
          speak("Lo siento, no te he entendido.").then(function () {
            console.log("Otro prompt");
            handleInput(question).then(function (command) {
              return resolve(command);
            });
          });
        }
      });
    });
  });
};

var listen = function listen() {
  return new Promise(function (resolve, reject) {
    var recognition = new window.SpeechRecognition(); //recognition.continuous = false;

    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function (event) {
      var command = event.results[0][0].transcript;
      console.log("Listened: " + command);
      resolve(command);
    };

    recognition.onnomatch = function () {
      console.log("No match.");
      resolve("");
    };

    recognition.onerror = function () {
      console.log("Error.");
      resolve("");
    };

    recognition.start();
  });
};

var speak = function speak(text) {
  return new Promise(function (resolve, reject) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = text;

    utterance.onend = function () {
      resolve();
    };

    console.log("Speak: " + text);
    window.speechSynthesis.speak(utterance);
  });
};

var speech = new SpeechEnquirer();
speech.registerQuestion("list", handleListQuestion);
speech.registerQuestion("confirm", handleConfirmQuestion);
speech.registerQuestion("input", handleInput);

module.exports = speech;
