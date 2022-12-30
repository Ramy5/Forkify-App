import icons from "url:../../img/icons.svg";
import View from "./ParentViews/view";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  _currentPage;
  _pageCounts;

  clickPaginationHandler(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const paginationBtn = e.target.closest(".pagination__btn");
      if (!paginationBtn) return;

      const goToPage = +paginationBtn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._currentPage = this._data.page;
    this._pageCounts = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1) ONE PAGE, AND THERE ARE OTHER PAGES
    if (this._currentPage === 1 && this._pageCounts > 1) {
      return `
        ${this._numberOfPages()}
        ${this._generatePaginationNext()}
      `;
    }

    // 2) LAST PAGE
    if (this._currentPage === this._pageCounts && this._pageCounts > 1) {
      return `
        ${this._generatePaginationPrevious()}
        ${this._numberOfPages()}
      `;
    }

    // 3) OTHER PAGES
    if (this._currentPage > 1) {
      return `
        ${this._generatePaginationPrevious()}
        ${this._numberOfPages()}
        ${this._generatePaginationNext()}
      `;
    }

    // 4) ONE PAGE, AND THERE ARE NO OTHER PAGES
    return "";
  }

  _numberOfPages() {
    return `<span class="curr__page d__flex-c">${this._pageCounts}</span>`;
  }

  _generatePaginationPrevious() {
    return `
      <button class="pagination__btn btn__previous d__flex-c" data-goto=${
        this._currentPage - 1
      }>
        <svg class="pagination__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._currentPage - 1}</span>
      </button>
    `;
  }

  _generatePaginationNext() {
    return `
      <button class="pagination__btn btn__next d__flex-c" data-goto=${
        this._currentPage + 1
      }>
        <span>Page ${this._currentPage + 1}</span>
        <svg class="pagination__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();
