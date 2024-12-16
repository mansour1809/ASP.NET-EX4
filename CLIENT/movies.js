// const moviesApi = "https://localhost:7125/api/Movies";
const moviesApi = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Movies";

$(document).ready(() => {

  $('.navbar-nav button').on('click', function () {
    const $navbarCollapse = $('#navbarNav');
    if ($navbarCollapse.hasClass('show')) {
        $navbarCollapse.collapse('hide');
    }
  });

$('#releaseYear').attr('max',new Date().getFullYear());

  $("#castFormContainer").addClass("d-none");

  if (localStorage.getItem("isLoggedIn") === "true") {
    $("#welcomeMessage").text(`Welcome, ${localStorage.getItem("userName")}!`);
    $("#signOutButton").show(); // Show sign-out button
  } else {
    window.location.href = "login.html";
  }

  $("#signOutButton").click(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");
    localStorage.removeItem("wishlistIds");
    window.location.href = "login.html";
  });

   showLoading= ()=> {
    $("#loadingIndicator").show();
    $("#moviesContainer").hide();
}

 hideLoading= ()=> {
    $("#loadingIndicator").hide();
    $("#moviesContainer").show();
}

  $("#movieForm").on("submit", addMovie);

  $("#addMovie").click(() => {
    $("#addMovieModal").modal("show");
  });

  $("#showMovies").click(checkWishListRenderMovies);
  checkWishListRenderMovies();
});

checkWishListRenderMovies = ()=>{
  showLoading();
  ajaxCall("GET",wishlistApi  , null, 
(wishlist)=>{
  const wishlistIds = wishlist.map((movie) => movie.id); 
  localStorage.setItem("wishlistIds", JSON.stringify(wishlistIds));
  renderMovies(JSON.parse(localStorage.getItem("wishlistIds")) || []);
}, ecb)}


renderMovies = (wishlistIds) => {
  $("#castFormContainer").addClass("d-none");
  $("#wishlistContainer").addClass("d-none");
  $("#moviesContainer").removeClass("d-none");
  $("#addMovie").show();
  let moviesHtml = "";
  ajaxCall("GET",moviesApi  , null, (movies)=>{
  movies.forEach((movie) => {
    const isInWishlist = wishlistIds.includes(movie.id);
    moviesHtml += `
          <div class="col-lg-3 col-md-4 col-sm-6">
              <div class="card h-100">
                  <img loading="lazy" src="${movie.photoUrl}" class="card-img-top" alt="${movie.title}  loading="lazy"">
                  <div class="card-body">
                      <h5 class="card-title">${movie.title}</h5>
                      <p class="card-text">${movie.description}</p>
                  </div>
                  <div class="card-footer">
                      <div class="mb-2">
                          <span class="badge bg-primary">Rating: ${movie.rating}</span>
                          <span class="badge bg-secondary">Year: ${movie.releaseYear}</span>
                          <span class="badge bg-info">Duration: ${movie.duration} min</span>
                      </div>
                      <button class="btn btn-primary w-100" 
                        id="button-${movie.id}" 
                        onclick="addToWishlist(${movie.id})"
                        ${isInWishlist ? "disabled" : ""}>Add to Wishlist</button>
                  </div>
              </div>
          </div>
      `;
  });

  $("#moviesContainer").html(moviesHtml);
  hideLoading();
}, ecb);}

addMovie = (e) => {
  e.preventDefault(); 
  const newMovie = {
    id: 0, 
    title: $('#title').val(), 
    rating: isNaN(parseFloat($('#ratingVal').val())) ? 0 :  parseFloat($('#rating').val()) ,
    income: isNaN(parseInt($('#income').val(), 10)) ? 0 : parseInt($('#income').val(), 10) , 
    releaseYear: parseInt($('#releaseYear').val(), 10),  
    duration: parseInt($('#durationMin').val(), 10),
    language: $('#language').val(), 
    description: $('#description').val(), 
    genre: $('#genre').val(), 
    photoUrl: $('#moviePhotoUrl').val(), 
  };
 
  ajaxCall(
    "POST",
    moviesApi,
    JSON.stringify(newMovie),
    (response) => {
      if (response == true) {
        showLoading();
        Swal.fire({
          icon: "success",
          title: "Movie Added!",
          text: "The movie was added successfully.",
        });
        $("#addMovieModal").modal("hide"); // Hide the modal
        $("#movieForm")[0].reset(); // Reset the form
        checkWishListRenderMovies();
        hideLoading();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:  "This movie already exist.",
        });
      }
    },
    ecb
  );
};


ecb = () =>{
  hideLoading();
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "An error occurred while adding the movie.",
  });

}

function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method,
    url: api,
    data: data,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: successCB,
    error: errorCB,
  });
}
