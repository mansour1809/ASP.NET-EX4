const castsApi = "https://localhost:7125/api/Casts";
// const castsApi = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Casts";

$(document).ready(()=>{

$("#addMovie").click(() => {
    $("#addMovieModal").modal("show");
  });
  

    $("#showCasts").click(() => {
        $("#moviesContainer").addClass('d-none');
        $("#wishlistContainer").addClass('d-none');
        $("#castFormContainer").removeClass('d-none');
        $("#addMovie").hide();
        ajaxCall("GET", castsApi, null, 
            (casts)=>{
            $("#castsDetails").empty().addClass('casts-grid');
            casts.forEach(addSingleCastToDOM)}
            , castecb);
    });

    $("#castForm").submit(submitCasts);
    $("#dateOfBirth").on("input", () => {
      $("#dateError").hide();
    });    
})

submitCasts = (event) => {
    event.preventDefault();
    if (checkYear()) {
      const newCast = {
        id: "",
        name: $("#name").val(),
        role: $("#role").val(),
        dateOfBirth: $("#dateOfBirth").val(),
        country: $("#country").val(),
        photoUrl: $("#photoUrl").val(),
      };
      ajaxCall("POST", castsApi, JSON.stringify(newCast), (data) => {
        Swal.fire({
            title: data ? "The cast has been added!" : "The cast already exists!",
            text: data ? "Form submitted successfully!" : "Add one with a different name, please!",
            icon: data ? "success" : "error",
          });
          (addSingleCastToDOM(newCast))
        },castecb);
    }
  };


   addSingleCastToDOM = (cast) => {
    const castElement = `
                <div class="cast-card">
                    <img src="${cast.photoUrl}" alt="${cast.name}" class="cast-photo">
                    <div class="cast-info">
                        <h3>${cast.name}</h3>
                        <p><strong>Role:</strong> ${cast.role}</p>
                        <p><strong>Date of Birth:</strong> ${cast.dateOfBirth}</p>
                        <p><strong>Country:</strong> ${cast.country}</p>
                    </div>
                    <button class="add-to-movie-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#movieSearchModal"
                            data-cast-id="${cast.id}"
                            data-cast-name="${cast.name}
                            onclick="">
                        Add to Movie
                    </button>
                </div>`;
    $("#castsDetails").append(castElement);
  };


  castecb = () => {
    Swal.fire({
      title: "OH NO!!!!!!!",
      text: "Something went wrong with the server!",
      icon: "error",
    });
  };


  checkYear = () => {
    const currentYear = new Date().getFullYear();
    const yearOfBirth = new Date($("#dateOfBirth").val()).getFullYear();
    if (yearOfBirth < currentYear - 100 || yearOfBirth > currentYear - 18) {
      $("#dateError")
        .html(
          `Year of birth must be between ${currentYear - 100} and ${
            currentYear - 18
          }.`
        )
        .show();
      return false;
    }
    return true;
  };
  

