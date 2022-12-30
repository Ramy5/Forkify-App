import icons from "../../../img/icons.svg";

export default class View {
  _data;

  render(data, isRender = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!isRender) return markup;

    this._insertMarkupToParent(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newMarkupElement = Array.from(newDom.querySelectorAll("*"));
    const currentMarkup = Array.from(this._parentElement.querySelectorAll("*"));

    newMarkupElement.forEach((newEl, i) => {
      const currEl = currentMarkup[i];

      // UPDATING TEXT
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        currEl.textContent = newEl.textContent;
      }

      // UPDATING ATTRIBUTES
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  convertHttpToHttps() {
    this._data.img.replace("http", "https");
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _insertMarkupToParent(markup) {
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner d__flex-c">
        <svg class="loading__icon">
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._insertMarkupToParent(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="recipe__message d__flex">
        <svg class="error__icon">
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        <p>${message}</p>
      </div>
    `;
    this._insertMarkupToParent(markup);
  }

  renderMessage(message = this._succesMessage) {
    const markup = `
      <div class="recipe__message d__flex">
        <svg class="smile__icon">
          <use href="${icons}#icon-smile"></use>
        </svg>
        <p>${message}</p>
      </div>
    `;
    this._insertMarkupToParent(markup);
  }
}
