import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs/index";

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startingEditing = new Subject<number>();
  ingredients: Ingredient[] = [
    new Ingredient("Manzanas", 5),
    new Ingredient("Tomates", 3)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingr: Ingredient[]) {
    this.ingredients.push(...ingr);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
