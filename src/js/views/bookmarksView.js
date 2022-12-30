import View from "./ParentViews/view";
import resultsListsView from "./ParentViews/resultsListsView";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__popup .results__list");
  _succesMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";

  addHandlerBookmarksLocal(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => resultsListsView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
