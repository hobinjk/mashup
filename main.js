var textA = document.getElementById('text-a');
var textB = document.getElementById('text-b');
var outputElt = document.getElementById('output');
var doTransformButton = document.getElementById('do-transform');
doTransformButton.addEventListener('click', function() {
  doTransform();
  doTransformButton.value = Util.randomChoice([
    'Mash \'em up!',
    'Form an unholy union',
    'Will it blend?',
    'Get the duct tape',
    'Make a marriage of inconvenience',
    'Combinate',
    'Combinify',
    'MASH UP'
  ]);
});

var preserveNewlines = document.getElementById('preserve-newlines');

function doTransform() {
  var inputA = textA.value;
  var inputB = textB.value;
  transform(inputA, inputB);
}

function transform(inputA, inputB) {
  var markA = new Markov(3, inputA, preserveNewlines.checked);
  var markB = new Markov(3, inputB, preserveNewlines.checked);

  var output = '';
  outputElt.innerHTML = '';
  function appendWord(source, word) {
    if (!output) {
      output = word;
    } else {
      output += ' ' + word;
    }
    var elt = document.createElement('span');
    elt.classList.add('output-' + source);
    // Unescape the newlines that Markov adds
    word = word.replace(/\n/g, '<br/>');
    elt.innerHTML = word;
    var space = document.createTextNode(' ');

    outputElt.appendChild(elt);
    outputElt.appendChild(space);
  }
  for (var i = 0; i < 100; i++) {
    var outA = markA.generate(output);
    if (outA) {
      appendWord('a', outA);
    }
    var outB = markB.generate(output);
    if (outB) {
      appendWord('b', outB);
    }
  }
}
