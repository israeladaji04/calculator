
        let currentOperand = '';
        let previousOperand = '';
        let operation = null;

        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');

        function updateDisplay() {
            currentOperandElement.textContent = currentOperand || '0';
            if (operation != null) {
                previousOperandElement.textContent = `${previousOperand} ${operation}`;
            } else {
                previousOperandElement.textContent = '';
            }
        }

        function appendNumber(number) {
            addButtonPressAnimation(event.target);
            
            if (number === '.' && currentOperand.includes('.')) return;
            
            if (currentOperand === '0' && number !== '.') {
                currentOperand = number;
            } else {
                currentOperand = currentOperand.toString() + number.toString();
            }
            updateDisplay();
        }

        function chooseOperation(nextOperation) {
            addButtonPressAnimation(event.target);
            
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                compute();
            }
            
            operation = nextOperation;
            previousOperand = currentOperand;
            currentOperand = '';
            updateDisplay();
        }

        function compute() {
            addButtonPressAnimation(event.target);
            
            let computation;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        showError();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            
            // Format the result
            if (computation.toString().length > 12) {
                if (computation < 1 && computation > -1) {
                    currentOperand = computation.toExponential(6);
                } else {
                    currentOperand = computation.toPrecision(8);
                }
            } else {
                currentOperand = computation.toString();
            }
            
            operation = null;
            previousOperand = '';
            updateDisplay();
        }

        function clearAll() {
            addButtonPressAnimation(event.target);
            currentOperand = '';
            previousOperand = '';
            operation = null;
            updateDisplay();
        }

        function deleteLast() {
            addButtonPressAnimation(event.target);
            currentOperand = currentOperand.toString().slice(0, -1);
            updateDisplay();
        }

        function showError() {
            currentOperandElement.classList.add('error');
            currentOperand = 'Error';
            updateDisplay();
            
            setTimeout(() => {
                currentOperandElement.classList.remove('error');
                clearAll();
            }, 1500);
        }

        function addButtonPressAnimation(button) {
            button.classList.add('button-press');
            setTimeout(() => {
                button.classList.remove('button-press');
            }, 100);
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const toggle = document.querySelector('.dark-mode-toggle');
            
            if (document.body.classList.contains('dark-mode')) {
                toggle.textContent = '☀️';
            } else {
                toggle.textContent = '🌙';
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            if (event.key >= '0' && event.key <= '9' || event.key === '.') {
                appendNumber(event.key);
            }
            
            if (event.key === '+' || event.key === '-') {
                chooseOperation(event.key);
            }
            
            if (event.key === '*') {
                chooseOperation('×');
            }
            
            if (event.key === '/') {
                event.preventDefault();
                chooseOperation('÷');
            }
            
            if (event.key === 'Enter' || event.key === '=') {
                compute();
            }
            
            if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
                clearAll();
            }
            
            if (event.key === 'Backspace') {
                deleteLast();
            }
        });

        // Initialize display
        updateDisplay();
    