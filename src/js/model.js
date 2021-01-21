import { async } from 'regenerator-runtime';
import { API_URL, KEY, RECIPIES_PER_PAGE } from './config.js';
import { makeRequest, getBookmarks, setBookmarks } from './helpers.js';
import addRecipeView from './views/addRecipeView.js';

export const state = {
  recipe: {},
  results: {
    searchResults: [],
    startingIndex: 0,
    endingIndex: 9,
  },
  pagination: {
    curPage: 1,
    totalPages: 1,
  },
};

//-----EXPORTED HELPER FUNCTIONS-----\\

export const getRecipeDetails = async function (id) {
  //Function basically fetches specific data for a recipe
  try {
    const url = `${API_URL}/${id}?key=${KEY}`;

    //Fetch recipe data from api
    let {
      data: { recipe },
    } = await makeRequest(url);

    //Re-names variable names in the recipe that we load and changes state recipe
    state.recipe = formatRecipe(recipe);

    //Checks if the current recipe data is stored in local storage, if it is then the current data's bookmarked attribute is set to true
    if (
      getBookmarks().some(b =>
        b.id === id
          ? (state.recipe.bookmarked = true)
          : (state.recipe.bookmarked = false)
      )
    );

    console.log(state.recipe);

    //Store original ingredient amount of recipe for future use of re-calculating the servings
    state.originalIngredients = recipe.ingredients;
  } catch (err) {
    throw err;
  }
};

export const getSearchResults = async function (input) {
  try {
    const url = `${API_URL}?search=${input}&key=${KEY}`;

    //Getting recipes in json format
    let {
      data: { recipes: results },
    } = await makeRequest(url);

    //Sets data in state object
    state.results.searchResults = results;
    state.pagination.curPage = 1;

    //Re-calculates/calculates the total pages
    calcPages();

    //Re-calculates the starting and ending indexes at which the view will loop over the search results to display certain recipes on certain pages
    calcPageIndexes();

    //If there are no search results throw an new error
    if (results.length === 0) throw new Error('No search results found');
  } catch (err) {
    throw err;
  }
};

export const goToPage = function (page) {
  //Sets current page to specified page
  state.pagination.curPage = page;

  //Re-calculates the indexes at which we want the specified recipe previews to be displayed based on the current page
  calcPageIndexes();
};

export const updateServings = function (servings) {
  //Sets state servings value to the specified value
  state.recipe.servings = servings;

  //Calculates ingredients based off current servings
  calcIngredients();
};

export const checkBookmark = function () {
  //Grabs current bookmarks stored in local storage
  let bookmarks = getBookmarks();

  //Changes the status of the bookmarked attribute on the current recipe
  state.recipe.bookmarked = !state.recipe.bookmarked;

  //Adds recipe to bookmarks array if its not bookmarked, if its already bookmarked then we want to unbookmark it and remove it from the bookmarks array
  state.recipe.bookmarked
    ? (bookmarks.push(state.recipe), setBookmarks(bookmarks))
    : unBookmarkRecipe();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.activateSpinner();

    const ingredients = formatIngredients(newRecipe);

    newRecipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const {
      data: { recipe },
    } = await makeRequest(`${API_URL}?key=${KEY}`, newRecipe);

    state.recipe = formatRecipe(recipe);
  } catch (err) {
    throw err;
  }
};

//-----PRIVATE HELPER FUNCTIONS-----\\

const formatRecipe = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredientsForServings: recipe.ingredients,
    originalIngredients: recipe.ingredients,
    bookmarked: false,

    //The && operator short circuts, so if the condition is false,
    //nothing happens, but if its true, the second part of the operator
    //is executed then returned, so the specified object is returned,
    //which we then spread to put the values key: recipe.key into the
    //actual object itself
    ...(recipe.key && { key: recipe.key }),
  };
};

const formatIngredients = function (recipe) {
  try {
    const ingredients = Object.entries(recipe).filter(
      ([key, value]) => key.includes('ingredient') && value !== ''
    );

    return ingredients.map(([key, value]) => {
      const ingArr = value.split(',').map(el => el.trim());

      if (ingArr.length !== 3)
        throw new Error(
          'Wrong ingredient format, please use correct format :)!'
        );

      const [quantity, unit, description] = ingArr;
      return {
        quantity: quantity ? +quantity : null,
        unit,
        description,
      };
    });
  } catch (err) {
    throw err;
  }
};

const unBookmarkRecipe = function () {
  let newBookmarks = getBookmarks().filter(recipe => {
    if (recipe.id !== state.recipe.id) return recipe;
  });

  setBookmarks(newBookmarks);
};

const calcIngredients = function () {
  //Calculates the ingredients in a recipe based on how many servings the user wants to make out of that recipe
  state.recipe.ingredientsForServings = state.recipe.originalIngredients.map(
    ing => {
      let { quantity, unit, description } = ing;
      return {
        quantity: (quantity * state.recipe.servings) / 4,
        unit: unit,
        description: description,
      };
    }
  );
};

const calcPageIndexes = function () {
  //Calculates starting index and ending index of recipes array based on the current page and amount of recipes you want to show per page
  state.results.startingIndex =
    state.pagination.curPage * RECIPIES_PER_PAGE - RECIPIES_PER_PAGE;
  state.results.endingIndex = state.pagination.curPage * RECIPIES_PER_PAGE;
};

const calcPages = function () {
  //Basically if the length of the search results is larger than the total results that can be displayed on a page, then it wil calculate how many pages will be made based off how many recipes there are, else the total pages is just 1
  state.pagination.totalPages =
    state.results.searchResults.length > RECIPIES_PER_PAGE
      ? state.results.searchResults.length / RECIPIES_PER_PAGE
      : 1;
};
