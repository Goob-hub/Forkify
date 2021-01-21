import icons from 'url:../../img/icons.svg'; // Parcel 2

//Parent class of all views, contains functions all views will use/need
export default class View {
  render(data) {
    //If the data doesnt exist or the data is an empty array render an error
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    //Sets data and generates/renders html
    this._data = data;
    let html = this._generateHTML();
    this._parentElement.innerHTML = html;
  }

  activateSpinner() {
    //Adds a loading spinner to the specified parent element
    this._parentElement.innerHTML = ` <div class="spinner">
           <svg>
             <use href="${icons}#icon-loader"></use>
           </svg>
         </div>`;
  }

  renderMessage(message = this._message) {
    //Renders error
    const html = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._parentElement.innerHTML = html;
  }

  renderError(msg = this._errorMessage) {
    //Renders error
    const html = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>`;

    this._parentElement.innerHTML = html;
  }

  update(data) {
    //If the data doesnt exist or the data is an empty array render an error
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    //Sets data and generates/renders html
    this._data = data;

    let newHtml = this._generateHTML();

    //Converts any string of html into basically a mini Document object!
    //So now instead of having this dom enviroment contained on
    //the page, it is now stored in memory!
    const newDOM = document.createRange().createContextualFragment(newHtml);

    //Using the newDOM object we created and using DOM methods on it
    //Such as querySelector all
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      let curEl = curElements[i];

      //Returns true or false depending on whether or not the selected
      //node is exactly equal to another node and also checks to see if
      //the first child elements nodeValue doesnt equal an empty string,
      //and the nodeValue property returns the textContent of a node
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        //Grabs all attributes on an element/node
        //Array.from(curEl.attributes)

        //Converts the object of attributes on the element into an array
        //and then loops over it
        Array.from(newEl.attributes).forEach(attr =>
          //Sets specified attribute of the current element to a
          //Specific value, in this case the value of the new elements
          //attribute
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
