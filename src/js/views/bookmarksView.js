import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

// El flujo es el siguiente, cuando desde algun archivo se llame a BookmarksView.render, obviamente este metodo no va a estar aca, asi que se va a buscar en el prototipo heredado de View.js, este render() recibe toda la data, y recordar que la almacena en _DATA y View.js procede a llamar a _generateMarkUp(), es decir, a la funcion que tengo aca dentro de BookmarksView, y obviamente tengo acceso a _data que se creo en View.js y la hereda esta class, y por cada resultado encontrado, procedo a llamar a previewView.render() enviandole el nuevo array de elementos creado por el MAP. Y PreviewView nuevamente no tiene render, asi que lo busca en View.js, quien repite el proceso de almacenar todo en _data, y llamar a _generateMarkUp(), que va a ser la _generateMarkUp() que tengo en PreviewView.js, y dentro de ella es donde se crea el markup del html de las recetas.
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'Todavia no agregaste ningun juego a favoritos 😋';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
