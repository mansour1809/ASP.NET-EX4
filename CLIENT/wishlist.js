const wishlistApi = moviesApi + "/WishList"+ "/userId/" + localStorage.getItem("id")

$(document).ready(()=>{

    $("#showWishlist").click(renderWishList);
    $("#filterByRating").click(renderWishListByRating);
    $("#filterByDuration").click(renderWishListByDuration);

    $("#rating").on("input", function () {
      $("#filterByRating").prop("disabled", !this.value);
    });
    $("#duration").on("input", function () {
      $("#filterByDuration").prop("disabled", !this.value);
    });
    $("#filterByRating, #filterByDuration").prop("disabled", true);

})

 renderWishList = () =>{
    $("#moviesContainer").addClass("d-none");
    $("#castFormContainer").addClass("d-none");
    $("#wishlistContainer").removeClass("d-none");
    $("#addMovie").hide();
    ajaxCall("GET",wishlistApi  , null, scbShowWishList, ecbShowWishList);

}
renderWishListByRating = () =>{
    $("#duration").val("");
    $("#filterByDuration").prop("disabled", true);
    ajaxCall("GET",wishlistApi + "/Rating/" + $("#rating").val(),null,scbShowWishList,ecbShowWishList);
}

renderWishListByDuration = () =>{
    $("#rating").val("");
    $("#filterByRating").prop("disabled", true);
    ajaxCall("GET",wishlistApi + "/Duration?duration=" + $("#duration").val(),null,scbShowWishList,ecbShowWishList);
}

  deleteFromWishList=(movieId)=>{
ajaxCall("DELETE",wishlistApi + "/Delete/MovieId/"+ movieId ,null,()=>{Swal.fire({
  title: "Removed!" ,
  text: "The movie is removed from the wish list!",
  icon:  "success" ,
}) 
renderWishList()},
 ()=>{ Swal.fire({
  title: "Error!" ,
  text: "The movie was not removed....",
  icon:  "Error",
})})
  }

scbShowWishList = (wishlist) => {
  if (!wishlist || wishlist.length === 0) {
    ecbShowWishList();
  return}
  let wishlistHtml = `
      ${wishlist.map((movie) => `
        <div class="col">
          <div class="card h-100 movie-card">
            <div class="img-container">
              <img src="${movie.photoUrl}" alt="${movie.title}">
            </div>
            <div class="card-body">
              <h5 class="card-title text-primary fw-bold">${movie.title}</h5>
              <p class="card-text text-muted">${movie.description}</p>
            </div>
            <div class="card-footer bg-light">
              <div class="d-flex gap-2 flex-wrap align-items-center">
                <span class="badge bg-primary">
                  <i class="fas fa-star me-1"></i>Rating: ${movie.rating}
                </span>
                <span class="badge bg-secondary">
                  <i class="fas fa-calendar me-1"></i>${movie.releaseYear}
                </span>
                <span class="badge bg-info">
                  <i class="fas fa-clock me-1"></i>${movie.duration} min
                </span>
                <!-- Delete Button -->
                <button onclick="deleteFromWishlist(${movie.id})" class="btn btn-sm btn-danger ms-auto delete-button" data-id="${movie.id}">
                  <i class="fas fa-trash-alt me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      `)
      .join("")}
    </div>
  `;

  $("#wishListMovies").html(wishlistHtml);
};

ecbShowWishList = () => {
  $("#wishListMovies").html("<p>No Movies to show</p>");
};

  addToWishlist = (movieID) => {
    ajaxCall("POST", wishlistApi + "/movieId/" + movieID , null, ()=>{
      $(`#button-${movieID}`).prop("disabled" , true);
      const cachedWishlist = JSON.parse(localStorage.getItem("wishlistIds")) || [];
    cachedWishlist.push(movieID); 
    localStorage.setItem("wishlistIds", JSON.stringify(cachedWishlist));
    Swal.fire({
      title: "Added!" ,
      text: "The movie added to the wish list!",
      icon:  "success" ,
    })
  }, ecb); 
  };

