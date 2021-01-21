import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;

  _generateHTML() {
    //Destructures data object
    let { curPage, totalPages } = this._data;

    return `${
      //If current page doesnt = 1 then show this pagination button
      curPage !== 1
        ? `<button data-goto="${
            curPage - 1
          }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`
        : ''
    }
      ${
        //If the current page is not greater than the total pages then display this pagination button
        curPage < totalPages
          ? `<button data-goto="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`
          : ''
      }
      `;
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', e => {
      //Select the pagination button that was clicked
      let btn = e.target.closest('.btn--inline');

      //If there was no pagination button clicked then return the function
      if (!btn) return;

      //Call the handler function with the specified page we want to go to
      handler(+btn.dataset.goto);
    });
  }
}

export default new PaginationView();
