import View from './View.js';
import previewView from './previewView.js';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _data;
  _errorMessage = 'No recipes found from your search, please try again.';

  _generateHTML() {
    //Maps all chuncks of html to an array then immediatly joins them together for one large html string

    //Slices the search results based on the starting and ending indexes
    //based on the current page then loops over those specified recipes
    //and generates html for them
    let recipesOnPage = this._data.searchResults.slice(
      this._data.startingIndex,
      this._data.endingIndex
    );

    return recipesOnPage
      .map(recipe => {
        return previewView.render(recipe);
      })
      .join('');
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', e => {
      let listItem = e.target
        .closest('.preview')
        .querySelector('.preview__link');

      if (listItem) {
        //Gets id of recipe from the href attribute of the preview link
        let id = listItem.href.split('#')[1];

        handler(id);
      }
    });
  }
}

export default new resultsView();
