"use strict";

const GameSetup = (($, uiService, storageService, components) => {

    const MIN_TEAMS = 2;
    const MAX_TEAMS = 4;
    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 16;
    const players = [];

    var init = () => {
        console.log("setup ", $, $(".counter__increment, .counter__decrement"))
        $(".counter__increment, .counter__decrement").click(function (e) {
            var counterInput = $(this).parent().find(".counter__input");
            var counterInput__name = $(this).parent().find(".counter__input").attr("name");

            var currentVal = parseInt($(this).parent().find(".counter__input").val());

            if (currentVal != NaN && $(this).hasClass('counter__increment')) {
                if (counterInput__name === 'playersCounter') {
                    if (currentVal < MAX_PLAYERS) {
                        counterInput.val(currentVal + 1);
                    }
                } else if (counterInput__name === 'teamsCounter') {
                    if (currentVal < MAX_TEAMS) {
                        counterInput.val(currentVal + 1);
                    }
                }
            } else if (currentVal != NaN && $(this).hasClass('counter__decrement')) {
                if (counterInput__name === 'playersCounter') {
                    if (currentVal > MIN_PLAYERS) {
                        counterInput.val(currentVal - 1);
                    }
                } else if (counterInput__name === 'teamsCounter') {
                    if (currentVal > MIN_TEAMS) {
                        counterInput.val(currentVal - 1);
                    }
                }
            }
            saveNames();
            setNameInputs();
            isReadyForStart();

        });
        $("#begin").click(function () {

            saveNames();
            console.log("begin click load game html", players);
            // $("#placeholder").load("game.html")\
            const teamNames = ['red', 'green', 'blue', 'yellow']
            const teams = [];
            for(var i = 0 ; i < players.length; i++) {
                teams.push({
                    teamName: teamNames[i],
                    players: players[i],
                    points: 0
                })
            }
            const gameDetails = {
                teams: teams,
                currentPlayer: '',
            }
            storageService.save('activity-game-details', JSON.stringify(gameDetails));
            const gd = storageService.get('activity-game-details')
            console.log("TCL: init -> gd", gd)
            const x =JSON.parse(gd);
            console.log("TCL: init -> x", x)
            if(isReadyForStart()) {
                console.log("START GAME");
                uiService.loadTemplate(components['boardgame'].templateUrl, () => {
                    require('../boardgame/boardgame')($, uiService, storageService, components).init();
                })
            }
        });

        $.getJSON("js/data.json", data => {
            console.log("game setup TCL: data", data)
        })
        saveNames();
        setNameInputs();
        
        if (isReadyForStart()) {
            console.log("START GAME 111")
        } else {
            disableBeginBtn();
        }
    }

    function disableBeginBtn() {
        $("#begin").attr('disabled', 'disabled');
    }
    function enableBeginBtn() {
        console.log("enable begin")
        $("#begin").removeAttr('disabled');
    }
    function isReadyForStart() {
        console.log("TCL: isReadyForStart -> players", players)
        saveNames();
        const nameInputsEmpty = players.filter(team=> {
            const t = team.filter(player=> player === "");
            console.log("TCL: isReadyForStart -> t", t)
            return t.length > 0
        }).length
        console.log("TCL: isReadyForStart -> nameInputsEmpty", nameInputsEmpty)
        return nameInputsEmpty === 0;
    }

    function saveNames() {
        const teams = getTeams();
        for (var i = 0; i < teams.length; i++) {
            players[i] = [];
            for (var j = 0; j < teams[i]; j++) {
                const playerName = $(`[name='player_${i}_${j}']`).val() || '';
                players[i].push(playerName);
            }
        }
        console.log("TCL: saveNames -> players", players)

    }

    function getTeams() {
        const teams = [];
        const noOfTeams = $('[name="teamsCounter"]').val();
        const noOfPlayers = $('[name="playersCounter"]').val();
        for (var i = 0; i < noOfTeams; i++) {
            teams[i] = parseInt(noOfPlayers / noOfTeams);
        }
        for (var i = 0; i < noOfPlayers % noOfTeams; i++) {
            teams[i] += 1;
        }
        return teams;
    }

    function setNameInputs() {
        const teams = getTeams();
        console.log("TCL: init -> teams", teams)
        $('.name-input-container').html('');
        for (var i = 0; i < teams.length; i++) {
            let inputs = '';
            for (var j = 0; j < teams[i]; j++) {
                const playerName = players[i][j] || '';
                inputs += `<input class='name-input form-control' type='text' name='player_${i}_${j}' value='${playerName}' />`
            }
            const teamDiv = `
                <div class='col-${12 / teams.length} d-flex align-items-center flex-column'>
                    <p>Team ${i+1}</p>
                    ${inputs}
                </div>
            `;
            console.log("TCL: init -> teamDiv", teamDiv)
            $('.name-input-container').append(teamDiv);
        }
        $('.name-input').keyup(function(e) {
            if(!isReadyForStart()) {
                disableBeginBtn();
            } else {
                enableBeginBtn();
            }
        })
    }

    return {
        init
    }

})
module.exports = GameSetup;