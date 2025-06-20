
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const CalculatorPage: React.FC = () => {
  const { t } = useLanguage();
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operand, setOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const handleNumberClick = (numStr: string) => {
    if (waitingForOperand) {
      setDisplayValue(numStr);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? numStr : displayValue + numStr);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const performCalculation = (nextOperator?: string) => {
    const inputValue = parseFloat(displayValue);

    if (operand === null) {
      setOperand(inputValue);
    } else if (operator) {
      let result = operand;
      if (operator === '+') {
        result += inputValue;
      } else if (operator === '-') {
        result -= inputValue;
      } else if (operator === '*') {
        result *= inputValue;
      } else if (operator === '/') {
        if (inputValue === 0) {
          setDisplayValue('Error');
          setOperand(null);
          setOperator(null);
          setWaitingForOperand(true);
          return;
        }
        result /= inputValue;
      }
      // Handle precision issues for simple cases
      const resultStr = String(parseFloat(result.toPrecision(12)));
      setDisplayValue(resultStr);
      setOperand(result);
    }
    
    setWaitingForOperand(true);
    setOperator(nextOperator || null);
  };

  const handleOperatorClick = (op: string) => {
    if (displayValue === "Error") return;
    performCalculation(op);
  };

  const handleEqualsClick = () => {
    if (displayValue === "Error") return;
    performCalculation();
     // After equals, pressing an operator should use the result as the first operand.
    // Pressing a number should start a new calculation.
    // SetWaitingForOperand is already true. We need to nullify the current operator.
    setOperator(null); 
  };
  
  const handleClearClick = () => {
    setDisplayValue('0');
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleAllClearClick = () => {
    handleClearClick(); // Same as clear for now, could be extended
  };

  const handleSignChangeClick = () => {
    if (displayValue === '0' || displayValue === "Error") return;
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };
  
  const handlePercentageClick = () => {
    if (displayValue === "Error") return;
    setDisplayValue(String(parseFloat(displayValue) / 100));
    // Optionally, set waitingForOperand or clear operator depending on desired behavior
    setWaitingForOperand(true); 
  };


  const buttonClasses = "p-3 sm:p-4 md:p-5 text-lg sm:text-xl font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150 ease-in-out";
  const numButtonClasses = `${buttonClasses} bg-gray-600 hover:bg-gray-500 text-white`;
  const opButtonClasses = `${buttonClasses} bg-orange-500 hover:bg-orange-400 text-white`;
  const specialButtonClasses = `${buttonClasses} bg-gray-400 hover:bg-gray-300 text-black`;

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
        {t('investmentCalculatorTitle')}
      </h2>
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div 
          id="calculator-display" 
          className="bg-gray-900 text-white text-right p-4 rounded-md mb-4 text-2xl sm:text-3xl md:text-4xl break-all overflow-hidden h-20 flex items-end justify-end"
        >
          {displayValue}
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <button onClick={handleAllClearClick} className={`${specialButtonClasses}`}>AC</button>
          <button onClick={handleSignChangeClick} className={`${specialButtonClasses}`}>+/-</button>
          <button onClick={handlePercentageClick} className={`${specialButtonClasses}`}>%</button>
          <button onClick={() => handleOperatorClick('/')} className={`${opButtonClasses}`}>÷</button>

          <button onClick={() => handleNumberClick('7')} className={`${numButtonClasses}`}>7</button>
          <button onClick={() => handleNumberClick('8')} className={`${numButtonClasses}`}>8</button>
          <button onClick={() => handleNumberClick('9')} className={`${numButtonClasses}`}>9</button>
          <button onClick={() => handleOperatorClick('*')} className={`${opButtonClasses}`}>×</button>

          <button onClick={() => handleNumberClick('4')} className={`${numButtonClasses}`}>4</button>
          <button onClick={() => handleNumberClick('5')} className={`${numButtonClasses}`}>5</button>
          <button onClick={() => handleNumberClick('6')} className={`${numButtonClasses}`}>6</button>
          <button onClick={() => handleOperatorClick('-')} className={`${opButtonClasses}`}>−</button>

          <button onClick={() => handleNumberClick('1')} className={`${numButtonClasses}`}>1</button>
          <button onClick={() => handleNumberClick('2')} className={`${numButtonClasses}`}>2</button>
          <button onClick={() => handleNumberClick('3')} className={`${numButtonClasses}`}>3</button>
          <button onClick={() => handleOperatorClick('+')} className={`${opButtonClasses}`}>+</button>

          <button onClick={() => handleNumberClick('0')} className={`${numButtonClasses} col-span-2`}>0</button>
          <button onClick={handleDecimalClick} className={`${numButtonClasses}`}>.</button>
          <button onClick={handleEqualsClick} className={`${opButtonClasses}`}>=</button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
