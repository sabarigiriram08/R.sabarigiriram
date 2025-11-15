(() => {
  const screen = document.getElementById('screen');
  let current = '0';
  let operator = null;
  let previous = null;
  let resetNext = false;

  function updateScreen() {
    screen.value = current;
  }

  function inputNumber(n) {
    if (resetNext) {
      current = n;
      resetNext = false;
    } else {
      current = (current === '0') ? n : current + n;
    }
  }

  function inputDot() {
    if (resetNext) { current = '0.'; resetNext = false; return; }
    if (!current.includes('.')) current += '.';
  }

  function clearAll() {
    current = '0';
    operator = null;
    previous = null;
    resetNext = false;
  }

  function backspace() {
    if (resetNext) { current = '0'; resetNext = false; return; }
    current = current.length > 1 ? current.slice(0, -1) : '0';
  }

  function doOperator(op) {
    if (operator && !resetNext) {
      compute();
    }
    previous = parseFloat(current);
    operator = op;
    resetNext = true;
  }

  function compute() {
    if (operator == null || previous == null) return;
    const a = previous;
    const b = parseFloat(current);
    let res = 0;
    switch (operator) {
      case 'plus': res = a + b; break;
      case 'minus': res = a - b; break;
      case 'multiply': res = a * b; break;
      case 'divide': res = b === 0 ? 'Error' : a / b; break;
    }
    current = (typeof res === 'number') ? String(parseFloat(res.toFixed(10)).toString()) : String(res);
    operator = null;
    previous = null;
    resetNext = true;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList.contains('num')) {
      inputNumber(t.dataset.value);
      updateScreen();
      return;
    }
    const action = t.dataset.action;
    if (!action) return;
    if (action === 'clear') { clearAll(); updateScreen(); return; }
    if (action === 'back') { backspace(); updateScreen(); return; }
    if (action === 'dot') { inputDot(); updateScreen(); return; }
    if (action === 'equal') { compute(); updateScreen(); return; }
    if (['plus','minus','multiply','divide'].includes(action)) {
      doOperator(action);
      return;
    }
  });

  // initial
  updateScreen();
})();
