import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
// Importo esta view, para que se ejecute el codigo que hay dentro cuando cargue la pagina
import addRecipeView from './views/AddRecipeView.js';

import 'core-js/stable'; // Para pasar a es5 las variables, arrow functions, etc
import 'regenerator-runtime/runtime'; // Para pasar el async/await a es5
import { async } from 'regenerator-runtime';

// Para que parcel no recargue la pagina cada vez que guardo algo
/*
if (module.hot) {
  module.hot.accept();
*/

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    // Obtengo del url el hash y procedo a sacarle a este el #
    const idString = window.location.hash.slice(1);

    // Lo paso a numero ya que en model.js donde llamo a loadRecipe si le mando el id sin pasar a numero va a ser una string, y no puedo comparar una string con un numero a la hora de verificar si el juego esta marcado como favorito en el state de bookmarked que contiene el ID en numero del juego
    const id = Number(idString);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Al hacerle click a una receta, se ejecuta controlRecipes, asi que procedo a lanzar este metodo, que se ejecuta en View.js, y que termina en _generateMarkUpPreview dentro de resultsView.js, donde se actualiza la class de la receta a la que le hice click, de esa forma queda seleccionada.
    resultsView.update(model.getSearchResultsPage());

    // 1) Procedo a llamar a update sobre la view de bookmark, para que cuando este renderizando una receta y le haga bookmark, al fijarme los bookmark, va a estar coloreada la receta que tengo renderizada (la que estoy viendo sus ingredientes, etc)
    bookmarksView.update(model.state.bookmarks);

    // 2) Cargando recipiente
    await model.loadRecipe(id);

    // 3) Renderizando recipiente
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Obtengo el query del url
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Obtengo las recetas de la busqueda
    await model.loadSearchResults(query);

    // 3) Renderizo las recetas
    resultsView.render(model.getSearchResultsPage());

    // 4) Renderizo la paginacion
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

// Para actualizar la paginacion tras hacer click a un boton, simplemente llamo a la funcion que renderiza las recetas al pasar de pagina, y a la funcion que renderiza los nuevos botones de paginacion.
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

// Al hacer click a bookmark, esta funcion se encarga de verificar primero si la receta que me encuentro renderizando y que esta en el state. Si tiene false en bookmarked(if), llamo a la funcion que modifica ese valor en el state a true, caso contrario, lo pasa a false. Y finalmente actualiza el dom con el boton de bookmark actualizado.
const controlAddBookmark = function () {
  // 1) Coloco false/true en el state de bookmark de la receta
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // 2) Actualizo la UI mostrando el icono de bookmark relleno o vacio
  recipeView.update(model.state.recipe);

  // 3) Renderizo los bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Al terminar de cargar la pagina, se llama a esta funcion que se encarga de renderizar los bookmarks para que al pasar el mouse sobre BOOKMARKS, aparezcan.
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
