// calculator logic
(() => {
  const display = document.getElementById('display');
  let expression = '';

  const setDisplay = (v) => display.textContent = v === '' ? '0' : v;

  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');
      handleInput(val, action);
    });
  });

  function handleInput(value, action){
    if(action === 'clear'){
      expression = '';
      setDisplay(expression);
      return;
    }
    if(action === 'back'){
      expression = expression.slice(0,-1);
      setDisplay(expression);
      return;
    }
    if(action === 'calculate'){
      calculate();
      return;
    }

    if(!value) return;

    const last = expression.slice(-1);

    if(value === '.'){
      const lastOpIndex = Math.max(expression.lastIndexOf('+'), expression.lastIndexOf('-'), expression.lastIndexOf('*'), expression.lastIndexOf('/'));
      const currentNumber = expression.slice(lastOpIndex+1);
      if(currentNumber.includes('.')) return;
      if(currentNumber === '' ) value = '0.';
    }

    if(/[\+\-\*\/]/.test(value)){
      if(expression === '' && value !== '-') return;
      if(/[\+\-\*\/]/.test(last)) {
        expression = expression.slice(0,-1) + value;
        setDisplay(expression);
        return;
      }
    }

    expression += value;
    setDisplay(expression);
  }

  function calculate(){
    if(expression === '') return;
    try {
      if(!/^[0-9.+\-*/() ]+$/.test(expression)) { setDisplay('Error'); expression = ''; return; }
      const result = Function('"use strict"; return (' + expression + ')')();
      expression = String(Number.isFinite(result) ? +result.toFixed(10) : result);
      setDisplay(expression);
    } catch(e){
      setDisplay('Error');
      expression = '';
    }
  }

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') { e.preventDefault(); handleInput(null,'calculate'); return; }
    if(e.key === 'Backspace'){ e.preventDefault(); handleInput(null,'back'); return; }
    if(e.key === 'Escape'){ e.preventDefault(); handleInput(null,'clear'); return; }
    if(/^[0-9+\-*/.]$/.test(e.key)){
      handleInput(e.key, null);
    }
  });

})();
