import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, API_URL_GAME_DETAILS } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

// Aca uso && para hacer short circuit, es decir, si hay un field de key en la variable de recipe en este caso cuando busco recetas, no tengo el field de key, asi que da false y no pasa nada, pero, por ejemplo cuando creo una receta yo, entonces como no da false, && pasa a ejecutar la otra condicion, en este caso creo un objeto que tiene de field key y de valor la key recibida d ela receta creada, entonces uso spread para extraer este objeto, teniendo finalmente la propertie y su value.
const createRecipeObject = async function (data) {
  const game = data;
  const imagesResponse = await fetch(
    `https://api.rawg.io/api/games/${game.id}/screenshots`
  );
  const { results: images } = await imagesResponse.json();

  return {
    id: game.id,
    title: game.name,
    developers: game.developers,
    sourceUrl: game.metacritic_url,
    image: game.background_image,
    released: game.released,
    slug: game.slug,
    tags: game.tags,
    genres: game.genres,
    publishers: game.publishers,
    rating: game.rating,
    description: game.description_raw,
    images: images,
    video: game.clip ? game.clip.clip : '',
    stores: game.stores,
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL_GAME_DETAILS}${id}`);

    state.recipe = await createRecipeObject(data);
    // Verifico que si alguno de los bookmarks que tengo en el array de state.boorkmarks, tiene el id igual al id de la receta que estoy recibiendo en esta funcion que se encarga de renderizar los detalles de la receta. Y en este caso le actualizo a la receta que quiero renderizar, el field de bookmarked en el state, caso contrario le coloco false. De esa forma si le hago bookmarked a uno, selecciona otra receta y vuelvo a esa, se mantiene el boton de bookmarked coloreado.
    if (state.bookmarks.some(recipebookmarked => recipebookmarked.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error(`${error} 🧨🧨`);
    // Lanzo el error para que lo pueda atrapar por ejemplo en controlRecipes de controller.js, que es donde se llama a esta funcion
    throw error;
  }
};

// Aca uso && para hacer short circuit, es decir, si hay un field de key en la variable de recipe en este caso cuando busco recetas, no tengo el field de key, asi que da false y no pasa nada, pero, por ejemplo cuando creo una receta yo, entonces como no da false, && pasa a ejecutar la otra condicion, en este caso creo un objeto que tiene de field key y de valor la key recibida d ela receta creada, entonces uso spread para extraer este objeto, teniendo finalmente la propertie y su value. De esa forma en el renderizado de cada receta agrego el field de key para las recetas que sean propias asi renderiza el icono del usuario que depende de que esa key este en la preview de la receta
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}search=${query}`);
    state.search.results = data.results.map(game => {
      return {
        id: game.id,
        title: game.name,
        slug: game.slug,
        tags: game.tags,
        image: game.background_image,
        genres: game.genres,
      };
    });

    // Al buscar nuevos recetas, reseteo la page a 1, de esa forma siempre vuelvo a la pagina 1 de los resultados
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 🧨🧨`);
    throw error;
  }
};

// Aca es donde recibo la cantidad de items que quiero en base a la pagina que quiero ver de items, por ejemplo paso a la paginacion 2, entonces recibo el numero 2 en esta funcion. Y tengo dos variables, la primera le resta uno a page, queda en 1, 1 * 10 (state.search.resultsPerPage), me da 10, despues la otra variable es 2 * 10, 20. Entonces procedo a dar como retorno, los resultados de los ingredientes pero procedo a usar slice para recibir solo desde el item 10 hasta el 19, ya que slice no toma el ultimo item, osea el de 20. Y asi con todos, por ejemplo al primera pagina seria 1, entonces 1 - 1 = 0, 0 * 10 = 0, comienzo en 0, y termino en 1 * 10 = 10, pero recuerdo que el ultimo item no se toma, asi que seria del 0 al 9, como es en base al index, del 0 al 9 tengo 10 items. Serian 10 items por pagina.
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// Aca procedo a almacenar en localStorage el state de bookmarks, que es el array de items que les hice bookmark. Uso JSON.stringify pasa pasarlo de objeto de js a strings.
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // 1) Agrego el bookmark al array del state
  state.bookmarks.push(recipe);

  // 2) Marco la receta como bookmarked. Si el id de la receta recibida en esta funcion, es igual al id de la receta que me encuentro viendo y que almacene en el state. Entonces a esta receta en el state le agrego el field de bookmarked y le coloco TRUE.
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Si hago click de nuevo al boton de bookmark, procedo a eliminar la receta del de bookmark. Simplemente aca recibo el id de esa receta, procedo a conocer el index de esa receta en el array de bookmarks, usando findIndex, y esto loopea sobre el array bookmarks, dandome el index de la receta cuyo id, sea igual al id recibido en esta funcion. Y finalmente coloco que quiero eliminar del array de bookmarks usando SPLICE, y coloco el index del elemento que quiero eliminar y coloco que solo quiero eliminar 1 elemento, solo 1. Finalmente le cambio el valor de bookmarked a false, a la receta en el state simplemente chequeando si el id recibido es igual a la receta que se encuentra en el state actualmente (la que estoy renderizando)
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(
    recipebookmarked => recipebookmarked.id === id
  );
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Al iniciarse la aplicacion, llamo a esta funcion que recibe del state el item que almacene con las recetas almacenadas. Si existe el item. procedo a almacenarlo en una variable. Y despues procedo a hacer que en el state, en bookmarks, dentro este array va a tener como valor, el item que tiene los bookmarks, pero pasado nuevamente de string a un objeto js con JSON.parse()
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// SI QUIERO ELIMINAR TODOS LOS BOOKMARKS DE UNA, SIMPLEMENTE SACO ESTOS COMENTARIOS Y DEJO LA LLAMADA A "INIT", COMENTADA

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/*
clearBookmarks();
*/
