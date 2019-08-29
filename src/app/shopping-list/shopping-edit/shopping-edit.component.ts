import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list-service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) formulario: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemNumber: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startingEditing.subscribe(
      (index: number) => {
        this.editedItemNumber = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.formulario.setValue({name: this.editedItem.name, amount: this.editedItem.amount});
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(formulario: NgForm) {
    const value = formulario.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemNumber, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
  }

  onResetForm() {
    this.formulario.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.onResetForm();
    this.shoppingListService.deleteIngredient(this.editedItemNumber);
  }
}
