import {Component, OnDestroy, OnInit} from "@angular/core";
import {RecipeService} from "../recipes/recipe.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;

  constructor(private recipeService: RecipeService, private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(user);
      console.log(!!user);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.recipeService.saveRecipes();
  }

  onFetchRecipes() {
    this.recipeService.fetchRecipes().subscribe();
  }

  onLogOut() {
    this.authService.logout();
  }
}
