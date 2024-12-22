const userAPI = "https://localhost:7125/api/Users";
// const userAPI = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Users/";
const wishlistApiforCertainUser = "https://localhost:7125/api/Movies" + "/Wishlist"+ "/userId/" 


$(document).ready(function () {
  // Initialize DataTable
  $("#usersTable").DataTable({
    paging: true,
    searching: true,
    info: false,
    lengthChange: false,
    pageLength: 5,
  });

//   // Handle modal opening
//   $("#wishlistModal").on("show.bs.modal", function (event) {
//     const button = $(event.relatedTarget);
//     const username = button.data("username");
//     const items = button.data("items");

//     const modal = $(this);
//     modal.find("#modalUsername").text(username);

//     const wishlistContainer = modal.find("#wishlistItems");
//     wishlistContainer.empty();

//     items.forEach((item) => {
//       wishlistContainer.append(`
//                 <div class="wishlist-item">
//                     <div class="wishlist-item-name">${item.name}</div>
//                     <div class="wishlist-item-date">
//                         Added on: ${item.date_added} - Price: ${item.price}
//                     </div>
//                 </div>
//             `);
//     });
//   });
  renderUsers();
});

renderUsers = () => {
//   showMovies = (castId) => {
    // Destroy existing datatable if it exists - common issuue with datatable
    if ($.fn.DataTable.isDataTable("#usersTable")) {
      $("#usersTable").DataTable().destroy();
    }
    ajaxCall(
      "GET",userAPI,null,
      (usersList) => {
        console.log(usersList)
        const tableBody = $("#usersTable tbody");
        tableBody.empty();
        usersList.forEach((user) => {
          tableBody.append(
            `<tr>
            <td>${user.userName}</td>
            <td>${user.email || "Unknown"}</td>
            <td><button class="detail-btn detail-btn-info " 
            onclick="showWishList(${user.id})">View</button></td>
          </tr>`
          );
        });
      },
      ()=>Swal.fire({
        title: "OH NO!!!!!!!",
        text: "Something went wrong with the server!",
        icon: "error",
      })
    );
  };

    const showWishList = (userId) => {
        console.log(wishlistApiforCertainUser + userId)

        ajaxCall(
          "GET",
          wishlistApiforCertainUser + userId,
          null,
          (wishlist) => {
            console.log(wishlist)
            $("#wishlistItems").empty();

            if (wishlist.length > 0) {
              wishlist.forEach((movie) => {
                $("#wishlistItems").append(`
                  <div class="wishlist-item">
                    <p><strong>Title:</strong> ${movie.title}</p>
                    <p><strong>Genre:</strong> ${movie.genre || "Unknown"}</p>
                    <p><strong>Release Date:</strong> ${movie.releaseYear || "Unknown"}</p>
                    <hr>
                  </div>
                `);
              });
            } else {
                $("#wishlistItems").append(`<p>No items in wishlist.</p>`);
            }
      
            // Show the modal
            $("#wishlistModal").modal("show");
          },
          () => {
            // Error callback
            Swal.fire({
              title: "Error",
              text: "Could not retrieve the wishlist for the selected user.",
              icon: "error",
            });
          }
        );
      };


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
