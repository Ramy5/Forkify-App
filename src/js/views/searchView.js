class SearchView {
  _parentElement = document.querySelector(".nav__form");

  getQuery() {
    const queryValue = this._parentElement.querySelector(".search").value;
    this._clearInput();
    return queryValue;
  }

  _clearInput() {
    this._parentElement.querySelector(".search").value = "";
  }

  addSubmitHandler(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
