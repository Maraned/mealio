import './stepList.css';

import React, { useContext, useState } from 'react';
import cc from 'classcat';

import { RecipeContext } from 'contexts/recipe';
import { EditableContext } from 'contexts/editable';
import { UserContext } from 'contexts/user';

import Step from 'components/stepList/Step';

import { useTranslation } from 'react-i18next';

const StepList = () => {
  const { state } = useContext(EditableContext);
  const { state: user } = useContext(UserContext);
  const { state: recipe, dispatch: updateRecipe } = useContext(RecipeContext);
  const { t } = useTranslation();

  const [popup, setPopup] = useState({
    open: false,
    ingredient: false,
  });

  const { steps, ingredients } = recipe;

  const author = {
    id: user.id,
    name: user.displayName
  };

  const updateStep = (index, step) => {
    const modifiedSteps = JSON.parse(JSON.stringify(steps));
    modifiedSteps[index] = step;
    updateRecipe({ type: 'update', value: { steps: modifiedSteps, author }});
  }

  const addStep = () => {
    const modifiedSteps = JSON.parse(JSON.stringify(steps));
    modifiedSteps.push({ text: '' });
    updateRecipe({ type: 'update', value: { steps: modifiedSteps, author }});
  }

  const updateSteps = updatedSteps => {
    updateRecipe({ type: 'update', value: { steps: updatedSteps, author }});
  }

  const removeStep = (step, index) => {
    const modifiedSteps = [...steps];
    modifiedSteps.splice(index, 1);
    updateRecipe({ type: 'update', value: { steps: modifiedSteps, author }});
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
    const lines = stepText.split('\n').map(text => ({ text, indentation: 0 }));
    if (lines.length) {
      const stepToRemove = steps.length - 1;
      const modifiedSteps = [...ingredients];
      modifiedSteps.splice(stepToRemove, 1);
      const newSteps = [...modifiedSteps, ...lines];
      updateSteps(newSteps);
    }
  };

  return (
    <div
      className={cc(['stepList list listSpacing background', {
        'stepList--editMode': state.editable
      }])}
    >
      <h4>{t('Recipe:Steps')}</h4>
      {steps && steps.map((step, index) => (
        <Step
          key={'step' + index}
          updateStep={updateStep}
          index={index}
          step={{...step}}
          ingredients={ingredients}
          onMouseOver={hoverStep}
          onMouseLeave={closePopup}
          onPaste={parseStepText}
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
