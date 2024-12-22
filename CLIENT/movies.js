// const moviesApi = "https://localhost:7125/api/Movies";
const moviesApi = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Movies";

$(document).ready(() => {

  if(localStorage.getItem("userName") === "admin")
    $('.navbar-nav').append(`<button id="usersInfo" class="btn btn-outline-light me-2 mb-2 mb-lg-0">
        Users info
      </button>`);
    
      $('#usersInfo').click(()=>window.location.href= "adminPage.html")

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
    localStorage.removeItem("movies");
    window.location.href = "login.html";
  });

  $('.navbar-nav button').on('click', function () {
    const $navbarCollapse = $('#navbarNav');
    if ($navbarCollapse.hasClass('show')) {
        $navbarCollapse.collapse('hide');
    }
  });

  $('#releaseYear').attr('max',new Date().getFullYear());
  $("#castFormContainer").addClass("d-none");

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
  if ( !localStorage.getItem("wishlistIds") || localStorage.getItem("wishlistIds") == null ) {
    ajaxCall("GET",wishlistApi  , null, (wishlist)=>{
      const wishlistIds = wishlist.map((movie) => movie.id); 
      localStorage.setItem("wishlistIds", JSON.stringify(wishlistIds));    
      renderMovies();
    },ecb  )}
    else
    renderMovies();
}



renderMovies = () => {
  $("#castFormContainer").addClass("d-none");
  $("#wishlistContainer").addClass("d-none");
  $("#moviesContainer").removeClass("d-none");
  $("#addMovie").show();
  if ( !localStorage.getItem("movies") || localStorage.getItem("movies") == null ) {
    ajaxCall("GET",moviesApi  , null, (moviesWithCasts)=>{
      localStorage.setItem("movies", JSON.stringify(moviesWithCasts));    
      creatcards(moviesWithCasts);
    },ecb
  )}
    else
    creatcards(JSON.parse(localStorage.getItem("movies")));
  
}

creatcards = (allMovies) =>{
  let wishlistIds = JSON.parse(localStorage.getItem("wishlistIds") || [])
  let moviesHtml = "";
  allMovies.forEach((movieWithC) => {
    const isInWishlist = wishlistIds.includes(movieWithC.movie.id);
    moviesHtml += `
          <div class="col-lg-3 col-md-4 col-sm-6">
              <div class="card h-100">
                  <img loading="lazy" src="${movieWithC.movie.photoUrl}" class="card-img-top" alt="${movieWithC.movie.title}  loading="lazy"">
                  <div class="card-body">
                      <h5 class="card-title">${movieWithC.movie.title}</h5>
                      <p class="card-text">${movieWithC.movie.description}</p>
                  </div>
                  <div class="card-footer">
                      <div class="mb-2">
                          <span class="badge bg-primary">Rating: ${movieWithC.movie.rating}</span>
                          <span class="badge bg-secondary">Year: ${movieWithC.movie.releaseYear}</span>
                          <span class="badge bg-info">Duration: ${movieWithC.movie.duration} min</span>
                      </div>
                      <button class="btn btn-primary w-100" 
                        id="button-${movieWithC.movie.id}" 
                        onclick="addToWishlist(${movieWithC.movie.id})"
                        ${isInWishlist ? "disabled" : ""}>Add to Wishlist</button>

                       <button 
                        class="btn btn-secondary w-100 mt-2 show-cast-modal" 
                        onclick ="showCasts(${movieWithC.movie.id})" 
                        data-bs-toggle="modal" 
                        data-bs-target="#castModal">
                        Show Cast
                      </button>

                  </div>
              </div>
          </div>
      `;
  });

  $("#moviesContainer").html(moviesHtml);
  hideLoading();

}

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
    text: "An error occurred .",
  });

}

showCasts=(id)=> {
     // Destroy existing datatable if it exists - common issuue with datatable
     if ($.fn.DataTable.isDataTable('#castTable')) {
      $('#castTable').DataTable().destroy();
  }
  const movieId = id;
  let allMovies = JSON.parse(localStorage.getItem("movies"))
  const selectedMovie = allMovies.find((movie) => movie.movie.id === movieId);
  const casts = selectedMovie.casts;
  const tableBody = $("#castTable tbody");
  tableBody.empty();

casts.forEach((actor) => {
  tableBody.append(`
    <tr>
      <td>${actor.name}</td>
      <td>${actor.role || "Unknown"}</td>
      <td>${actor.country || "Unknown"}</td>
    </tr>
  `);
});

$("#castTable").DataTable({
  paging: true,
  searching: true,
  info: false,
  lengthChange: false,
  pageLength: 5,
});
$(".dataTables_filter input").attr("placeholder", "By name or role...");
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
