import {debounce, fetchData, fetchMovieDetails} from './utils.js';
const root = document.querySelector('.autocomplete');

root.innerHTML=`
  <label><b>Search for a movie</b></label>
  <input class='input '/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`
const input = document.querySelector('.input');
let resultsWrapper = document.querySelector('.results');
const dropdown = document.querySelector('.dropdown');
const popup = document.querySelector('.error')

const onInput = debounce(async (e) => {
  resultsWrapper.innerHTML = '';
  const movies =  await fetchData(e.target.value);
  console.log(movies);
  if (!movies.length) {
    dropdown.classList.remove('is-active');
    popup.classList.remove('error');
    input.placeholder = 'No movies found with that phrase'
    return
  }
  popup.classList.add('error');
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.addEventListener('click', ()=>{
      dropdown.classList.remove('is-active');
      input.value = `${movie.Title} (${movie.Year})`;
      onMovieselect(movie);
    })
    option.classList.add('dropdown-item');
    option.id = 'change';
    option.innerHTML = 
    `<img src='${imgSrc}' width="40px" height="20px"/>
     ${movie.Title}`;
    resultsWrapper.appendChild(option);
  }
}, 2000);

input.addEventListener('input', onInput);
document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
  if (e.target.classList.contains("delete")) {
    popup.classList.add('error');
  }
})

const onMovieselect = async (movie) => {
  const movieDetails = await fetchMovieDetails(movie.imdbID);
  console.log(movieDetails);
  document.querySelector('#summary').innerHTML = movieTemplate(movieDetails)
}

const movieTemplate = (movieDetails)=> {
  return `
    <article class="media">
      <figure class="media-left">
          <p class="image"><img src="${movieDetails.Poster}" alt=""></p>
      </figure>
      <div class="media-content">
          <div class="content">
              <h1>${movieDetails.Title}</h1>
              <h4>${movieDetails.Genre}</h4>
              <p>${movieDetails.Plot}</p>
          </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Boxoffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">Imdb Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">Imdb Votes</p>
    </article>
  `
}