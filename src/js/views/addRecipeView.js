import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  //Elements
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');
  _uploadBtn = document.querySelector('.upload__btn');
  _window = document.querySelector('.add-recipe-window');

  //Other
  _data;
  _message = 'Recipe was successfully uploaded :)!';
  _errorMessage = 'Something went wrong with proccessing your recipe :(!';

  constructor() {
    super();
    this._addHandlerToggleForm();
  }

  addHandlerGetFormData(handler) {
    //Adds event listener to the form submit button and then calls the handler function with the data grabbed from the form inputs
    this._uploadBtn.addEventListener('click', e => {
      e.preventDefault();

      //new FormData is a javascript api that grabs input values from a form based on the passed in html element from which we can store in an array, but the array returns this for example [inputName, inputValue] for each input
      const dataArray = [...new FormData(this._parentElement)];

      //Here we us Object.fromEntries() and pass in the data array that we got which contains mini array like this [inputName, inputValue], from which object.fromentries() then converts into an object!
      const data = Object.fromEntries(dataArray);

      handler(data);
    });
  }

  _addHandlerToggleForm() {
    //Adds event listeners to all buttons
    [this._overlay, this._addRecipeBtn, this._closeModalBtn].forEach(el =>
      el.addEventListener('click', () => this.toggleVisibility())
    );
  }

  toggleVisibility(hide = false) {
    hide
      ? (this._overlay.classList.add('hidden'),
        this._window.classList.add('hidden'))
      : (this._overlay.classList.toggle('hidden'),
        this._window.classList.toggle('hidden'));
  }
}

export default new AddRecipeView();
