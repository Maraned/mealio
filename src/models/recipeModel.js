// const RecipeModel = {
//   name: '',
//   description: '',
//   time: '',
//   portions: '',
//   steps: [],
//   ingredients: [],
// }

const ing1 = { amount: 15,  unit: 'dl', name: 'mjölk' }
const ing2 = { amount: 5,  unit: 'koppar', name: 'socker' }
const ing3 = { amount: 7,  unit: 'kg', name: 'mjöl' }
const ing4 = { amount: 2,  unit: 'st', name: 'ägg' }

const step1 = { 
  text: 'Blanda mjöl, ägg och socker tillsammans. Låt stå i 5 minuter.', 
  indentation: 0,
  showNumber: true,
};
const step2 = { 
  text: 'Tillsätt mjölk lite i taget tills det blir en jämn smet. Låt stå i 1 timme.', 
  indentation: 1,
  showNumber: false,
};
const step3 = { 
  text: 'Häll över i ugnfast form och ställ in i ugnen på 180 grader. Låt var inne i 5 sekunder.', 
  indentation: 2 ,
  showNumber: true,
};

const description = 'Denna goda sockerkaka är riktigt underbar, speciellt tillsammans med grädde och bär.';


const RecipeModel = {
  name: 'Sockerkaka',
  description,
  time: '30 min',
  steps: [step1, step2, step3],
  ingredients: [ing1, ing2, ing3, ing4],
  images: [], 
}

export default RecipeModel;
