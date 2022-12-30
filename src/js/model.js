import { async } from "regenerator-runtime";
import { API_URL, KEY, RESULTS_PER_PAGE } from "./config";
import { ajax } from "./helpers";

/**
 * The state object to store all data, whole application depends on it.
 * 1) recipe object contains (holds) data that comes from loadRecipe function.
 * 2) search object contains (holds) the query that comes from input field when user search for
 * recipe, the results depends on that query, and also contains the current page of the results
 * and the number of results you want per page.
 * 3) bookmarks array contains all the bookmarks we choose (storing in it)
 * @constant
 * @type {object}
 */
export const state = {
  recipe: {},
  search: {
    query: [], // LATER WE CAN USE THIS TO KNOW THE MOST RECIPE WAS SEARCH FOR
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * loading results data from api depends on the query that user search for it.
 * @param {string} query the word that comes from input field.
 * @async
 * @return the data from api and stored it in search.results array.
 */
export const getSearchResults = async (query) => {
  try {
    // STORE QUERY
    state.search.query.push(query);

    // GET DATA FROM API
    const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`);

    // STORE DATA IN SEARCH.RESULTS ARRAY
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        img: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    // RESET NUMBER OF PAGE
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * function that split the results into multiple page and controll them by pagination
 * @param {number} the current page of results
 * @return just 10 results per page
 */
export const splittingResults = (page = state.search.page) => {
  // STORE PAGE IN STATE
  state.search.page = page;

  // SPLITTING RESULTS TO JUST 10 RESULTS PER PAGE
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

// CONVERT THE RECIPE THAT COME FROM API TO NORMAL JS FORMAT
const convertRecipeObject = (data) => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    img: recipe.image_url,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    title: recipe.title,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * loading data from api, edit data and store it in the recipe object in state.
 * @param {string} id the api url contains this id to get certain data.
 * @async
 * @return the data from the url and store it in recipe object
 */
export const loadRecipe = async (id) => {
  try {
    // GET DATA FROM API
    const data = await ajax(`${API_URL}${id}?key=${KEY}`);

    // ADD DATA TO RECIPE OBJECT IN THE STATE AFTER EDITING IT
    state.recipe = convertRecipeObject(data);

    // CHECK IF THERE ARE ANY RECIPE IN BOOKMARKS ARRAY WITH THE SAME ID OF THE CURRENT
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

/**
 * updating the quantity and the servings in the state
 * @param {number} newServing number of the new servings count
 */
export const updateServings = (newServing) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
};

// ADDING BOOKMARKS TO LOCAL STORAGE
const bookmarksToLocal = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * add recipe object to bookmarks array and marked it as bookmarked
 * @param {object} recipe
 */
export const addBookmarks = (recipe) => {
  // ADD CURRENT RECIPE AFTER CLICK ON ICON TO BOOKMARKS ARRAY
  state.bookmarks.push(recipe);

  // SET THIS RECIPE AS BOOKMARKED
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // ADD BOOKMARKS TO LOCAL STORAGE
  bookmarksToLocal();
};

/**
 * remove recipe object from bookmarks array and marked it as NOT bookmarked
 * @param {string} id recipe id
 */
export const deleteBookmarks = (id) => {
  // DELETE THE RECIPE AND REMOVE IT FROM BOOKMARKS ARRAY IF CLICK AGAIN ON ICON
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // SET THIS RECIPE AS NOT BOOKMARKED
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // ADD BOOKMARKS TO LOCAL STORAGE
  bookmarksToLocal();
};

// IF THERE ARE BOOKMARKS IN LOCAL STORAGE GET IT AND SET THE BOOKMARKS IN THE STATE TO IT
(() => {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
})();

// CLEAR ALL DATA IN THE STORAGE
const clearStorage = () => {
  localStorage.clear();
};
// clearStorage();

/**
 * Uploading new recipe object to api and store it to state
 * @param {object} newRecipe new recipe object
 */
export const uploadNewRecipe = async (newRecipe) => {
  try {
    // CONVERT RECIPE TO FORMAT THAT API RECOGNIZE IT
    const newRecipeData = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.img,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: newRecipe.ingredients,
    };

    // SEND RECIPE TO API
    const data = await ajax(`${API_URL}?key=${KEY}`, newRecipeData);

    // CONVERT BACK TO NORMAL RECIPE
    state.recipe = convertRecipeObject(data);

    // ADD RECIPE AGAIN TO BOOKMARK
    addBookmarks(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
