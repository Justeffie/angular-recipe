import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list-service";
import {Subject} from "rxjs/index";
import {exhaustMap, map, take, tap} from "rxjs/internal/operators";
import {AuthService} from "../auth/auth.service";


@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();
  //private recipes: Recipe[];
  private recipes: Recipe[] = [
    new Recipe(
      'Test',
      'Descripción test',
      'https://www.recetasdesbieta.com/wp-content/uploads/2019/01/tortitas-caseras-receta-1-860x380.jpg',
      [ new Ingredient('Ingrediente test', 1),
      new Ingredient('Ingrediente test2', 2) ]),
    new Recipe(
      'Test 2',
      'Descripcion test 2',
      'https://www.recetasdesbieta.com/wp-content/uploads/2019/01/tortitas-caseras-receta-1-860x380.jpg',
      [ new Ingredient('Ingrediente test3', 3),
      new Ingredient('Ingrediente test4', 4)]),
  ];

  constructor(private shoppingListService: ShoppingListService, private http: HttpClient, private authService: AuthService) {}

  saveRecipes() {
    const recipes = this.getRecipes();
    this.http.put('https://recipe-book-26654.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://recipe-book-26654.firebaseio.com/recipes.json?')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.setRecipes(recipes);
      }))
  }


  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToSL(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }


}
