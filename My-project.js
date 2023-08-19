let MyMovieStack = [];

const HomeButton = document.querySelector("#Home-Button-Page");
const FavouriteButton = document.querySelector("#favorite-button");
const SearchBar = document.querySelector("#search-bar");
const MyCardContainer = document.querySelector("#Mycard-container");

// simple function to show an alert when we need
function showAlert(message) {
  alert(message);
}

// create move cards using elements of MyMovieStack array
function renderList(actionForButton) {
  MyCardContainer.innerHTML = "";

  for (let i = 0; i < MyMovieStack.length; i++) {
    // creating div element for movie card and setting class and id to it
    let MyMovies_Card = document.createElement("div");
    MyMovies_Card.classList.add("MovieCard");

    // template for interHtml of movie card which sets image, title and rating of particular movie
    MyMovies_Card.innerHTML = `
		<img src="${
      "https://image.tmdb.org/t/p/w500" + MyMovieStack[i].poster_path
    }" alt="${MyMovieStack[i].title}" class="MoviePoster">
		<div class="Title-Container">
			<span>${MyMovieStack[i].title}</span>
			<div class="Movie-Rating-Container">
				<img src="Favourite Icon.png" alt="">
				<span>${MyMovieStack[i].vote_average}</span>
			</div>
		</div>

		<button id="${
      MyMovieStack[i].id
    }" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>

		<button onclick="${actionForButton}(this)" class="Adding-To-Favourite icon-button" data-id="${
      MyMovieStack[i].id
    }" >
			<img src="Favourite Icon.png">
			<span>${actionForButton}</span>
		</button>
		`;
    MyCardContainer.append(MyMovies_Card); //appending card to the movie container view
  }
}

// if any thing wrong by using this function we print message to the main screen
function printError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.innerHTML = message;
  errorDiv.style.height = "100%";
  errorDiv.style.fontSize = "5rem";
  errorDiv.style.margin = "auto";
  MyCardContainer.innerHTML = "";
  MyCardContainer.append(errorDiv);
}

// gets latest movies from the server and renders as movie cards
function GetLatestMovies() {
  const tmdb = fetch(
    "https://api.themoviedb.org/3/trending/movie/day?api_key=cb213741fa9662c69add38c5a59c0110"
  )
    .then((response) => response.json())
    .then((data) => {
      MyMovieStack = data.results;
      renderList("favourite");
    })
    .catch((err) => printError(err));
}
GetLatestMovies();

// when we clicked on home button this fetches trending movies and renders on web-page
HomeButton.addEventListener("click", GetLatestMovies);

// search box event listner check for any key press and search the movie according and show on web-page
SearchBar.addEventListener("keyup", () => {
  let searchString = SearchBar.value;

  if (searchString.length > 0) {
    let searchStringURI = encodeURI(searchString);
    const searchResult = fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`
    )
      .then((response) => response.json())
      .then((data) => {
        MyMovieStack = data.results;
        renderList("favourite");
      })
      .catch((err) => printError(err));
  }
});

// function to add movie into favourite section
function favourite(element) {
  let id = element.dataset.id;
  for (let i = 0; i < MyMovieStack.length; i++) {
    if (MyMovieStack[i].id == id) {
      let KavyafavoriteMovies = JSON.parse(
        localStorage.getItem("KavyafavoriteMovies")
      );

      if (KavyafavoriteMovies == null) {
        KavyafavoriteMovies = [];
      }

      KavyafavoriteMovies.unshift(MyMovieStack[i]);
      localStorage.setItem(
        "KavyafavoriteMovies",
        JSON.stringify(KavyafavoriteMovies)
      );

      showAlert(MyMovieStack[i].title + " added to favourite");
      return;
    }
  }
}

// when Favourites movie button click it shows the favourite moves
FavouriteButton.addEventListener("click", () => {
  let KavyafavoriteMovies = JSON.parse(
    localStorage.getItem("KavyafavoriteMovies")
  );
  if (KavyafavoriteMovies == null || KavyafavoriteMovies.length < 1) {
    showAlert("No favourite Movie Available");
    return;
  }

  MyMovieStack = KavyafavoriteMovies;
  renderList("remove");
});

// remove movies from favourite section
function remove(element) {
  let id = element.dataset.id;
  let KavyafavoriteMovies = JSON.parse(
    localStorage.getItem("KavyafavoriteMovies")
  );
  let NewMovies = [];
  for (let i = 0; i < KavyafavoriteMovies.length; i++) {
    if (KavyafavoriteMovies[i].id == id) {
      continue;
    }
    NewMovies.push(KavyafavoriteMovies[i]);
  }

  localStorage.setItem(
    "KavyafavoriteMovies",
    JSON.stringify(NewMovies)
  );
  MyMovieStack = NewMovies;
  renderList("remove");
}

// renders movie details on web-page
function renderMovieInDetail(movie) {
  console.log(movie);
  MyCardContainer.innerHTML = "";

  let MovieDetail = document.createElement("div");
  MovieDetail.classList.add("Movie-Detail-Card");

  MovieDetail.innerHTML = `
		<img src="${
      "https://image.tmdb.org/t/p/w500" + movie.backdrop_path
    }" class="Movie-Detail-Background">
		<img src="${
      "https://image.tmdb.org/t/p/w500" + movie.poster_path
    }" class="Movie-Poster-Detail">
		<div class="Movie-Title-Detail">
			<span>${movie.title}</span>
			<div class="Movie-Rating-Detail">
				<img src="Favourite Icon.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="Movie-Plot-Detail">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

  MyCardContainer.append(MovieDetail);
}

// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element) {
  fetch(
    `https://api.themoviedb.org/3/movie/${element.getAttribute(
      "id"
    )}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => renderMovieInDetail(data))
    .catch((err) => printError(err));
}
