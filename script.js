const API_KEY = "835c1caf";

const typeFilter = document.getElementById("typeFilter");
const sortYear = document.getElementById("sortYear");

let allMovies = [];

const movieContainer = document.getElementById("movies");

async function fetchMovies(query) {
  movieContainer.innerHTML = "<div class='loader'></div>";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    console.log(data);

    allMovies = data.Search || [];
    applyFilters();
  } catch (error) {
    movieContainer.innerHTML = "<p>Error fetching data</p>";
  }
}

// Display_Movies

function displayMovies(movies) {
  movieContainer.innerHTML = "";

  if (!movies) {
    movieContainer.innerHTML = "<p>No movies found</p>";
    return;
  }

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}">
    <h3>${movie.Title}</h3>
    <p>${movie.Year}</p>
    <button onclick="addToFavorites('${movie.imdbID}')">❤️</button>
    `;

    movieContainer.appendChild(div);
  });
}

// Search_Functionality
const searchInput = document.getElementById("search");

function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

const handleSearch = debounce(() => {
  const value = searchInput.value.trim();
  if (value !== "") {
    fetchMovies(value);
  }
}, 500);

searchInput.addEventListener("input", handleSearch);


// Filter_And_Sort_Functionality
function applyFilters() {
  let filtered = [...allMovies];

  const type = typeFilter.value;
  const sort = sortYear.value;

  // FILTER
  if (type) {
    filtered = filtered.filter(movie => movie.Type === type);
  }

  // SORT
  if (sort === "asc") {
    filtered = filtered.sort((a, b) => a.Year - b.Year);
  } else if (sort === "desc") {
    filtered = filtered.sort((a, b) => b.Year - a.Year);
  }

  displayMovies(filtered);
}

// Event_Listeners_for_Filters
typeFilter.addEventListener("change", applyFilters);
sortYear.addEventListener("change", applyFilters);

// Favorites_Functionality
function addToFavorites(id) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Added to favorites!");
  }
}

// Theme_Toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});