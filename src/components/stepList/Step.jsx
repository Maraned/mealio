import React, { useState, useEffect, useContext } from 'react';

import EditableField from 'components/core/EditableField';
import TimerButton from 'components/core/TimerButton';

import { EditableContext } from 'contexts/editable';

import { FaBurn } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import './step.css';

const Step = ({ 
  step, 
  updateStep, 
  index,
  ingredients,
  onMouseOver,
  onMouseLeave
}) => {
  const [parsedStep, setParsedStep] = useState([]);
  const { state } = useContext(EditableContext);
  const { t } = useTranslation();
  const [oven, setOven] = useState(0);

  const includesDegrees = () => {
    const regex = new RegExp(`(\\d+)\\s*${t('Recipe:Degrees')}`, 'g');
    const match = regex.exec(step);
    if (match) {
      setOven(match[1]);
    }
  }

  useEffect(() => {
    includesDegrees();
  }, [step])

  const wordContainsIngredient = (word, ingredient) => {
    const ingredientInWord = word.includes(ingredient);
    const wordContainsIngredient = ingredient.includes(word);

    return ingredientInWord 
      || wordContainsIngredient; 
  }

  const getTimer = (timeUnit, timeUnitPlural, type) => {
    const regex = new RegExp(`(\\d+)\\s(${timeUnitPlural}|${timeUnit})`, 'g');
    const match = regex.exec(step);
    if (match) {
      const [timeText, time] = match;
      return {
        time,
        timeText,
        type
      }
    }
  }

  const isSecond = () => {
    const second = t('Time:Second');
    const seconds = t('Time:Second', { count: 2 });
    return getTimer(second, seconds, 'second');
  }

  const isMinute = () => {
    const minute = t('Time:Minute');
    const minutes = t('Time:Minute', { count: 2 });
    return getTimer(minute, minutes, 'minute');
  }

  const isHour = () => {
    const hour = t('Time:Hour');
    const hours = t('Time:Hour', { count: 2 });
    return getTimer(hour, hours, 'hour');
  }

  const isDay = () => {
    const day = t('Time:Day');
    const days = t('Time:Day', { count: 2 });
    return getTimer(day, days, 'day');
  }

  const getTimers = () => {
    return isSecond()
      || isMinute()
      || isHour()
      || isDay();
  }

  const [timer, setTimer] = useState(getTimers())
  
  const parseStep = () => {
    const parsedParts = [];
    const words = step.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let ingredientFound = false;

      for (let j = 0; j < ingredients.length; j++) {
        const ingredient = ingredients[j];
        if (wordContainsIngredient(word, ingredient.name)) {
          ingredientFound = ingredient;
          break;
        }
      }

      if (ingredientFound) {
        parsedParts.push({ text: word, ingredient: ingredientFound })
      } else {
        parsedParts.push({ text: word })
      }
    }

    setParsedStep(parsedParts);
  }

  useEffect(() => {
    parseStep();
  }, [ingredients])

  const onChange = event => {
    step = event.target.value;
    updateStep(index, step);
  }

  const viewMode = () => (
    <>
      <div className="step__symbols">
        <span>{index + 1}.&nbsp;</span>

        {!!oven && (
          <div className="step__oven">
            <FaBurn />
            <span>{oven}</span>
          </div>
        )}
       </div>

      <div className="step__content">
        {parsedStep.map((word, wordIndex) => (
          <span 
            key={word.text + wordIndex} 
            className={word.ingredient && 'highlightedWord'}
            onMouseOver={word.ingredient && onMouseOver(word.ingredient)}
            onMouseLeave={onMouseLeave}
          >
            {word.text}
            &nbsp;
          </span>
        ))}

        {timer && (
          <div className="step__timerButtonContainer">
            <TimerButton 
              unit={timer.type} 
              text={timer.timeText} 
              time={timer.time} 
            />
          </div>
        )}
      </div>
    </>
  );

  const editMode = () => (
    <EditableField
      value={step}
      onChange={onChange}
    />
  );

  return (
    <div className="step">
      {state.editable ? editMode() : viewMode()}
     
    </div>
  )
}

export default Step;
