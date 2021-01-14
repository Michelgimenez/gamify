import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'No se encontraron video juegos para tu busqueda, por favor busque algo como Final Fantasy VII remake 🎮';
  _message = '';

  _generateMarkUp() {
    return this._data.map(game => previewView.render(game, false)).join('');
  }
}

export default new ResultsView();
