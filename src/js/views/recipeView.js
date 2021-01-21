//Importing icons so that they load when we change our html in the live build, so javascript uses the proper url to the folder used in the dist. so basically replace old links in html markup with this icons import
import icons from 'url:../../img/icons.svg'; // Parcel 2
import { Fraction } from 'fractional';

import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _data;
  _errorMessage = 'We could not find that recipe :(, please try again!';

  _generateHTML() {
    //Destructuring data object
    const {
      title,
      publisher,
      sourceUrl,
      image,
      servings,
      cookingTime,
      ingredientsForServings,
      bookmarked,
      key,
    } = this._data;

    //HTML string
    return `<figure class="recipe__fig">
     <img src="${image}" alt="${title}" class="recipe__img" />
     <h1 class="recipe__title">
       <span>${title}</span>
     </h1>
    </figure>
    
    <div class="recipe__details">
     <div class="recipe__info">
       <svg class="recipe__info-icon">
         <use href="${icons}#icon-clock"></use>
       </svg>
       <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
       <span class="recipe__info-text">minutes</span>
     </div>
     <div class="recipe__info">
       <svg class="recipe__info-icon">
         <use href="${icons}#icon-users"></use>
       </svg>
       <span class="recipe__info-data recipe__info-data--people">${servings}</span>
       <span class="recipe__info-text">servings</span>
    
       <div class="recipe__info-buttons">
         <button data-servings="${
           servings - 1
         }" class="btn--tiny btn--decrease-servings">
           <svg>
             <use href="${icons}#icon-minus-circle"></use>
           </svg>
         </button>
         <button data-servings="${
           servings + 1
         }" class="btn--tiny btn--increase-servings">
           <svg>
             <use href="${icons}#icon-plus-circle"></use>
           </svg>
         </button>
       </div>
     </div>
    
    <div class="recipe__user-generated ${key ? '' : 'hidden'}">
       <svg>
         <use href="${icons}#icon-user"></use>
       </svg>
     </div>
     <button class="btn--round btn--bookmark">
       <svg class="">
         <use class="bookmark--icon" href="${
           !bookmarked
             ? `${icons}#icon-bookmark`
             : `${icons}#icon-bookmark-fill`
         }"></use>
       </svg>
     </button>
    </div>
    
    <div class="recipe__ingredients">
     <h2 class="heading--2">Recipe ingredients</h2>
     <ul class="recipe__ingredient-list">
     
       ${this._generateIngredientMarkup(ingredientsForServings)}
     </ul>
    </div>
    
    <div class="recipe__directions">
     <h2 class="heading--2">How to cook it</h2>
     <p class="recipe__directions-text">
       This recipe was carefully designed and tested by
       <span class="recipe__publisher">${publisher}</span>. Please check out
       directions at their website.
     </p>
     <a
       class="btn--small recipe__btn"
       href="${sourceUrl}"
       target="_blank"
     >
       <span>Directions</span>
       <svg class="search__icon">
         <use href="${icons}#icon-arrow-right"></use>
       </svg>
     </a>
    </div>`;
  }

  _generateIngredientMarkup(ingredients) {
    //looping over all ingredients and creating html for each ingredient and maping them all to an array where we then join all the strings together for an html string
    return ingredients
      .map(ing => {
        return `<li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity ? new Fraction(ing.quantity).toString() : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit ? ing.unit : ''}</span>
              ${ing.description}
            </div>
          </li>`;
      })
      .join('');
  }

  addHandlerRender(recipesHandler) {
    //Storing events we want to handle in an array and then looping over that array and adding the event listeners to the window object, makes you have to write less duplicate code
    ['hashchange', 'load'].forEach(event => {
      window.addEventListener(event, e => {
        //Gets the id of the recipe from the hash
        let id = e.currentTarget.location.hash.split('#')[1];

        //If the id doesnt exist then return the function
        if (!id) return;

        recipesHandler(id);
      });
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      //Select the servings button clicked
      const btn = e.target.closest('.btn--tiny');

      //If the button doesnt exist of the amount of servings is less than or equal to 0 then return the function
      if (!btn || +btn.dataset.servings <= 0) return;

      handler(+btn.dataset.servings);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('.btn--bookmark')) handler();
    });
  }
}

//Export new class so you dont have to define it in the controller
export default new RecipeView();
