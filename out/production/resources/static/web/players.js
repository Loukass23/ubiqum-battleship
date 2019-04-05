
new Vue({
    el: '#app',
    data: {
      url: '/api/players',
      loggedUser: null,
  
      players: []
    },
      methods: {
      fetchJson(url) {
        axios
                .get(url)
                .then(response => {
                    console.log(response.data)
                    this.players = response.data.players
                    this.loggedUser = response.data.player
                })
                .catch(error => console.log(error))
      },
      logout() {

        $.post("/api/logout")
          .done(()=> this.loggedUser = null)
          .fail();
      },
      login() {

        let form = document.getElementById('login-form');
      
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
        },
        addPlayer() {

            let form = document.getElementById('add-form');
          
            $.post("/api/players", {
                username: form["username"].value,
                password: form["password"].value
              })
              .done(function () {
                console.log("player added");          
              })
              .fail(function () {
                console.log("failed to add player");
              });
            }
    },
  
    created() {
      this.fetchJson(this.url)
  
    }
  });