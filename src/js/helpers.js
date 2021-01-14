import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url) {
  try {
    const fetchPro = fetch(url);

    // Aca uso race para consumir la promesa que se cumpla primero, llamando a la funcion que si pasan 6 segundos sin que se cumpla primero el fetch, entonces procedo a lanzar un error que atrapo con el catch y lo lanzo para que lo atrape por ejemplo loadRecipe()
    const res = await Promise.race([timeout(TIMEOUT_SECONDS), fetchPro]);
    const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message} (status ${data.status})`);
    return data;
  } catch (error) {
    // En caso de haber un error en esta funcion, por ejemplo busco una comida con un id invalido, entonces para que model.js por ejemplo reciba este error en su catch dentro de loadRecipe(), lanzo el error como retorno para que lo reciba loadRecipe() y lo atrape. Caso contrario si no lanzo este error. Al ocurrir un error, este se envia a loadRecipe() como si fuese una promesa a consumir, pero la idea es una promesa rechazada.
    throw error;
  }
};
