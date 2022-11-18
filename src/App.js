import React, { useState } from "react";
import "./App.css";

function App() {
  // variables & starting points //
  const numberPad = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const operatorPad = ["+", "-", "/", "*", "^y", "(", ")"];
  const [display, setDisplay] = useState(0);
  const [calculation, setCalculation] = useState("");
  const [comingFromOp, setComingFromOp] = useState(false);
  const [computed, setComputed] = useState(false);

  // keypad components //
  const NumberButton = ({ number }) => (
    <button value={number} onClick={handleNumClick}>
      {number}
    </button>
  );

  const OperatorButton = ({ operator }) => (
    <button value={operator} onClick={handleOpClick}>
      {operator}
    </button>
  );

  // event handlers & logic //
  function handleNumClick(evt) {
    // we need to know if the user is continuing to type a multi-digit number
    // or starting a new number. we consider it a new number if we're starting
    // from default (0) or if we're adding our first number after an operator (comingFromOp)
    let isFirstNumber = display === 0;

    // this helper sets our current number display and adds numbers to calculation
    function displayAndCalcHelper() {
      if (computed) {
        // if a value was computed and the next button clicked is a number,
        // we want to erase the previous calculation & display and start anew
        setCalculation(evt.target.value);
        setDisplay(evt.target.value);
        setComputed(false);
      } else {
        // otherwise, we want to add to our existing display and calculation
        setDisplay(
          isFirstNumber ? evt.target.value : display + evt.target.value
        );
        setCalculation(calculation.concat(evt.target.value));
      }
    }

    if (comingFromOp) {
      // if we're coming from an operator, we need to set isFirstNumber = true
      isFirstNumber = true;
      displayAndCalcHelper();
      // no longer coming from an operator, so we set comingFromOp = false
      setComingFromOp(false);
    } else {
      displayAndCalcHelper();
    }
  }

  function handleOpClick(evt) {
    // our exponent key uses a value (^y) that does not match the JS syntax
    // we convert that specific value to ** for use in JS eval
    let properOperator = evt.target.value === "^y" ? "**" : evt.target.value;

    // if we recently computed a value, clicking an operator tells us that
    // we're editing the previous calculation and we should set computed to false
    if (computed) setComputed(false);
    // add the operator to our existing calculation
    setCalculation(calculation.concat(properOperator));
    // since we just clicked an operator, let's set comingFromOp to true
    setComingFromOp(true);
  }

  function handleCompute() {
    try {
      // NOTE: eval can be used to execute JS code written as a string, but it
      // seems to have security flaws, so this should probably not be used in
      // production, or at least be sanitized first
      setDisplay(eval(calculation));
      // once computed, we want to set computed to true
      setComputed(true);
    } catch {
      setDisplay("Something went wrong!");
    }
  }

  function handleClear() {
    setDisplay(0);
    setCalculation("");
    setComingFromOp(false);
    setComputed(false);
  }

  // render it! //
  return (
    <div className="App">
      <h1>Evan's Calculator</h1>
      {numberPad.map((num, idx) => {
        return <NumberButton key={idx} number={num} />;
      })}
      <br></br>
      {operatorPad.map((op, idx) => {
        return <OperatorButton key={idx} operator={op} />;
      })}
      <br></br>
      <button onClick={handleCompute}>COMPUTE</button>
      <h3>{display}</h3>
      <button onClick={handleClear}>CLEAR</button>
    </div>
  );
}

export default App;
