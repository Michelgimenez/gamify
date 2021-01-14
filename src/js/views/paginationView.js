import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Agrego un event listener al div donde esta la paginacion, y al hacer click por ejemplo a algun boton, estos dentro un span,svg, eso es lo que va a ser el E.TARGET, pero yo quiero el boton, no el svg/span, asi que uso CLOSEST para obtener el padre mas cercano a ellos que tenga la class de btn--inline, teniendo finalmente el boton almacenado en la variable
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  // Para obtener la cantidad de resultados por pagina, simplemente divido la cantidad de recetas encontradas en la busqueda, que para recibir en numero, utilizo length, asi recibo la cantidad de recetas en el arrat de results, y divido por la cantidad de resultados que quiero por pagina, por ejemplo 47 resultados dividido 10, seria 4.7, y para redondear en 5, uso math.ceil
  _generateMarkUp() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Si estoy en la pagina 1 y hay otras paginas
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Pagina ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }

    // Si en la pagina en la que estoy es la ultima
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
        `;
    }

    // Si me encuentro en alguna de las paginas
    if (currentPage < numPages) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
      </button>

        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }

    // Estoy en la pagina 1 y no hay otras paginas, si nada de lo de arriba se cumpla, claramente quiere decir que solo hay 1 pagina. Por lo tanto retorno nada, finalizando la funcion.
    return '';
  }
}

export default new PaginationView();
