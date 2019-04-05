let url = '/api/leaderboard'
let scoreJson = []
fetchJson(url);

function fetchJson(url) {
    return fetch(url).then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (json) {


            scoreJson = json
            mapScores(scoreJson)
        })
        .catch(error => {
            console.log(error.message);
        });
}

function mapScores(scores) {
    console.log(scores)

    scores.forEach(element => {
        let row = document.createElement('tr')
        row.innerHTML = "<td>" + element.player + "</td><td>" + element.total + "</td><td>" + element.win +
            "</td><td>" + element.lost + "</td><td>" + element.tied + "</td>"
        document.getElementById("table-rows").appendChild(row)
    });

}