import { useReducer } from 'react'
import './App.css'
import DigitButton from './DigitButton.js'
import OperationButton from './OperationButton'
import Nav from './components/navbar'

export const ACTIONS = {
  ADD_DIGIT: 'add-digits',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digits',
  EVALUATE: 'evaluate'
}

function reducer (state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

function formatOperand(operand) {
  if(operand == null) return 
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function evaluate ({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '/':
      computation = prev / current
      break
    case '*':
      computation = prev * current
      break
  }
  return computation.toString()

}

function App () {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className='App'>
      <Nav />
      <div class='grid-container'>
        <div className='merged-displ'>
          <div className='process-display'>
            {previousOperand}
            {operation}
          </div>
          <div className='output-display'>{currentOperand}</div>
        </div>

        <button
          class='grid-item merged-cell'
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
        <OperationButton operation='/' dispatch={dispatch} />

        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />

        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />

        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />

        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <button
        className="merged-cell-2"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
      </div>
    </div>
  )
}

export default App
