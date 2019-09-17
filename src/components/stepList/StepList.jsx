import React, { useContext, useState } from 'react';

import { RecipeContext } from 'contexts/recipe';
import { EditableContext } from 'contexts/editable';

import Step from 'components/stepList/Step';

import { useTranslation } from 'react-i18next';

import './stepList.css';

const StepList = () => {
  const { state } = useContext(EditableContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t, i18n } = useTranslation();
  
  const [popup, setPopup] = useState({
    open: false,
    ingredient: false,
  });

  const { steps, ingredients } = recipe;

  const updateStep = (index, step) => {
    steps[index] = step;
    updateRecipe({ type: 'steps', value: steps })
  }

  const addStep = () => {
    steps.push('');
    updateRecipe({ type: 'steps', value: steps })
  }

  const updateSteps = steps => {
    updateRecipe({ type: 'steps', value: steps });
  }

  const removeStep = (step, index) => {
    const modifiedSteps = [...steps];
    modifiedSteps.splice(index, 1);
    updateRecipe({ type: 'steps', value: modifiedSteps });
  }

  const hoverStep = ingredient => event => {
    const rect = event.target.getBoundingClientRect();
    setPopup({
      open: true,
      ingredient,
      top: rect.top + 20,
      left: rect.left
    })
  }

  const closePopup = () => {
    setPopup({
      open: false,
    })
  }

  const parseStepText = stepText => {
    const lines = stepText.split('\n');
    if (lines.length) {
      const newSteps = [...steps, ...lines];
      updateSteps(newSteps);
    }
  }

  const pasteSteps = event => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('Text');
    parseStepText(pastedText)
  }

  return (
    <div className="stepList list background">
      <h4>{t('Recipe:Steps')}</h4>
      {steps.map((step, index) => (
        <Step
          key={'step' + index}
          updateStep={updateStep} 
          index={index} 
          step={step}
          ingredients={ingredients}
          onMouseOver={hoverStep}
          onMouseLeave={closePopup}
          onPaste={pasteSteps}
          onRemove={removeStep}
        />
      ))}
      {state.editable && (
        <button onClick={addStep}>
          {t('Recipe:AddStep')}
        </button>
      )}

      {popup.open && (
        <div className="stepList__popup" style={{ top: popup.top, left: popup.left }}>
          {popup.ingredient.amount}&nbsp;
          {popup.ingredient.unit}&nbsp;
          {popup.ingredient.name}
        </div>
      )}
    </div>
  );
}

export default StepList;
