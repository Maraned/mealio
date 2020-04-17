import React, { useState, useEffect, useContext, useRef } from 'react';
import cc from 'classcat';

import EditableField from 'components/core/EditableField/EditableField';
import TimerButton from 'components/core/TimerButton';

import { EditableContext } from 'contexts/editable';

import { 
  FaBurn, 
  FaIndent,
  FaOutdent, 
  FaListOl, 
  FaBars,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import './step.css';

const Step = ({ 
  step, 
  updateStep, 
  index,
  ingredients,
  onMouseOver,
  onMouseLeave,
  onPaste,
  onRemove,
}) => {
  const [parsedStep, setParsedStep] = useState([]);
  const { state } = useContext(EditableContext);
  const { t } = useTranslation();
  const [oven, setOven] = useState(0);
  const [showEditButtons, setShowEditButtons] = useState(false);
  const onPasteCalled = useRef(false);

  const includesDegrees = () => {
    const regex = new RegExp(`(\\d+)\\s*${t('Recipe:Degrees')}`, 'g');
    const match = regex.exec(step.text);
    if (match) {
      setOven(match[1]);
    }
  }

  useEffect(() => {
    includesDegrees();
    // eslint-disable-next-line
  }, [step])

  const wordContainsIngredient = (word, ingredient) => {
    const ingredientInWord = word.includes(ingredient);
    const wordContainsIngredient = word.length > 3 && ingredient.includes(word);

    return ingredientInWord 
      || wordContainsIngredient; 
  }

  const getTimer = (timeUnit, timeUnitPlural, type) => {
    const regex = new RegExp(`(\\d+)\\s(${timeUnitPlural}|${timeUnit})`, 'g');
    const match = regex.exec(step.text);
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

  const [timer] = useState(getTimers())
  
  const parseStep = () => {
    if (!step.text) {
      return;
    }

    const parsedParts = [];
    const words = step.text.split(' ');
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
    // eslint-disable-next-line 
  }, [ingredients])

  const updateText = text => {
    if (onPasteCalled.current) {
      onPasteCalled.current = false;
      return;
    }
    step.text = text;
    updateStep(index, step);
  }

  const updateShowNumbers = () => {
    step.showNumber = !step.showNumber;
    updateStep(index, step);
  }

  const updateIndentation = newIndentation => () => {
    step.indentation = newIndentation;
    updateStep(index, step);
  }

  const removeStep = () => {
    onRemove(step, index);
  }

  const onPasteHandler = text => {
    onPasteCalled.current = true;
    if (onPaste) {
      onPaste(text);
    }
  }
  
  // eslint-disable-next-line 
  const documentClick = event => {
    event.preventDefault();
    const isTarget = event.target.classList.contains('step__tools__option')
      || event.target.classList.contains('step__tools');
    if (isTarget) {
      document.addEventListener('click', documentClick, { once: true });
    } else {
      setShowEditButtons(false);
    }
  };

  const viewMode = () => (
    <>
      <div className="step__symbols">
        {step.showNumber && (
          <span>{index + 1}.&nbsp;</span>
        )}

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

  const toolbarButtons = [
    { 
      icon: <FaOutdent />, 
      onClick: updateIndentation(step.indentation - 1),
      hide: step.indentation < 1,
    },
    { 
      icon: <FaIndent />, 
      onClick: updateIndentation(step.indentation + 1),
      hide: step.indentation > 1
    },
    { 
      icon: step.showNumber ? <FaBars /> : <FaListOl />, 
      onClick: updateShowNumbers,
    },
    {
      type: 'bold'
    }
  ];

  const editMode = () => (
    <>
      {step.showNumber && (
        <span className="step__number">{index + 1}.&nbsp;</span>
      )}

      <EditableField
        value={step.text}
        onChange={updateText}
        onPaste={onPasteHandler}
        onBlur={() => setShowEditButtons(false)}
        toolbarButtons={toolbarButtons}
        type="text"
        showRemove={showEditButtons}
        onRemove={removeStep}
      />
    </>
  );

  return (
    <div className={cc(['step', {
      'step--edit': state.editable,
      [`step__content--indentation-${step.indentation}`]: step.indentation
    }])}>
      {state.editable ? editMode() : viewMode()}     
    </div>
  )
}

export default Step;
