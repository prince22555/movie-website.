const API_KEY = "4de609eac332536754c7b94ffad715a1";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const trendingContainer =
    document.querySelector("#trendingMovies");

const popularContainer =
    document.querySelector("#popularMovies");

const searchInput =
    document.querySelector("#searchInput");

const searchBtn =
    document.querySelector("#searchBtn");


// Create a movie card
function createMovieCard(movie) {

    if (!movie.poster_path) return null;

    const card = document.createElement("div");

    card.className = "movie-card";

    card.innerHTML = `
        <img
    src="${IMAGE_URL}${movie.poster_path}"
    alt="${movie.title}"
    onerror="this.style.display='none'"
>

        <h3>${movie.title}</h3>

        <p>⭐ ${movie.vote_average.toFixed(1)}</p>

        <p>${movie.release_date || "Unknown date"}</p>
    `;

    card.addEventListener("click", function () {

        window.location.href =
            `movie-details.html?id=${movie.id}`;

    });

    return card;
}


// Display movies
function displayMovies(movies, container) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const card = createMovieCard(movie);

        if (card) {
            container.appendChild(card);
        }

    });
}


// Get trending movies
async function getTrendingMovies() {

    const url =
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        displayMovies(
            data.results,
            trendingContainer
        );

    } catch (error) {

        console.error(error);

    }
}


// Get popular movies
async function getPopularMovies() {

    const url =
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        displayMovies(
            data.results,
            popularContainer
        );

    } catch (error) {

        console.error(error);

    }
}


// Search movies
async function searchMovies() {

    const query =
        searchInput.value.trim();

    if (query === "") {

        getTrendingMovies();
        getPopularMovies();

        return;
    }

    const url =
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        trendingContainer.innerHTML = "";
        popularContainer.innerHTML = "";

        displayMovies(
            data.results,
            trendingContainer
        );

    } catch (error) {

        console.error(error);

    }
}


// Search button
searchBtn.addEventListener(
    "click",
    searchMovies
);


// Enter key
searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            searchMovies();
        }

    }
);


// Load movies
getTrendingMovies();
getPopularMovies();