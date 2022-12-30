import View from "./view";
import icons from "../../../img/icons.svg";

class ResultsListView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `
      <li class="result__item d__flex ${
        this._data.id === id ? "result__item-active" : ""
      }">
        <a class="result__item-link reset__link" href="#${this._data.id}">
          <div class="result__img">
          <img src="${this.convertHttpToHttps()}" alt="${this._data.title}">
          </div>
          <div class="result__description">
            <h4 class="result__name upper">${this._data.title}</h4>
            <p class="upper">${this._data.publisher}</p>
          </div>
          <div class="upload__recipe d__flex-c ${
            this._data.key ? "" : "hidden"
          }">
            <svg class="upload__recipe-icon">
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsListView();
