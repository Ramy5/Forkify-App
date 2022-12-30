import View from "./ParentViews/view";
import resultsListsView from "./ParentViews/resultsListsView";

class ResultsView extends View {
  _parentElement = document.querySelector(".search__result .results__list");
  _errorMessage = "No recipes found for your query! Please try again ;)";

  _generateMarkup() {
    return this._data
      .map((result) => resultsListsView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
