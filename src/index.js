import debounce from 'lodash.debounce';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './api-service';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(nameCountry, DEBOUNCE_DELAY));

function nameCountry(e) {
  let name = e.target.value;
  if (name === '') {
    refs.ul.innerHTML = '';
    refs.div.innerHTML = '';
    return;
  } else {
    refs.ul.innerHTML = '';
    refs.div.innerHTML = '';
    API.fetchCountries(name)
      .then(resultJson)
      .then(renderResult)
      .catch(rejectedResult);
  }
}

function resultJson(result) {
  return result.json();
}

function renderResult(result) {
  if (result.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (result.length >= 2 && result.length <= 10) {
    return result.map(({ name, flags }) => {
      const nameCountry = `<li><img src='${flags.svg}' width=30 height=20> ${name.official}</li>`;
      return refs.ul.insertAdjacentHTML('beforeend', nameCountry.trim());
    });
  } else {
    return result.map(({ name, capital, population, flags, languages }) => {
      const infoCountry = `<li><img src='${flags.svg}' width=30 height=20> ${
        name.official
      }</li><li>capital: ${capital.join(
        ''
      )}</li><li>population: ${population}</li><li>languages: ${Object.values(
        languages
      ).join(' ')}</li>`;
      return refs.div.insertAdjacentHTML('beforeend', infoCountry.trim());
    });
  }
}

function rejectedResult() {
  Notify.failure('Oops, there is no country with that name');
}
