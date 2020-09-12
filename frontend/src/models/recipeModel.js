class RecipeModel {
  constructor() {
    this.name = '';
    this.description = '';
    this.time = '';
    this.steps = [];
    this.ingredients = [];
    this.images = [];
    this.draft = true;
    this.defaultPortions = 4;
    this.lastUpdate = '';
  }
}

export default RecipeModel;
