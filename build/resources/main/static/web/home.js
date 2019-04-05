function fetchLogin() {
  fetch('/api/login', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${ form[0].value }&password=${ form[1].value }`,
  }).then(function (json) {

    console.log(json)
  })
}

function fetchMike() {
  let form = document.getElementById('login-form');
  fetch('/api/login', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${ form["username"].value }&password=${ form["password"].value }`,
  }).then(function () {
    window.location.replace("/web/games.html");

  })
}


function login() {

  var form = document.getElementById('login-form');

  $.post("/api/login", {
      username: form["username"].value,
      password: form["password"].value
    })
    .done(function () {
      console.log("logged in!");



    })
    .fail(function () {
      console.log("failed to log in!");
    });
}


function logout() {

  $.post("/api/logout")
    .done()
    .fail();
}