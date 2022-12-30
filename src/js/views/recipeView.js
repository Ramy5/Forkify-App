import View from "./ParentViews/view";
import icons from "url:../../img/icons.svg";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";
  _succesMessage =
    "Start by searching for a recipe of an ingredient. Have fun!";

  // PUBLISHER SUBSCRIBER DESIGN PATTERN (PUBLISHER)
  addHandleRender(handler) {
    window.addEventListener("hashchange", () => {
      handler();
      this.moveToRecipeHandler();
    });

    window.addEventListener("load", () => handler());
  }

  moveToRecipeHandler() {
    this._parentElement.scrollIntoView({ behavior: "smooth" });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", (e) => {
      // TARGET BTN
      const servingsBtn = e.target.closest(".update__serving");
      if (!servingsBtn) return;

      // GET DATA ATTRIBUTE TO KNOW THE NEW SERVING COUNT
      const { servingsCount } = servingsBtn.dataset;
      if (+servingsCount > 0) handler(+servingsCount);
    });
  }

  addHandlerBookmarks(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const iconTarget = e.target.closest(".serving__bookmark");
      if (!iconTarget) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
      <div class="recipe__img">
        <img src="${this.convertHttpToHttps()}" alt="${
      this._data.title
    }" srcset="">
        <h2 class="recipe__name">
          <span>${this._data.title}</span>
        </h2>
      </div>

      <div class="recipe__serving d__flex-bt">
        <div class="serving d__flex-bt">
          <div class="serving__time d__flex-c">
            <svg class="clock__icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <p class="time upper"><span>${
              this._data.cookingTime
            }</span> minutes</p>
          </div>
          <div class="serving__count d__flex-c">
            <svg class="user__icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <p class="upper count">${this._data.servings} servings</p>
            <div class="operations__icon d__flex-c">
              <svg class="minus__icon update__serving" data-servings-count=${
                this._data.servings - 1
              }>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
              <svg class="plus__icon update__serving" data-servings-count=${
                this._data.servings + 1
              }>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </div>
          </div>
        </div>

        <div class="d__flex">
          <div class="upload__recipe d__flex-c ${
            this._data.key ? "" : "hidden"
          }">
            <svg class="upload__recipe-icon">
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <div class="serving__bookmark d__flex-c">
            <svg class="serving__bookmark-icon">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
            </svg>
          </div>
        </div>
      </div>

    <!-- INGREDIENTS -->
    <div class="recipe__ingredient">
      <h3 class="ingredient__title upper">recipe ingredients</h3>
      <ul class="ingredient__list un-list">
        ${this._data.ingredients.map(this._renderIngredientMarkup).join("")}
      </ul>
    </div>

    <!-- HOW TO COOK IT -->
    <div class="origin__recipe d__flex-bt">
      <h2 class="origin__recipe--title upper">How to cook it</h2>
      <p>This recipe was carefully designed and tasted by <span>BBC Good Food.</span> Please check out directions
        attheir website.</p>
      <button class="origin__recipe--btn btn upper">
        <a class="reset__link d__flex-c" href="${
          this._data.sourceUrl
        }" target="_blank">directions
          <svg class="origin__recipe--icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </button>
    </div>
    `;
  }

  _renderIngredientMarkup(ing) {
    return `
      <li class="ingredient__item">
        <svg class="check-icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="ingredient__quantity">${
          ing.quantity ? ing.quantity : ""
        }</div>
        <div class="ingredient__description"><span>${ing.unit} ${
      ing.description
    }</div>
      </li>`;
  }
}

export default new RecipeView();
