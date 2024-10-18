import { qs, createElement, groupBy, pluck } from "./utilities.js";

let specificIMG;
const API_KEY = 'api_key=a878c5df0d00a01de969a21b02a39af4';
const URLs = {
    movies: '/discover/movie?include_adult=true&include_video=true&language=en-US&page=1&sort_by=popularity.desc&',
    tv: '/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&',
    base_IMG_URL: 'https://image.tmdb.org/t/p/w500'
};
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL_MOVIES = BASE_URL + URLs.movies + API_KEY;
const API_URL_TV = BASE_URL + URLs.tv + API_KEY;

const main = qs('main');

getData(API_URL_MOVIES);

/**
 * 
 * @param {string} url 
 */
function getData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data.results);
            showMovies(data.results);
        });
};

/**
 * 
 * @param {object[]} data 
 */
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, release_date, original_language, id } = movie;
        const img_path = `/movie/${id}/images` + poster_path;
        const moviesEl = createElement('div', {
            'class': 'movie-card'
        });
        moviesEl.innerHTML = `
            <img src="${URLs.base_IMG_URL + poster_path}" alt="${title}">
                <div class="movie-info">
                    <h2>${title}</h2>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>
                <div class="overview-section">
                    <div class="overview-and-language">
                        <h3>Overview</h3>
                        <h4 class="language">${original_language}</h4>
                    </div>
                    <p>
                        ${overview}
                    </p>
                    <div class="release-date">
                        <h4>Release date: </h4> 
                        <p>${release_date}</p>
                    </div>
        `;

        main.append(moviesEl);
    });
};

function getColor(params) {
    if (params >= 8) {
        return 'green'
    } else if (params >= 5) {
        return 'orange'
    } else {
        return 'red';
    }
}



