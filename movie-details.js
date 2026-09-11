const API_KEY = "4de609eac332536754c7b94ffad715a1";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieDetails = document.querySelector("#movieDetails");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");


// ===============================
// GET MOVIE DETAILS
// ===============================

async function getMovieDetails() {

    if (!movieId) {
        movieDetails.innerHTML = "<p>Movie not found.</p>";
        return;
    }

    try {

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        const movie = await response.json();

        movieDetails.innerHTML = `

            <div class="details">

                <img
                    src="${IMAGE_URL}${movie.poster_path}"
                    alt="${movie.title}"
                >

                <div class="details-info">

                    <h2>${movie.title}</h2>

                    <p>⭐ ${movie.vote_average.toFixed(1)}</p>

                    <p>📅 ${movie.release_date}</p>

                    <p>
                        🎭 ${movie.genres
                            .map(genre => genre.name)
                            .join(", ")}
                    </p>

                    <h3>Overview</h3>

                    <p>${movie.overview}</p>

                    <button id="saveBtn">
                        🔖 Save Movie
                    </button>

                    <button id="trailerBtn">
                        🎥 Watch Trailer
                    </button>

                    <div id="trailer"></div>

                </div>

            </div>
        `;


        // ===============================
        // SAVE MOVIE BUTTON
        // ===============================

        const saveBtn =
            document.querySelector("#saveBtn");

        let savedMovies =
            JSON.parse(localStorage.getItem("savedMovies")) || [];

        const alreadySaved =
            savedMovies.some(saved => saved.id === movie.id);

        if (alreadySaved) {
            saveBtn.textContent = "✅ Movie Saved";
        }

        saveBtn.addEventListener("click", function () {

            let savedMovies =
                JSON.parse(localStorage.getItem("savedMovies")) || [];

            const exists =
                savedMovies.some(saved => saved.id === movie.id);

            if (!exists) {

                savedMovies.push({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date
                });

                localStorage.setItem(
                    "savedMovies",
                    JSON.stringify(savedMovies)
                );

                saveBtn.textContent = "✅ Movie Saved";

            } else {

                savedMovies =
                    savedMovies.filter(
                        saved => saved.id !== movie.id
                    );

                localStorage.setItem(
                    "savedMovies",
                    JSON.stringify(savedMovies)
                );

                saveBtn.textContent = "🔖 Save Movie";
            }

        });


        // Trailer button

        document
            .querySelector("#trailerBtn")
            .addEventListener("click", getTrailer);

    } catch (error) {

        console.error(error);

        movieDetails.innerHTML =
            "<p>Unable to load movie details.</p>";
    }
}


// ===============================
// GET TRAILER
// ===============================

async function getTrailer() {

    const trailerContainer =
        document.querySelector("#trailer");

    trailerContainer.innerHTML =
        "<p>Loading trailer...</p>";

    try {

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
        );

        const data = await response.json();

        const trailer = data.results.find(video =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        if (!trailer) {

            trailerContainer.innerHTML =
                "<p>😔 Trailer not available.</p>";

            return;
        }

        trailerContainer.innerHTML = `

            <div class="trailer-box">

                <h3>🎬 Official Trailer</h3>

                <div class="video-container" id="videoContainer">

                    <iframe
                        id="trailerVideo"
                        src="https://www.youtube.com/embed/${trailer.key}?rel=0"
                        title="${trailer.name}"
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        allowfullscreen>
                    </iframe>

                    <button id="fullscreenBtn">
                        ⛶ Full Screen
                    </button>

                </div>

            </div>
        `;


        // ===============================
        // FULLSCREEN
        // ===============================

        const videoContainer =
            document.querySelector("#videoContainer");

        const fullscreenBtn =
            document.querySelector("#fullscreenBtn");


        fullscreenBtn.addEventListener("click", async function () {

            try {

                if (document.fullscreenElement) {

                    await document.exitFullscreen();

                } else if (videoContainer.requestFullscreen) {

                    await videoContainer.requestFullscreen();

                } else if (videoContainer.webkitRequestFullscreen) {

                    videoContainer.webkitRequestFullscreen();

                } else {

                    alert(
                        "Fullscreen is not supported by this browser."
                    );

                }

            } catch (error) {

                console.error("Fullscreen error:", error);

                alert(
                    "Fullscreen was blocked by the browser. Try the YouTube fullscreen button."
                );
            }

        });

    } catch (error) {

        console.error(error);

        trailerContainer.innerHTML =
            "<p>Unable to load trailer.</p>";
    }
}


getMovieDetails();