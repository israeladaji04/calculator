// const displayinput = document.getElementById{'inputvalue'}
let displayInput = null

//variables
const operators = ['-', '+', '/', '%', '*' ]
let operations=[]
let currValue= ''
//functions & operations

//handle interactions
function handleinteraction(value) {
    console.log(value);
    // handle evaluate and reset first
    if (value === '=') {
        handleevaluate()
        updateUI()
        return
    }
    if (value === 'C' || value === 'c') {
        handlereset()
        updateUI()
        return
    }

    if (operators.includes(value)) {
        console.log('clicked an operator: ', value)
        handleoperatorinput(value)
    } else {
        console.log('clicked a numeric value: ', value)
        handlenumericinput(value)
    }
    updateUI()
}

function handlenumericinput(value) {
currValue += value
console.log('NEW VALUE: ', currValue)
}

function handleoperatorinput(value) {
if(!currValue) {
    return
}
operations.push(currValue)
operations.push(value)
currValue = ''
}

function handleevaluate() {
    // push current value if present
    if (currValue) operations.push(currValue)

    const expression = operations.join(' ')
    if (!expression) return

    try {
        // evaluate expression safely
        const result = Function('"use strict"; return (' + expression + ')')()
        // handle non-finite results
        if (typeof result === 'number' && !isFinite(result)) {
            currValue = 'Error'
        } else {
            currValue = String(result)
        }
    } catch (err) {
        currValue = 'Error'
    }

    // clear pending operations after evaluation
    operations = []

    // update UI to show result
    updateUI()
}


function handlereset(){
    operations = []
    currValue = ''
    updateUI()
}

function updateUI() {
    const displayString = operations.join(' ') + (currValue || '')
    if (!displayInput) return

    // if the display is an input/textarea use value, otherwise use textContent
    if ('value' in displayInput) {
        displayInput.value = displayString
    } else {
        displayInput.textContent = displayString
    }
}

// theme and initialization helpers
function toggleTheme() {
    document.body.classList.toggle('dark-mode')
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    try { localStorage.setItem('theme', mode) } catch (e) {}
}

function init() {
    // get display element after DOM is ready
    displayInput = document.getElementById('inputvalue')

    // restore theme
    const saved = (() => { try { return localStorage.getItem('theme') } catch (e) { return null } })()
    if (saved === 'dark') document.body.classList.add('dark-mode')

    // expose functions for inline handlers
    window.handleinteraction = handleinteraction
    window.toggleTheme = toggleTheme
    window.handlereset = handlereset

    updateUI()
}

// run init when script loads (if DOM already ready) or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}