// import icons from '..img/icons.svg'; // Parcel 1
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//Support for older browsers
import 'core-js/stable'; //Pollyfilling everything else
import 'regenerator-runtime/runtime'; //Pollyfilling async await
import { async } from 'regenerator-runtime/runtime';
import { getBookmarks } from './helpers.js';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipePreviews = function () {
  //Renders search results
  resultsView.render(model.state.results);

  //Renders the pagination
  paginationView.render(model.state.pagination);
};

const controlRecipes = async function (id) {
  try {
    recipeView.activateSpinner();

    //Fetch recipe data

    await model.getRecipeDetails(id);

    //Update the bookmarks ui link to see if the current selected
    //recipe is in the bookmarked tab and add the active class to that
    //too
    bookmarksView.update(getBookmarks());

    //Render recipe
    recipeView.render(model.state.recipe);

    //Updates the resultsView so that it can set the active class on
    //The selected recipe from the results
    resultsView.render(model.state.results);
  } catch (err) {
    //Renders error in recipe section
    recipeView.renderError();
  }
};

const controlSearch = async function (value) {
  try {
    //Activates spinner on results
    resultsView.activateSpinner();

    //Awaits the serch results from the query
    await model.getSearchResults(value);

    //Displays recipe previews based on search results
    controlRecipePreviews();
  } catch (err) {
    //Renders current search results which is nothing because of an error so that the previously loaded in previews are gone
    controlRecipePreviews();

    //Renders error in results section
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  //Goes to specified page
  model.goToPage(page);

  //Displays recipe previews
  controlRecipePreviews();
};

const controlServings = function (servings) {
  //Sets servings based on specified value
  model.updateServings(servings);

  //Re-renders recipe with updated servings
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  //Checks if the current recipe is bookmarked or not and then either bookmarks the recipe or unbookmarks it
  model.checkBookmark();

  //Renders the bookmarks array in local storage
  bookmarksView.render(getBookmarks());

  //Renders the current recipe again to update the bookmark icon
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Bookmark recipe
    controlBookmarks();

    // Success message
    addRecipeView.renderMessage();

    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(() => {
      addRecipeView.toggleVisibility(true);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);

  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerBookmark(controlBookmarks);

  searchView.addHandlerRender(controlSearch);

  resultsView.addHandlerRender(controlRecipes);

  paginationView.addHandlerRender(controlPagination);

  bookmarksView.render(model.state.bookmarks);

  bookmarksView.addHandlerRendererLoad(controlBookmarks);

  addRecipeView.addHandlerGetFormData(controlAddRecipe);
};

init();

// const a = [];
// const b = [];

// const c = 34;
// const d = 34;

// console.log(a === b);
// console.log(a === a);
// console.log(c === d);
