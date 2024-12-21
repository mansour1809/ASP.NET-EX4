const userAPI = "https://localhost:7125/api/Users/";
// const userAPI = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Users/";

$(document).ready(() => {

  $("#togglePassword").on("click", function () {
    const passwordInput = $("#passwordLogin");
    const icon = $(this).find("i");

    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
        icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        passwordInput.attr("type", "password");
        icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});


  localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");
    localStorage.removeItem("wishlistIds");
    localStorage.removeItem("movies");

    $("#username").on("input", () => {
      $("#userError").hide();
    });

    $("#signupButton").click(() => {
      $("#signupModal").modal("show");
    });

  $("#login-btn").click((event) => {
    event.preventDefault();
    const user = {
      Id: 0,
      userName: $("#usernameLogin").val(),
      email: "",
      password: $("#passwordLogin").val()
    };
    ajaxCall(
      "POST",
      userAPI + "login",
      JSON.stringify(user),
      cbLogin,
      ecbLogin
    );

  })

    $("#registerForm").submit((e) => {
      e.preventDefault();
      const newUser = {
        id:0,
        userName:$('#username').val(),
        email:$('#email').val(),
        password:$('#password').val()
      }
      ajaxCall("POST", userAPI +"register", JSON.stringify(newUser),()=>{
        Swal.fire({
          title: "You can login now",
          text: "Register successful!",
          icon: "success",
        })
      } ,()=>{
        $("#userError").html(`<span>User already exist!!!</span>`).show();}
      );
  });

});

cbLogin = (data) => {
  localStorage.setItem("isLoggedIn", "true"); 
  localStorage.setItem("userName", data.userName);
  localStorage.setItem("id", data.id);
  Swal.fire({
    title: "Welcome!",
    text: "Login successful!",
    icon: "success",
  }).then(() => {
    window.location.href = "movies.html";
  });
};

ecbLogin = (xhr) => {
  if (xhr.status === 401) {
    Swal.fire({
      title: "Unauthorized",
      text: "Invalid username or password!",
      icon: "error",
    });
  } else if (xhr.status === 400) {
    Swal.fire({
      title: "Bad Request",
      text: "Check the data you entered and try again!",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Server Error",
      text: "Something went wrong on the server!",
      icon: "error",
    });
  }
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
