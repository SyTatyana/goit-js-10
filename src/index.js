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

refs.input.addEventListener('input', debounce(createResponse, DEBOUNCE_DELAY));

function createResponse(e) {
  eraseHtml();
  let name = e.target.value;
  if (name === '') {
    return;
  }
  API.fetchCountries(name).then(renderResult).catch(rejectedResult);
}

function eraseHtml() {
  refs.ul.innerHTML = '';
  refs.div.innerHTML = '';
}
function renderResult(result) {
  const resultLength = result.length;
  if (resultLength > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (resultLength >= 2 && resultLength <= 10) {
    refs.ul.insertAdjacentHTML('beforeend', nameCountry(result));
    return;
  }

  refs.div.insertAdjacentHTML('beforeend', infoCountry(result));
}
function nameCountry(result) {
  return result.map(
    obj =>
      `<li><img src = "${obj.flags.svg}" width=30 height=20> "${obj.name.official}"</li>`
  );
}

function infoCountry(result) {
  return result.map(
    obj =>
      `<li><img src = "${obj.flags.svg}" width=30 height=20> ${
        obj.name.official
      }</li> 
  <li>capital: ${obj.capital.join('')}</li>
  <li>population: ${obj.population}</li>
  <li>languages: ${Object.values(obj.languages).join('')}</li>`
  );
}

function rejectedResult() {
  Notify.failure('Oops, there is no country with that name');
}
