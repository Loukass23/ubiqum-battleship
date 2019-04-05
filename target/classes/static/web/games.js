new Vue({
  el: '#app',
  data: {
    url: '/api/games',
    loggedUser: [],
    games: [],
    players: [],
    refresh: null,
  },
  methods: {
    refreshData() {
      this.refresh = setInterval(() => {
        this.fetchJson(this.url)

      }, 9000)
    },
    fetchJson(url) {
      axios
        .get(url)
        .then(response => {
          console.log(response.data)
          this.games = response.data.games
          this.loggedUser = response.data.player
          this.setPlayers();
        })
        .catch(error => console.log(error))
    },
    setPlayers() {
      this.games.forEach((element, index) => {
        let player1
        let player2;
        element.gamePlayers[0] ? player1 = element.gamePlayers[0].player.name : player1 = null
        element.gamePlayers[1] ? player2 = element.gamePlayers[1].player.name : player2 = null
        this.players.push({
          game: index,
          player_1: player1,
          player_2: player2
        })
      });

    },
    selectGame(gameID) {
      window.location.href = 'game.html?gp=' + gameID
    },
    resumeGame(gameID) {
      let game = this.games.filter(e => e.id == gameID)[0]
      console.log(game)
      let gp = game.gamePlayers.filter(e => e.player.name == this.loggedUser.username)[0]
      // game.gamePlayers[0].player.name == this.loggedUser.username ? gp = game.gamePlayers[0].player.name : gp = game.gamePlayers[0].player.name
      window.location.href = 'game-view.html?gp=' + gp.id
      console.log(gp)
    },
    logout() {

      $.post("/api/logout")
        .done(() => this.loggedUser = null)
        .fail();
    },
    login() {


      $.post("/api/login", {
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        })
        .done(function () {
          console.log("logged in!");
          location.reload();



        })
        .fail(function () {
          console.log("failed to log in!");
        });
    },
    addGame() {
      if (this.loggedUser) {
        $.post("/api/games", {
            playerName: this.loggedUser.username
          })
          .done(function () {
            console.log("Game added");
            location.reload();


          })
          .fail(function () {
            console.log("failed to add player");
          });
      } else alert('You must be logged in to add games!')
    },
    addPlayertoGame(gameID) {
      if (this.loggedUser) {
        $.post("/api/game/" + gameID + "/player", {
            playerName: this.loggedUser.username
          })
          .done(function () {
            console.log("Player added to game" + gameID);
            location.reload();


          })
          .fail(function () {
            console.log("failed to add player to game");
          });
      } else alert('You must be logged in to join a game!')
    }
  },

  created() {
    this.fetchJson(this.url)
    this.refreshData();

  }
});