import View from './View.js';
// import icons from '../img/icons.svg'; // Parcel 1
// Parcel 2, para archivos estaticos como imagenes, videos, etc. Esto me da basicamente el url que me da parcel del nuevo archivo de los iconos dentro de dist
import icons from 'url:../../img/icons.svg';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage =
    "We couldn't find the recipe that you are looking for. Please try another one!";
  _message = '';

  // Esta funcion que es llamada desde controller.js con init(), lo que hace es recibir la funcion de controlRecipes que es la que renderiza el recipiente con toda la informacion. La idea es crear dos event listeners que esten atentos a por ejemplo cuando hago click a una receta. Al hacer click, este anchor tag, coloco un id en el url en formato por ejemplo "#gtge3f3f", entonces para detectar ese cambio en el url, escucho al evento de hashchange, una vez cambia el url, detecto eso, y procedo a llamar a la funcion que recibo aca de controlRecipes(), que la llamo y renderiza la nueva receta. Pero tambien escucho al LOAD de la pagina, ya que por ejemplo yo copio y pego el url de una receta, por ejemplo con el hash ya puesto, y cierro la pestana. Cuando ingrese, no se va a renderizar la receta. Ya que el hash no cambio, es el mismo que busque antes, entonces procedo a escuchar al evento de cuando termine de cargar la pagina, para que nuevamente llame a la funcion que renderiza la receta, sin importar que sea la misma.
  addHandlerRender(handler) {
    // Esto es igual a lo de abajo
    /*
      window.addEventListener('hashchange', showRecipe);
      window.addEventListener('load', showRecipe);
    */
    ['hashchange', 'load'].forEach(event => {
      window.addEventListener(event, handler);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkUp() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            
            <ion-icon name="calendar-outline" class="recipe__info-icon md hydrated"></ion-icon>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.released
            }</span>
          </div>
          <div class="recipe__info">
          <ion-icon name="star-outline" class="recipe__info-icon md hydrated"></ion-icon>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.rating
            }</span> 
          </div>
          <div class="recipe__info">
          <ion-icon name="business-outline" class="recipe__info-icon md hydrated"></ion-icon>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.developers[0].name
            }</span> 
          </div>
          <div class="recipe__info">
          <ion-icon name="game-controller-outline" class="recipe__info-icon md hydrated"></ion-icon>
            <span class="recipe__info-data recipe__info-data--people">${this._data.genres
              .map(genre => {
                return genre.name;
              })
              .join(', ')}</span> 
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        
        <div class="recipe__ingredients">
          <h2 class="heading--2">
          <ion-icon name="document-text-outline"></ion-icon>
          Descripcion</h2>
          <ul class="recipe__ingredient-list">
            ${
              this._data.description
                ? this._data.description
                : '<h2> No pudimos encontrar una descripcion de este videojuego</h2>'
            }   
            
          </ul>
        </div>

        <div class="line"> </div>

        <div class="recipe__images">
          <h2 class="heading--2">
          <ion-icon name="images-outline"></ion-icon>
          Imagenes</h2>
          <ul class="recipe__images-list">
           ${this._data.images
             .map(image => {
               return `<img src=${image.image} class="recipe__images-list-image"> </img>`;
             })
             .join('')}
          </ul>
        </div>

        <div class="line"> </div>

        <div class="recipe__video">
          <h2 class="heading--2">
          <ion-icon name="videocam-outline"></ion-icon>
          Video</h2>
          ${
            this._data.video
              ? `<video class="recipe__video-view" autoplay muted loop controls>
          <source src=${this._data.video}></source>`
              : 'Este juego no tiene video'
          }
          </video>
        </div>

        <div class="line"> </div>

        <div class="recipe__directions">
          <h2 class="heading--2">Donde comprar el juego</h2>
          <div class="recipe__directions-stores">
          ${
            this._data.stores.length !== 0
              ? this._data.stores
                  .map(store => {
                    return `<a
            class="btn--small recipe__btn"
            href="${store.url}"
            target="_blank"
          >
            <span>${store.store.name}</span>

          </a>`;
                  })
                  .join('')
              : '<h2> No pudimos encontrar una tienda que venda este videojuego</h2>'
          }
          </div>
        </div>
    `;
  }
}

export default new RecipeView();
