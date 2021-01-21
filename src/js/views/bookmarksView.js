import icons from 'url:../../img/icons.svg'; // Parcel 2
import { getBookmarks } from '../helpers.js';
import previewView from './previewView.js';
import View from './View.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _data;
  _errorMessage = `No bookmarks yet! Bookmark your favorite recipes for easy access!`;

  _generateHTML() {
    return this._data
      .map(recipe => {
        return previewView.render(recipe);
      })
      .join('');
  }

  addHandlerRendererLoad() {
    window.addEventListener('load', () => {
      this.render(getBookmarks());
    });
  }
}

export default new BookmarksView();
