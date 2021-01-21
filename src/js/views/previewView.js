import icons from 'url:../../img/icons.svg'; // Parcel 2

class PreviewView {
  //Handles the functionality that the results and bookmarks view had
  //in common so that they could both use this function to save us
  //from writing duplicate code effectivly using the DRY principal
  render(recipe) {
    const { id, title, publisher, key } = recipe;
    const curRecipeId = window.location.hash.split('#')[1];

    return `<li class="preview">
     <a class="preview__link ${
       curRecipeId === id ? 'preview__link--active' : ''
     }" href="#${id}">
       <figure class="preview__fig">
         <img src="${
           recipe.image_url ? recipe.image_url : recipe.image
         }" alt="Test" />
       </figure>
       <div class="preview__data">
         <h4 class="preview__title">${title}</h4>
         <p class="preview__publisher">${publisher}</p>
         <div class="preview__user-generated ${key ? '' : 'hidden'}">
            <svg>
                <use href="${icons}#icon-user"></use>
            </svg>
          </div>
       </div>

     </a>
   </li>`;
  }
}

export default new PreviewView();
