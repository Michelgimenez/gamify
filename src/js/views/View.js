import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _window = document.querySelector('.add-game-window');
  _overlay = document.querySelector('.overlay-2');
  _btnClose = document.querySelector('.btn--close-img-modal');

  // Al ejecutarse este metodo dentro de por ejemplo controller.js, en controlSearchResults(), donde ejecuto resultsView.render(), resultsView va a ver que no cuenta con ese metodo, asi que se va a fijar en el prototipo heredado de su padre View (esta class), y ahi va a ejecutar esta funcion en la cual voy a usar las variables y metodos de resultsView. Despues Si la informacion en esta funcion esta vacia, es decir, es undefined, o la informacion es un array y tiene una longitud de 0, es decir es un array vacio, entonces procedo a llamar a la funcion que renderiza el error.
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkUp();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    const imagesContainer = document.querySelector('.recipe__images');
    if (imagesContainer) {
      imagesContainer.addEventListener('click', e => {
        if (e.target.classList.value === 'recipe__images-list-image') {
          const imageToShow = document.querySelector('.add-game-window-img');
          imageToShow.src = e.target.src;
          this.toggleWindow();
        }
      });
    }
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
    this._addHandlerHideWindow();
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // document.createRange().createContextualFragment() lo que hace es convertir la string dentro de newMarkup en, un objeto que emula un elemento html en el DOM, algo asi como un DOM VIRTUAL parecido a lo que hace react. La idea es comparar este nuevo html con el html viejo, para saber que modificar, asi no actualizo toda la pagina entera al pedo. Despues procedo a crear un array en base a todos los elementos que encuentro en newDOM y lo almaceno en newElements ya que este va a contener por ejemplo el bookmarked cambiado a blanco ya que el item lo agregue a favoritos, entonces tras generar el nuevo markup, el bookmarked va a estar blanco. Y tendria dentro de newElements, por ejemplo una node list de elementos que conforman el html del juego con los valores actualizados en este caso del bookmarked como dije antes. Procedo a realizar lo mismo con la receta tal cual se encuentra antes de actualizar, y lo almaceno en currentElements, y a ambos les aplico Array.from() para pasar de nodelist a un array real. Despues procedo a loopear sobre los node elementos que hay en newElements, y por cada elemento obtengo el elemento y el index comenzando desde 0. Y procedo a aprovechar ese index para que en cada loopeo, almacene en una variable, la seleccion de los elementos tambien del array de node elements en currentElements, usando el index. De esa forma arranca el loopeo, index 0 para el primer elemento dentro de newElements, y a su vez dentro del loopeo selecciono el elemento de index 0 en currentElements. De esa forma puedo proceder a usar IF para comparar que si el elemento que me encuentro loopeando es igual al elemento que almacene tambien en curEl. Y tambien verifico que el elemento actualizo sobre el que me encuentro loopeando, su firstChild, es decir el texto que contiene dentro este elemento html, le selecciono el valor, le quito los espacios con trim() y corroboro que su valor no sea igual a una string vacia, es decir, corroboro que haya texto dentro. De esa forma por ejemplo tengo el elemento de las personas para la receta, son 4, y actualizo a 5, entonces obtengo ese 5. Pero si muestro en la consola como deje comentado, si el elemento actualizado del loopeo es diferente al elemento actual, voy a poder corroborar que, por ejemplo el div entero que contiene los botones, el texto de las personas, etc. DA FALSE, porque basicamente tiene razon, dentro cambio el texto de las personas, pero yo no quiero actualizar el DIV entero, solo quiero actualizar el texto, es por eso que en el IF procedo a seleccionar solo los elementos que contengan texto, para no actualizar divs enteros, solo el elemento correspondiente. Y finalmente digo que quiero colocar ese 5 actualizado como valor en el contenido de curEl, que es el elemento de las personas sin actualizar. Pasando de 4 a 5. Y actualizando ademas las recetas, pero nada mas, ya que es lo unico que es diferente. Y en el segundo if repito la comprobacion de que el elemento en el que me encuentro loopeando, sea diferente al elemento que se encuentra en curEl. En caso de que asi sea, procedo a seleccionar los atributos del nuevo elemento, lo paso a un array, esto me da por un ejemplo un array con el atributo [class, data-set], y a este array le aplico un loopeo, por cada atributo que encuentro selecciono el elemento dentro de curEl, por ejemplo los botones de + y -, y procedo a actualizar los atributos de estos, actualiza la class por ejemplo, que de todas formas va a quedar igual, pero lo que importa es el atributo de data-set, ya que recibo ese data-set actualizado, ya que al bajar una persona o subir, tambien cambia el data-set del elemento html del boton, asi que procedo a actualizar esos data-set, pasandole el nombre (data-update-to) y el nuevo valor.
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkUp();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // console.log(newEl.isEqualNode(curEl));

      // ACTUALIZA LOS ELEMENTOS QUE TENGAN EL TEXTO CAMBIADO, ESTO NO LO VOY A USAR
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // ACTUALIZA LOS ATRIBUTOS CAMBIADOS, POR EJEMPLO LA CLASS QUE CAMBIO DEL ICONO DE BOOKMARKED, primero newEl en uno de los loopeos equivale al nuevo renderizado que hice del juego con el icono de bookmarked teniendo en la class el FILL, y este como es nuevo no va a ser igual a curEl que equivale al elemento antes de ser actualizado. Entonces creo un array con los atributos del nuevo juego, en este caso solo tengo la class, y coloco que por este atributo que tiene el nuevo juego, en este caso esa class, se la voy a colocar al elemento desactualizado, colocandole esta class nueva y de esa forma actualizando solo ese elemento sin actualizar la pagina entera.
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
     <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
     `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
