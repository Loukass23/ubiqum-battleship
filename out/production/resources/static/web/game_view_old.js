let urlGameView = '/api/game_view/'
let gamePlayerId = new URLSearchParams(window.location.search).get("gp");
let shipLocations = []
let salvoesLocations = []
let opponentSalvoesLocations = []
let gameGrid = {
    horizontal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    vertical: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
}

fetchJson(urlGameView);

function setPlayer(player) {
    document.getElementById("playerName").innerHTML = player
}

function fetchJson(url) {
    console.log(url)
    return fetch(url + gamePlayerId).then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (json) {
            console.log(json)
            json.ships.forEach(e => shipLocations = shipLocations.concat(e.locations))
            json.salvoes.forEach(e => salvoesLocations = salvoesLocations.concat(e))
            json.opponentSalvoes.forEach(e => opponentSalvoesLocations = opponentSalvoesLocations.concat(e))
            setPlayer(json.player.username)
            buildGameGrid(gameGrid, 'fleet-grid')
            buildGameGrid(gameGrid, 'fired-grid')
            // buildGameTableFired(gameGrid)
        })
        .catch(error => {
            unauthorizedUser()
            console.log(error.message);
        });
}

function unauthorizedUser() {
    document.getElementById('content').innerHTML = "<h1>Unauthorized Player</h1>"

}

function buildGameGrid(gameGrid, gridType) {
    let fleetGrid = document.getElementById(gridType)

    let headerTop = document.createElement('div')
    headerTop.className = 'row text-center '

    let keyCell = document.createElement('div')
    keyCell.className = 'col-sm-1 border'
    keyCell.innerHTML = '#'
    headerTop.appendChild(keyCell)

    gameGrid.horizontal.forEach(element => {
        let cellTop = document.createElement('div')
        cellTop.className = 'col-sm-1 border'
        cellTop.innerHTML = '<b>' + element + '</b>'
        headerTop.appendChild(cellTop)
    })
    fleetGrid.appendChild(headerTop)

    for (let i in gameGrid.vertical) {
        let row = document.createElement('div')
        row.className = 'row text-center my-0'

        let headerLeft = document.createElement('div')
        headerLeft.className = 'col-sm-1 border '
        headerLeft.innerHTML = gameGrid.vertical[i]
        row.appendChild(headerLeft)

        for (let j in gameGrid.horizontal) {
            let column = document.createElement('div')
            let cellId = gameGrid.vertical[i] + gameGrid.horizontal[j]
            column.setAttribute('id', cellId)

            if (gridType == 'fleet-grid') {

                isShip(cellId) ? column.className = 'col-sm-1 border px-0 py-0 mx-0 my-0 bg-primary' : column.className = 'col-sm-1 border px-0 py-0 mx-0 my-0'
                if (isHit(cellId)) {
                    column.innerHTML = isHit(cellId)
                    column.className = 'col-sm-1 border px-0 py-0 mx-0 my-0 bg-danger'
                }
            }
            if (gridType == 'fired-grid') {
                column.className = 'col-sm-1 border px-0 py-0 mx-0 my-0'
                if (isFired(cellId) != null) {
                    column.innerHTML = isFired(cellId)
                    column.className = 'col-sm-1 border px-0 py-0 mx-0 my-0 bg-info'
                }
            }

            row.appendChild(column)
        }
        fleetGrid.appendChild(row)

    }
}

function isShip(cell) {
    return shipLocations.includes(cell)
}

function isFired(cell) {
    let turn = null
    salvoesLocations.forEach(e => {
        if (e.salvoesLocations.includes(cell))
            turn = e.turn
    })
    return turn
}

function isHit(cell) {
    let turn = null
    opponentSalvoesLocations.forEach(e => {
        if (e.salvoesLocations.includes(cell))
            turn = e.turn
    })
    return shipLocations.includes(cell) ? turn : null
}

function buildGameTable(gameGrid) {
    let thead = document.getElementById("game-table-header")
    let th0 = document.createElement('th')
    th0.innerHTML = '<b>#</b>'
    thead.appendChild(th0)
    gameGrid.horizontal.forEach(element => {
        let th = document.createElement('th')
        th.innerHTML = '<b>' + element + '</b>'
        thead.appendChild(th)
    });
    let tbody = document.getElementById("game-table")
    for (let i in gameGrid.vertical) {
        let tr = document.createElement('tr')
        let tdhead = document.createElement('td')
        tdhead.innerHTML = '<b>' + gameGrid.vertical[i] + '</b>'
        tr.appendChild(tdhead)
        for (let j in gameGrid.horizontal) {
            let td = document.createElement('td')
            if (shipLocations.includes(gameGrid.vertical[i] + gameGrid.horizontal[j])) td.className = "text-primary bg-primary"
            td.innerHTML = gameGrid.vertical[i] + gameGrid.horizontal[j]
            td.setAttribute('id', gameGrid.vertical[i] + gameGrid.horizontal[j])
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }
}

function buildGameTableFired(gameGrid) {
    let thead = document.getElementById("game-table-header-fired")
    let th0 = document.createElement('th')
    th0.innerHTML = '<b>#</b>'
    thead.appendChild(th0)
    gameGrid.horizontal.forEach(element => {
        let th = document.createElement('th')
        th.innerHTML = '<b>' + element + '</b>'
        thead.appendChild(th)
    });
    let tbody = document.getElementById("game-table-fired")
    for (let i in gameGrid.vertical) {
        let tr = document.createElement('tr')
        let tdhead = document.createElement('td')
        tdhead.innerHTML = '<b>' + gameGrid.vertical[i] + '</b>'
        tr.appendChild(tdhead)
        for (let j in gameGrid.horizontal) {
            let td = document.createElement('td')
            if (salvoesLocations.includes(gameGrid.vertical[i] + gameGrid.horizontal[j])) td.className = " bg-danger"

            td.innerHTML = gameGrid.vertical[i] + gameGrid.horizontal[j]
            td.setAttribute('id', gameGrid.vertical[i] + gameGrid.horizontal[j])
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }
}