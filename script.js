class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    changeMode() {
        if (!document.getElementById('pow')) {
            let powButton = document.createElement('button')
            powButton.id = 'pow'
            powButton.className = 'span-two'
            powButton.setAttribute('data-extended-operation', '')
            powButton.innerText = 'pow'

            let sqrtButton = document.createElement('button')
            sqrtButton.id = 'sqrt'
            sqrtButton.className = 'span-two'
            sqrtButton.setAttribute('data-extended-operation', '')
            sqrtButton.innerText = 'sqrt'

            let currentButton = document.getElementById('1')
            let parentDiv = document.getElementById('calculator')
            let newButtons = [powButton, sqrtButton]
            for (let i = 0; i < newButtons.length; i++) {
                parentDiv.insertBefore(newButtons[i], currentButton)
                currentButton = newButtons[i]
            }

            document.styleSheets[1].insertRule(
                '.calculator-grid {' +
                '    display: grid;' +
                '    justify-content: center;' +
                '    align-content: center;' +
                '    min-height: 100vh;' +
                '    grid-template-columns: repeat(4, 100px);' +
                '    grid-template-rows: minmax(130px, auto) repeat(6, 85px);' +
                '}', 0
            )

            let extendedOperationButtons = document.querySelectorAll('[data-extended-operation]')
            extendedOperationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.chooseOperation(button.innerText)
                    this.updateDisplay()
                })
            })
        } else {
            this.removeElement('pow')
            this.removeElement('sqrt')
            document.styleSheets[1].deleteRule(0)
        }
    }

    removeElement(id) {
        let element = document.getElementById(id)
        return element.parentNode.removeChild(element)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '*':
                computation = prev * current
                break
            case '÷':
                computation = prev / current
                break
            case 'pow':
                computation = Math.pow(prev, current)
                break
            case 'sqrt':
                computation = Math.pow(prev, 1/current)
                break
            default:
                return
        }
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const changeModeButton = document.querySelector('[data-change-mode]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

changeModeButton.addEventListener('click', button => {
    calculator.changeMode()
    calculator.updateDisplay()
})