import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentElement = '';

  // Aca obtengo el id del url para que cuando haga click a una receta. Obtengo el id, y al renderizarse las recetas, si el id almacenado en la variable, es igual al id de la receta que estoy renderizando, entonces le agrego la class que le da un color de seleccionado.
  _generateMarkUp() {
    const id = Number(window.location.hash.slice(1));

    return `
      <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.genres
            .map(genre => {
              return genre.name;
            })
            .join(', ')}</p>
        </div>
      </a>
    </li>
        `;
  }
}

export default new PreviewView();
