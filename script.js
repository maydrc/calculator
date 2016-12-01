/* global $, math */
var calculatorIsOn = true;
var current = '0';
var maxLength = 10;
var previousClicked = '';
var mathOperator = '';
var mathFunction = null;
var obj = { pow: 'pow', '/': 'divide', '+': 'add', '-': 'subtract', '*': 'multiply' };

function executeOperation(previousMathOperator) {
  if (!mathFunction) {
    mathFunction = math.chain(current);
  } else if (previousMathOperator) {
    mathFunction = mathFunction[previousMathOperator](current);
  }
  current = '0';
}

function countingDecimalPoints(number) {
  var indices = [];
  var element = '.';
  var idx = number.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = number.indexOf(element, idx + 1);
  }
  return indices.length;
}

function buildNumber(dig) {
  if (current.length < maxLength) {
    if (current === '0' && dig !== '.') {
      current = dig;
    } else {
      current += dig;
      if (dig === '.' && countingDecimalPoints(current) > 1) {
        current = current.slice(0, -1);
      }
    }
  }
  $('#display').val(current);
}

$(document).ready(function () {
  $('#buttonOff').on('click', function () {
    calculatorIsOn = false;
    $('#display').val('');
  });

  $('#buttonOn').on('click', function () {
    calculatorIsOn = true;
    mathFunction = null;
    mathOperator = '';
    current = '0';
    $('#display').val('0');
  });

  $('#buttonClear').on('click', function () {
    if (calculatorIsOn === true) {
      mathFunction = null;
      mathOperator = '';
      current = '0';
      $('#display').val('0');
    }
  });

  document.getElementById('calculator').addEventListener('click', function (id) {
    if (calculatorIsOn === true) {
      if (id.target.id.charCodeAt(0) === 46 || (id.target.id.charCodeAt(0) >= 48 && id.target.id.charCodeAt(0) <= 57)) {
        buildNumber(id.target.id);
        if (previousClicked === '=') {
          mathFunction = null;
        }
      }

      if (obj[id.target.id]) {
        if (previousClicked.charCodeAt(0) >= 48 && previousClicked.charCodeAt(0) <= 57) {
          executeOperation(mathOperator);
        }
        mathOperator = obj[id.target.id];
      }

      if (id.target.id === '=') {
        executeOperation(mathOperator);
        current = mathFunction.done();
        $('#display').val(parseFloat(current).toLocaleString(undefined, { maximumFractionDigits: 8 }));
        mathOperator = '';
        current = '0';
      }
      previousClicked = id.target.id;
    }
  });
});
