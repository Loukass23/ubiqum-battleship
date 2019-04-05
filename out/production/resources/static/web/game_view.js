new Vue({
    el: '#app',
    data: {
        url: '/api/game_view/',
        gpId: new URLSearchParams(window.location.search).get("gp"),
        refresh: null,
        gameOver: false,
        loggedUser: null,
        gamePlayerId: null,
        gameId: null,
        scores: [],
        gameGrid: {
            horizontal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            vertical: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        },
        shipLocations: [],
        salvoesLocations: [],
        opponentSalvoesLocations: [],
        hits: [],
        sunk: [],
        readytoPlay: false,
        fleetReady: false,
        currentSalvo: [],
        dragged: "",
        invalidPos: false,
        shadow: [],
        currentTurn: null,
        opponentTurn: null,
        shipFleet: {
            destroyer: {
                type: "Destroyer",
                set: false,
                origine: "",
                locations: "",
                horizontal: true,
                size: 2,
                width: "80px",
                transform: [30, 25],
                img: "https://res.cloudinary.com/ds3w3iwbk/image/upload/v1549969552/destroyer.png"
            },
            carrier: {
                type: "Carrier",
                set: false,
                origine: "",
                locations: "",
                horizontal: true,
                size: 5,
                width: "200px",
                transform: [90, 80],
                img: "https://res.cloudinary.com/ds3w3iwbk/image/upload/v1549969552/destroyer.png"
            },
            submarine: {
                type: "Submarine",
                set: false,
                origine: "",
                locations: "",
                horizontal: true,
                size: 3,
                width: "110px",
                transform: [45, 40],
                img: "https://res.cloudinary.com/ds3w3iwbk/image/upload/v1550060557/kisspng-kilo-class-submarine-typhoon-class-submarine-akula-class-room-5acd73cbaea0a1.8466053715234139637153.png"
            },
            cruiser: {
                type: "Cruiser",
                set: false,
                origine: "",
                locations: "",
                horizontal: true,
                size: 3,
                width: "",
                transform: [40, 40],
                img: "https://res.cloudinary.com/ds3w3iwbk/image/upload/v1550060044/cruiser.png"
            },
            battleship: {
                type: "Battleship",
                set: false,
                origine: "",
                locations: "",
                horizontal: true,
                size: 4,
                width: "160px",
                transform: [70, 60],
                img: "https://res.cloudinary.com/ds3w3iwbk/image/upload/v1550060383/battleship.png"
            },

        }
    },
    methods: {
        refreshData() {
            this.refresh = setInterval(() => {
                this.fetchJson(this.url + this.gpId)

            }, 9000)
        },
        fetchJson(url) {
            axios
                .get(url)
                .then(response => {
                    console.log(response.data)
                    this.gameId = response.data.game.id
                    this.gameOver = response.data.game.gameOver
                    this.loggedUser = response.data.player
                    this.gamePlayerId = response.data.id
                    this.currentTurn = response.data.turn
                    this.opponentTurn = response.data.opponentTurn
                    this.hits = response.data.hits
                    this.scores = response.data.game.scores
                    this.setHits(response.data.hits)

                    this.setShips(response.data.ships)
                    this.setSalvoes(response.data.salvoes)
                    this.setOpponentSalvoes(response.data.opponentSalvoes)

                    this.isGameOver()
                    response.data.opponentSalvoes.forEach(e => this.opponentSalvoesLocations = this.opponentSalvoesLocations.concat(e))
                })
                .catch(error => console.log(error))
        },
        setHits(hits) {
            this.sunk = []

            hits.forEach((e) => {

                if (e.type) this.sunk.push(e.type)
            });

        },
        isGameOver() {
            console.log(this.sunk)
            if (!this.gameOver && this.currentTurn == this.opponentTurn && this.sunk.length == 5) {
                console.log('adding scores')
                this.addScores();
            }

        },
        setOpponentSalvoes(salvoes) {
            let turn = 0
            salvoes.forEach(salvo => {
                this.opponentSalvoesLocations = this.opponentSalvoesLocations.concat(salvo)
                if (salvo.turn > turn) turn = salvo.turn
            })

        },
        setModal() {

        },
        setSalvoes(salvoes) {
            let turn = 0
            salvoes.forEach(salvo => {
                this.salvoesLocations = this.salvoesLocations.concat(salvo)
                if (salvo.turn > turn) turn = salvo.turn
            })

        },
        setShips(ships) {
            let count = 0;
            ships.forEach(ship => {
                let key = ship.type.toLowerCase()
                this.shipFleet[key].set = true
                this.shipFleet[key].locations = ship.locations
                this.shipFleet[key].origine = ship.locations[0]
                this.shipFleet[key].horizontal = ship.horizontal
                count++

                this.shipLocations = this.shipLocations.concat(ship.locations)
            })

            if (count == 5) this.readytoPlay = true

        },
        addScores() {
            $.post("/api/games/players/" + this.gamePlayerId + "/score", {

                })
                .done(function () {
                    console.log("scores added");
                    location.reload();
                })
                .fail(function () {
                    console.log("failed to add score");
                });
        },
        addShip() {
            for (let key in this.shipFleet) {
                $.post({
                        url: "/api/games/players/" + this.gamePlayerId + "/ships",
                        data: JSON.stringify(
                            [{
                                "type": this.shipFleet[key].type,
                                "locations": this.shipFleet[key].locations,
                                "horizontal": this.shipFleet[key].horizontal,
                                "size": this.shipFleet[key].size
                            }]
                        ),
                        dataType: "text",
                        contentType: "application/json"
                    })
                    .done(function () {
                        this.readytoPlay = true
                        location.reload();

                    })
                    .fail(function () {
                        console.log("fail to add ship")
                    })
            }
        },
        addSalvo() {

            $.post({
                    url: "/api/games/players/" + this.gamePlayerId + "/salvoes",
                    data: JSON.stringify(
                        [{
                            "turn": this.currentTurn,
                            "salvoesLocations": this.currentSalvo
                        }]
                    ),
                    dataType: "text",
                    contentType: "application/json"
                })
                .done(function () {
                    console.log("added salvo")
                    location.reload();

                })
                .fail(function () {
                    console.log("fail to salvo")
                })

        },
        isShip_old(cell) {
            return this.shipLocations.includes(cell)
        },
        isShip(cell) {
            let ship = false
            for (let key in this.shipFleet) {
                if (this.shipFleet[key].locations.includes(cell)) ship = true
            }
            return ship
        },
        isFired(cell) {
            let turn = null
            this.salvoesLocations.forEach(e => {
                if (e.salvoesLocations.includes(cell))
                    turn = e.turn
            })
            return turn
        },
        isHit(cell) {
            let turn = null
            this.opponentSalvoesLocations.forEach(e => {
                if (e.salvoesLocations.includes(cell))
                    turn = e.turn
            })
            return this.shipLocations.includes(cell) ? turn : null
        },
        hasHit(cell) {
            let turn = null

            this.hits.forEach(e => {

                e.hit.forEach(el => {
                    if (el.hit == cell) turn = el.turn
                })
            })
            return turn
        },

        mouseonSalvoes: function (event, row, cell) {
            event.preventDefault();
            if (!this.currentSalvo[1] && !this.gameOver) {
                let div = document.getElementById("_" + row + cell)
                div.style.backgroundImage = "url('https://res.cloudinary.com/ds3w3iwbk/image/upload/c_scale,w_30/v1550137162/target_PNG38.png')"
                div.style.backgroundRepeat = "no-repeat"
                div.style.backgroundOrigin = "border-box"
            }

        },
        mouseoutSalvoes: function (event, row, cell) {
            event.preventDefault();
            document.getElementById("_" + row + cell).style.backgroundImage = ""
        },
        salvoSelect(row, cell) {
            if (this.currentSalvo[0] == (row + cell)) alert("You are firing at this position already")
            else if (this.isFired(row + cell)) {
                alert("You already fired at this position")
            } else {
                this.currentSalvo.length < 2 ? this.currentSalvo.push(row + cell) : alert('2 salvo allowed')
            }
        },
        allowDrop: function (event, row, cell) {
            let key = this.dragged.toLowerCase()
            this.shadow = this.setLocations(row, cell, this.shipFleet[key].size, this.shipFleet[key].horizontal)
            this.shadow.forEach(e => {

                if (document.getElementById(e)) {
                    if (this.isShip(e)) {
                        document.getElementById(e).style.backgroundColor = "red"
                        this.invalidPos = true
                    } else document.getElementById(e).style.backgroundColor = "steelblue"
                } else this.invalidPos = true
            })

            event.preventDefault();
        },
        dragLeave: function (event, row, cell) {
            const data = event.dataTransfer.getData("text");
            this.invalidPos = false
            this.shadow.forEach(e => {
                if (document.getElementById(e)) document.getElementById(e).style.backgroundColor = ""
            })
            event.preventDefault();
        },
        drag: function (event) {
            this.dragged = event.srcElement.id
            event.dataTransfer.setData("text", event.target.id);

        },
        drop: function (event, row, cell) {
            if (this.invalidPos) alert("Invalid position")
            event.preventDefault();
            this.shadow.forEach(e => document.getElementById(e).style.backgroundColor = "")
            const data = event.dataTransfer.getData("text");
            event.preventDefault();
            event.target.appendChild(document.getElementById(data));
            let key = data.toLowerCase()
            this.shipFleet[key].locations = this.setLocations(row, cell, this.shipFleet[key].size, this.shipFleet[key].horizontal)
            this.shipFleet[key].set = true
            this.isFleetReady();
        },
        isFleetReady() {
            let count = 0;
            for (let key in this.shipFleet) {
                if (this.shipFleet[key].set == true) count++
            }
            if (count == 5) this.fleetReady = true
        },
        setLocations(row, cell, size, horizontal) {
            let origineIndex
            let position = []
            if (horizontal) {
                origineIndex = this.gameGrid.horizontal.indexOf(cell)
                for (let i = 0; i < size; i++) {
                    position.push(row + this.gameGrid.horizontal[origineIndex + i])

                }
            } else {
                origineIndex = this.gameGrid.vertical.indexOf(row)
                for (let i = 0; i < size; i++) {
                    position.push(this.gameGrid.vertical[origineIndex + i] + cell)

                }
            }

            return position
        },
        rotateDestroyer() {
            const des = document.getElementById('Destroyer')
            if (this.shipFleet.destroyer.horizontal) {
                this.shipFleet.destroyer.horizontal = false
                des.style.webkitTransform = "rotate(90deg) translateY(20px) translateX(25px)"
            } else {
                this.shipFleet.destroyer.horizontal = true
                des.style.webkitTransform = "rotate(0deg) translateY(0px) translateX(0px)"
            }
        },
        rotateCarrier() {
            const des = document.getElementById('Carrier')
            if (this.shipFleet.carrier.horizontal) {
                this.shipFleet.carrier.horizontal = false
                des.style.webkitTransform = "rotate(90deg) translateY(75px) translateX(80px)"
            } else {
                this.shipFleet.carrier.horizontal = true
                des.style.webkitTransform = "rotate(0deg) translateY(0px) translateX(0px)"
            }
        },
        rotateSubmarine() {
            const des = document.getElementById('Submarine')
            if (this.shipFleet.submarine.horizontal) {
                this.shipFleet.submarine.horizontal = false
                des.style.webkitTransform = "rotate(90deg) translateY(30px) translateX(40px)"
            } else {
                this.shipFleet.submarine.horizontal = true
                des.style.webkitTransform = "rotate(0deg) translateY(0px) translateX(0px)"
            }
        },
        rotateCruiser() {
            const des = document.getElementById('Cruiser')

            if (this.shipFleet.cruiser.horizontal) {
                des.style.webkitTransform = "rotate(90deg) translateY(30px) translateX(40px)"
                this.shipFleet.cruiser.horizontal = false
            } else {
                this.shipFleet.cruiser.horizontal = true
                des.style.webkitTransform = "rotate(0deg) translateY(0px) translateX(0px)"
            }
        },
        rotateBattleship() {
            const des = document.getElementById('Battleship')

            if (this.shipFleet.battleship.horizontal) {
                des.style.webkitTransform = "rotate(90deg) translateY(60px) translateX(60px)"
                this.shipFleet.battleship.horizontal = false
            } else {
                this.shipFleet.battleship.horizontal = true
                des.style.webkitTransform = "rotate(0deg) translateY(0px) translateX(0px)"
            }
        },
        shipDirection(ship) {
            const key = ship.toLowerCase()
            if (!this.shipFleet[key].horizontal) {
                return "-webkit-transform: rotate(90deg) translateY(" + this.shipFleet[key].transform[0] + "px)  translateX(" + this.shipFleet[key].transform[1] + "px)"
            }
        }
    },
    created() {
        this.fetchJson(this.url + this.gpId)
        this.refreshData();


    },
    beforeDestroy() {
        clearInterval(this.refresh)

    }
});