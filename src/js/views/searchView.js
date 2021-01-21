import View from './View.js';

class searchView extends View {
  _parentEL = document.querySelector('.search');
  _data;

  _getQuery() {
    const query = document.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEL.querySelector('.search__field').value = '';
  }

  addHandlerRender(handler) {
    this._parentEL.addEventListener('submit', async e => {
      e.preventDefault();

      handler(this._getQuery());
    });
  }
}

export default new searchView();
