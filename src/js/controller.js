import * as model from "./model.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import recipeView from "./views/recipeView.js";
import uploadRecipeView from "./views/uploadRecipeView.js";
import { CLOSE_UPLOAD_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

/**
 * Function that controlls search results, get query, load results from api and render it to page
 * @async
 * @author Ramy Sabry
 */
const controllSearchResults = async () => {
  try {
    // 1) RENDER SPINNER UNTILL GET DATA
    resultsView.renderSpinner();

    // 2) GET QUERY VALUE FROM INPUT FIELD IN SEARCH VIEW FILE
    const query = searchView.getQuery();
    if (!query)
      return resultsView.renderError(
        "Can't search for empty value! Please type something ;)"
      );

    // 3) LOAD SEARCH RESULTS DEPENDS ON QUERY
    await model.getSearchResults(query);

    // 4) RENDER SEARCH RESULTS IN PAGE
    resultsView.render(model.splittingResults());

    // 5) RENDER PAGINATION
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * rendring new results and new pagination depend on the next or previous number of the page
 * @param {number} goToPage the number of next or previous page to go to it.
 */
const controllPagination = (goToPage) => {
  // 1) RENDER NEW SEARCH RESULTS IN PAGE
  resultsView.render(model.splittingResults(goToPage));

  // 2) RENDER NEW PAGINATION
  paginationView.render(model.state.search);
};

/**
 * Function that controlls recipe, load recipe and render it to page
 * @async
 */
const controllRecipes = async () => {
  try {
    // GET ID FOR FETCH DATA IN LOAD RECIPE FUNCITON
    const id = window.location.hash.slice(1);
    if (!id) return;

    // RENDER SPINNER WHEN GET DATA
    recipeView.renderSpinner();

    // UPDATE RESULTS VIEW FOR SELECTING CURRENT RESULT ITEM
    resultsView.update(model.splittingResults());

    // UPDATE BOOKMARKS VIEW FOR SELECTING CURRENT RECIPE
    bookmarksView.update(model.state.bookmarks);

    // GET RECIPE DATA
    await model.loadRecipe(id);

    // PASS RECIPE DATA FROM MODEL TO RECIPEVIEW FILE
    recipeView.render(model.state.recipe);
  } catch (err) {
    // RENDER ERROR MESSAGE TO PAGE (ERROR COMES FROM MODEL)
    recipeView.renderError();
  }
};

/**
 * updating servings and rerender recipeView
 * @param {number} newServing number of the new servings count
 */
const controllUpdateServings = (newServing) => {
  // UPDATING THE SERVINGS COUNT IN THE STATE
  model.updateServings(newServing);

  // RENDER THE RECIPE VIEW WITH NEW SERVING COUNT
  recipeView.update(model.state.recipe);
};

/**
 * controll adding and deleting bookmark when click on icon
 */
const controllBookmarks = () => {
  // 1) ADDING AND REMOVING
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  // 2) UPDATING RECIPE VIEW AFTER CHANGE
  recipeView.update(model.state.recipe);

  // 3) RENDRING BOOKMARKS IN THEIR VIEW
  bookmarksView.render(model.state.bookmarks);

  // RENDER BOOKMARKS MESSAGE IF THERE ARE NO BOOKMARKS
  if (model.state.bookmarks.length === 0) bookmarksView.renderMessage();
};

/* RENDER BOOKMARKS ON PAGE LOAD SO THE UPDATE METHOD CAN COMPARE BETWEEN THIS._DATA AND THE NEW -- DATA OTHERWISE THE ERORR IS HAPPEN => CAN NOT READ TEXETCONTENT OF UNDEFIEND
 */
const controllBookmarksLocal = () => {
  bookmarksView.render(model.state.bookmarks);

  // RENDER BOOKMARKS MESSAGE IF THERE ARE NO BOOKMARKS
  if (model.state.bookmarks.length === 0) bookmarksView.renderMessage();
};

// CLOSE UPLOAD MODER AFTER UPLOADING NEW RECIPE
const closeUploadRecipeWindow = () => {
  setTimeout(() => {
    uploadRecipeView.addHandlerToggler();
    recipeView.moveToRecipeHandler();
  }, CLOSE_UPLOAD_SEC * 1000);
};

/**
 * render recipe view to our recipe, change the id in history page and rerender bookmarks
 * @param {object} newRecipeData data about our new recipe
 */
const controllUpload = async (newRecipeData) => {
  try {
    // 1) RENDER SPINNER UNTILL UPLOADING NEW RECIPE
    uploadRecipeView.renderSpinner();

    // 2) UPLOAD NEW RECIPE TO API
    await model.uploadNewRecipe(newRecipeData);

    // 3) CHANGE THE URL WITHOUT RELOAD PAGE
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // 4) RENDER MY NEW RECIPE IN VIEW
    recipeView.render(model.state.recipe);

    // 5) RENDER MY NEW RECIPE IN BOOKMARK VIEW
    bookmarksView.render(model.state.bookmarks);

    // 6) RENDER SUCCESSFUL MESSAGE
    uploadRecipeView.renderMessage();

    // 7) FINALLY CLOSE UPLOADING WINDOW AFTER FINISH
    closeUploadRecipeWindow();
  } catch (err) {
    console.log(err);
    uploadRecipeView.renderError(err.message);
    closeUploadRecipeWindow();
  }
};

// EVENTS AND FUNCTION THAT WILL HAPPEN ON PROGRAM START (INIT)
// IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION)
(() => {
  recipeView.renderMessage();
  bookmarksView.renderMessage();
  // SUBSCRIBER
  bookmarksView.addHandlerBookmarksLocal(controllBookmarksLocal);
  searchView.addSubmitHandler(controllSearchResults);
  paginationView.clickPaginationHandler(controllPagination);
  recipeView.addHandleRender(controllRecipes);
  recipeView.addHandlerUpdateServings(controllUpdateServings);
  recipeView.addHandlerBookmarks(controllBookmarks);
  uploadRecipeView._addHandlerUpload(controllUpload);
})();
