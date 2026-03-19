'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCamouflageStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Operator = '+' | '-' | '*' | '/'

export default function CalculatorPage() {
  const router = useRouter()
  const { isActive, verifyPin, setActive } = useCamouflageStore()
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [pinAttempt, setPinAttempt] = useState('')

  // Redirect if camouflage is not active (for direct URL access)
  useEffect(() => {
    if (!isActive) {
      // Allow access for testing - in production would redirect
    }
  }, [isActive, router])

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      setPinAttempt(digit)
    } else {
      const newDisplay = display === '0' ? digit : display + digit
      setDisplay(newDisplay)
      setPinAttempt(pinAttempt + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      setPinAttempt('')
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
      setPinAttempt('')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setPinAttempt('')
  }

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
    setPinAttempt('')
  }

  const inputPercent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
    setPinAttempt('')
  }

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
    setPinAttempt('')
  }

  const calculate = (left: number, right: number, op: Operator): number => {
    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return right !== 0 ? left / right : 0
      default:
        return right
    }
  }

  const handleEquals = () => {
    // Check if PIN was entered
    if (pinAttempt.length === 4 && verifyPin(pinAttempt)) {
      // Correct PIN - exit camouflage mode
      setActive(false)
      router.push('/')
      return
    }

    // Normal calculation
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display)
      const result = calculate(previousValue, inputValue, operator)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    }
    setPinAttempt('')
  }

  const buttons = [
    { label: 'AC', action: clear, className: 'bg-gray-300 text-gray-900' },
    { label: '+/-', action: toggleSign, className: 'bg-gray-300 text-gray-900' },
    { label: '%', action: inputPercent, className: 'bg-gray-300 text-gray-900' },
    { label: '÷', action: () => performOperation('/'), className: 'bg-accent text-accent-foreground' },
    
    { label: '7', action: () => inputDigit('7'), className: 'bg-gray-100 text-gray-900' },
    { label: '8', action: () => inputDigit('8'), className: 'bg-gray-100 text-gray-900' },
    { label: '9', action: () => inputDigit('9'), className: 'bg-gray-100 text-gray-900' },
    { label: '×', action: () => performOperation('*'), className: 'bg-accent text-accent-foreground' },
    
    { label: '4', action: () => inputDigit('4'), className: 'bg-gray-100 text-gray-900' },
    { label: '5', action: () => inputDigit('5'), className: 'bg-gray-100 text-gray-900' },
    { label: '6', action: () => inputDigit('6'), className: 'bg-gray-100 text-gray-900' },
    { label: '−', action: () => performOperation('-'), className: 'bg-accent text-accent-foreground' },
    
    { label: '1', action: () => inputDigit('1'), className: 'bg-gray-100 text-gray-900' },
    { label: '2', action: () => inputDigit('2'), className: 'bg-gray-100 text-gray-900' },
    { label: '3', action: () => inputDigit('3'), className: 'bg-gray-100 text-gray-900' },
    { label: '+', action: () => performOperation('+'), className: 'bg-accent text-accent-foreground' },
    
    { label: '0', action: () => inputDigit('0'), className: 'bg-gray-100 text-gray-900 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-gray-100 text-gray-900', isDecimal: true },
    { label: '=', action: handleEquals, className: 'bg-accent text-accent-foreground' },
  ]

  // Format display to handle long numbers
  const formatDisplay = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return '0'
    if (value.length > 9) {
      return num.toExponential(4)
    }
    return value
  }

  return (
    <main className="min-h-[100dvh] bg-white flex flex-col">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end p-6 pb-4">
        <span 
          className="text-6xl font-light text-gray-900 tracking-tight"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {formatDisplay(display)}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-8">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={cn(
              'h-16 rounded-full text-2xl font-medium transition-all active:scale-95 active:opacity-80',
              button.className,
              button.label === '0' && 'col-span-2 justify-start pl-7 text-left'
            )}
          >
            {button.isDecimal ? (
              // Subtle indicator on decimal button - 2px navy underline
              <span className="relative">
                .
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-0.5 bg-primary/30 rounded-full" />
              </span>
            ) : (
              button.label
            )}
          </button>
        ))}
      </div>

      {/* Very subtle home indicator (like iOS) */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </main>
  )
}
