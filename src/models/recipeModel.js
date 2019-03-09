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
const ing3 = { amount: 2,  unit: 'kg', name: 'mjöl' }


const RecipeModel = {
  name: 'Sockerkaka',
  description: '',
  time: '',
  portions: '',
  steps: [],
  ingredients: [ing1, ing2, ing3],
}

export default RecipeModel;
