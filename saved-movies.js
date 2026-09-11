const IMAGE_URL =
    "https://image.tmdb.org/t/p/w500";

const savedMoviesContainer =
    document.querySelector("#savedMovies");


// ===============================
// LOAD SAVED MOVIES
// ===============================

function loadSavedMovies() {

    const savedMovies =
        JSON.parse(
            localStorage.getItem("savedMovies")
        ) || [];


    // No saved movies

    if (savedMovies.length === 0) {

        savedMoviesContainer.innerHTML = `
            <div class="no-saved">
                <h3>😔 No Saved Movies</h3>

                <p>
                    You haven't saved any movies yet.
                </p>

                <a href="index.html">
                    🎬 Browse Movies
                </a>
            </div>
        `;

        return;
    }


    savedMoviesContainer.innerHTML = "";


    // Display saved movies

    savedMovies.forEach(movie => {

        const card =
            document.createElement("div");

        card.className = "movie-card";


        card.innerHTML = `

            <img
                src="${IMAGE_URL}${movie.poster_path}"
                alt="${movie.title}"
                onerror="this.style.display='none'"
            >

            <h3>${movie.title}</h3>

            <p>
                ⭐ ${movie.vote_average.toFixed(1)}
            </p>

            <p>
                📅 ${movie.release_date || "Unknown"}
            </p>

            <button
                class="remove-btn"
                data-id="${movie.id}"
            >
                🗑️ Remove
            </button>

        `;


        // Open movie details

        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.classList.contains(
                        "remove-btn"
                    )
                ) {
                    return;
                }

                window.location.href =
                    `movie-details.html?id=${movie.id}`;

            }
        );


        savedMoviesContainer.appendChild(card);

    });


    // Remove buttons

    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const movieId =
                        Number(this.dataset.id);


                    let movies =
                        JSON.parse(
                            localStorage.getItem(
                                "savedMovies"
                            )
                        ) || [];


                    movies =
                        movies.filter(
                            movie =>
                                movie.id !== movieId
                        );


                    localStorage.setItem(
                        "savedMovies",
                        JSON.stringify(movies)
                    );


                    loadSavedMovies();

                }
            );

        });

}


// Start

loadSavedMovies();