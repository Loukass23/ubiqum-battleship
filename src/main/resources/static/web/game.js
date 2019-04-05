
new Vue({
    el: '#app',
    data: {
      url: '/api/game/',
      loggedUser: null,
      authorizedPlayer: true,
      game: []
    },
      methods: {
      fetchJson(url) {
        axios
                .get(url)
                .then(response => {
                    console.log(response.data)
                    this.loggedUser = response.data.player
                    if(response.data.error){
                        this.authorizedPlayer = false
                        console.log(response.data.player.statusCodeValue)
                    } 
                    else{
                    this.game = response.data.game
                   
                   }
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
        }
    },
  
    created() {
    const gameId = new URLSearchParams(window.location.search).get("gp");
    this.fetchJson(this.url+gameId)
  
    }
  });