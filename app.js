import { qs, createElement, addGlobalEventListener } from "./utilities.js";


const API_KEY = 'api_key=a878c5df0d00a01de969a21b02a39af4';
const URLs = {
    movies: `/discover/movie?include_adult=true&include_video=true&language=en-US&page=1&sort_by=popularity.desc&`,
    tv: `/discover/tv?include_adult=true&include_null_first_air_dates=true&language=en-US&page=1&sort_by=popularity.desc&`,
    base_IMG_URL: 'https://image.tmdb.org/t/p/w500',
    genres: {
        movies: `/genre/movie/list?language=en&`,
        tv: `/genre/tv/list?language=en&`
    }
};
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL_MOVIES = BASE_URL + URLs.movies + API_KEY;
const API_URL_TV = BASE_URL + URLs.tv + API_KEY;
const API_GENRES_MOVIES = BASE_URL + URLs.genres.movies + API_KEY;
const API_GENRES_TV = BASE_URL + URLs.genres.tv + API_KEY;

const section = qs('[data-section]');
const main = qs('[data-main]');
const btn = qs('.btn');


window.onload = () => {
    displayDataAPI(API_URL_MOVIES);
    getGenresAPI(API_GENRES_MOVIES);
};

/**
 * 
 * @param {string} url 
 */
function displayDataAPI(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showMovies(data.results);
        });
};

let genreMap = {}; 

function getGenresAPI(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            genreMap = data.genres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
            // console.log("Genre map:", genreMap);
        });
}

/**
 * 
 * @param {object[]} data 
 */
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { original_title, original_name, poster_path, backdrop_path, vote_average, overview, release_date, first_air_date, original_language, genre_ids } = movie;
        const moviesEl = createElement('div', {
            'class': 'movie-card'
        });
        moviesEl.innerHTML = `
            <img src="${URLs.base_IMG_URL + poster_path}" alt="${original_title}" class="dp">
                <div class="movie-info">
                    <h2>${original_title || original_name}</h2>
                    <span class="${getColor(vote_average)}">${vote_average.toFixed(2)}</span>
                </div>
                <div class="overview-section">
                    <div class="overview-and-language">
                        <h3>Overview</h3>
                        <h4 class="language">${original_language}</h4>
                    </div>
                    <p class="description">
                        ${overview}
                    </p>
                    <div class="release-date">
                        <h4>${release_date ? "Release date: " : "First Air Date: "}</h4> 
                        <p>${release_date || first_air_date}</p>
                    </div>
        `;

        qs('.dp', moviesEl).onclick = () => {
            popupDisplay(movie);
        };
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
    };
};

function popupDisplay(data) {
    const { original_title, original_name, poster_path, backdrop_path, vote_average, overview, release_date, first_air_date, original_language, genre_ids } = data;
    section.innerHTML = '';
    const tvEl = createElement('div', {
        'class': 'popup'
    });

    const genreNames = genre_ids.map(id => genreMap[id] || "Unknown");

    tvEl.innerHTML = `
    <div class="img-container">
        <div class="movie-info">
            <h2>${original_name || original_title}</h2>
            <span class="${getColor(vote_average)}" id="rating">${vote_average.toFixed(2)}</span>
        </div>
        <div class="image">
            <img src="${backdrop_path === null ? (URLs.base_IMG_URL + poster_path) : (URLs.base_IMG_URL + backdrop_path)}"
                alt="${original_name || original_title}" class="dp">
        </div>
        <button>Add to Watchlist <strong>+</strong></button>
    </div>
    <div class="overview-section">
        <div class="overview-and-language">
            <h3>Overview</h3>
            <h4 class="language">${original_language}</h4>
        </div>
        <p class="description">
            ${overview}
        </p>
        <div class="release-date">
            <h4>${release_date ? "Release date: " : "First Air Date: "}</h4>
            <p>${release_date || first_air_date}</p>
        </div>
        <div class="genre"></div>
    </div>
    `;

    genreNames.forEach(genre => {
        const genreContainer = qs('.genre', tvEl);
        const genreTag = createElement('div', {
            'class': 'genre-text',
            'text': genre
        });
        genreContainer.append(genreTag);
    });

    section.append(tvEl);
    console.log(data);
};


addGlobalEventListener(['click', 'mouseover'], ['.movie-card', '.dp', 'body', '[data-movies]', '[data-tv]'], (_, __, selector, type) => {
    if (type === 'click' && selector === '.dp') {
        qs('.blur').classList.add('active');
        setTimeout(() => qs('.popup').classList.add('active'), 50);    
    };
    if (type === 'click' && selector === 'body') {
        qs('.blur').classList.remove('active');
        qs('.popup').classList.remove('active');
    };
    if (type === 'click' && selector === '[data-movies]') {
        btn.style.left = '0';
        displayDataAPI(API_URL_MOVIES);
        getGenresAPI(API_GENRES_MOVIES);
        console.log('Movies')
    } else if (type === 'click' && selector === '[data-tv]') {
        btn.style.left = '110px';
        displayDataAPI(API_URL_TV);
        getGenresAPI(API_GENRES_TV);
        console.log('TV')
    };
});

window.popupDisplay = popupDisplay;



