import View from './View.js';
import icons from 'url:../../img/icons.svg';

// En este caso uso el constructor para que al cargar la pagina y al importarse esto en controller.js, se ejecute automaticamente el llamado a _addHandlerShowWindow(), tengo que usar super() ya que esta class es una extension de View, de lo contrario no tengo acceso al constructor para realizar el llamado a _addHandlerShowWindow()
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  // Uso bind para que el THIS dentro de toggleWindow, no apunte a btnOpen ya que es el que llama a toggleWindow(), y siempre el elemento que llama a la funcion se vuelve el this. Asi que corrijo el this usando BIND. Asi dentro de toggleWindow, los THIS van a apuntar a AddRecipeView, teniendo acceso a las variables de _window, _overlay, etc.
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // En este caso uso el constructor de FormData que dentro espera un form, en este caso le paso this, ya que this va a equivaler al elemento donde se ocasiono el evento y que hizo que se llame a la funcion. Por lo tanto este es justamente el elemento html de <form>. El constructor me da como retorno un objeto con varios fields, asi que uso el spread operator para extraer todos esos fields y almacenarlos en un array. Y finalmente lo que almaceno en data es un array que va a contener un array con dos elementos por cada field del form, por ejemplo [['title', 'pizza], ['image', 'pizza.jpg']], pero yo no quiero eso, yo quiero un objeto de js, que contenga el field y value por cada input del formulario. No quiero un array con entries como mostre antes. Asi que procedo a usar el metodo de Object.fromEntries() para convertir un array de entries en un objeto. Finalmente obteniendo {title: 'pizza', image: 'pizza.jpg'}
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkUp() {}
}

export default new AddRecipeView();
