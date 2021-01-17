import './styles.css';

import countrieCardTemplate from './templates/countrie-card.hbs';
import fetchCountries from './js/fetchCountries.js';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  search: document.querySelector('input'),
  countries: document.querySelector('.countries'),
};

let inputValue = '';
var debounce = require('lodash.debounce');

refs.search.addEventListener('input', debounce(onSearch, 500));


function onSearch() {
  inputValue = refs.search.value;
  clearMarkup();
  if (refs.search.value === '') { return }
  else {
    fetchCountries(inputValue).then(promise => {
      if (promise.status && promise.status !== 200) {
        error({
          title: 'Ошибка',
          text: 'Неподходящее название, попробуйте снова',
          icon: true,
          delay: 2000,
        });
      } else if (promise.length > 10) {
        error({
          title: 'Ошибка',
          text: 'Нужно ввести более специфичный запрос, слишком много стран',
          icon: true,
          delay: 2000,
        });
      } else if (promise.length === 1) {
        renderCountrieCard(promise[0])
      } else { renderCountriesList(promise) }
    }).catch(error => console.log(error))
  }
};

function renderCountrieCard(countrie) {
  const countrieCardMarkup = countrieCardTemplate(countrie);
  refs.countries.insertAdjacentHTML('beforeend', countrieCardMarkup)
};

function renderCountriesList(countries) { 
  const countriesNames = countries.map( (сountrie) => `<li class="countrie-item">${сountrie.name}</li>`).join('');
  refs.countries.insertAdjacentHTML('beforeend', countriesNames);
};

function clearMarkup() { 
  refs.countries.innerHTML = '';
  };
