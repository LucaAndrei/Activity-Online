"use strict";
let CHALLENGES = [
    {
        challenges: ['speak', 'draw', 'mime', 'speak', 'speak', 'mime1', 'speak1', 'draw1'],
        border: 'red'
    },
    {
        challenges: ['mime', 'speak', 'draw1', 'speak1', 'draw', 'mime', 'mime1', 'draw'],
        border: 'light-blue'
    },
    {
        challenges: ['speak', 'mime', 'mime1', 'mime', 'draw1', 'draw', 'draw1', 'mime1'],
        border: 'light-yellow'
    },
    {
        challenges: ['draw1', 'speak', 'mime', 'speak', 'mime1', 'speak1', 'draw', 'draw1'],
        border: 'red'
    },
    {
        challenges: ['draw', 'mime1', 'mime1', 'speak', 'mime', 'draw1', 'draw', 'mime'],
        border: 'light-blue'
    },
    {
        challenges: ['draw1', 'speak1', 'speak1', 'mime1', 'speak', 'draw', 'mime', 'mime1'],
        border: 'light-yellow'
    }
]
const BoardGame = (($, uiService, storageService, components) => {
    const MAX_POINTS = 48;
    let CURRENT_SELECTED_CARD = null;
    const gameDetails = JSON.parse(storageService.get('activity-game-details'));
    console.log("TCL: BoardGame -> gameDetails", gameDetails)
    if (gameDetails.currentPlayer === "") {
        $('.currentPlayer').html(`<p class="current-player">Current Player : ${getCurrentPlayer()}</p>`)
    }
    var init = () => {

        setupBoard();
        $('#exampleModal').modal({ backdrop: 'static', show: false })

        $(".startTimer").click(function () {
            console.log("start timer click")
        })
        $(".wrongAnswer").click(function () {
            console.log("wrongAnswer click")
            // $('#exampleModal')
            console.log("TCL: init -> $('#exampleModal')", $('#exampleModal'))
            $('#exampleModal').modal('hide')
        })
        // $(".correctAnswer").click(function () {
        //     console.log("correctAnswer click")
        //     $('#exampleModal').modal('hide')
        // })

        $('#exampleModal').on('show.bs.modal', function () {
            const card = drawCard();
            const x = $('#exampleModal').find('.card-challenge')
            console.log("TCL: init -> x", x)
            x.each(function (index) {
                console.log("TCL: init -> index", index, $(this))
                $(this).find('.text').text(`${CURRENT_SELECTED_CARD[$(this).find('.text').attr('challenge')]}`)
                const currentPlayer = getCurrentPlayer();
            })
            //.html('<p>myData</p>');
        })

        gameDetails.teams.forEach(team => {
            console.log("TCL: init -> team", team)
            const classes = `.diamond.${team.teamName}`
            console.log("TCL: init -> classes ", classes)
            const q = $(classes);
            console.log("TCL: init -> q", q)
            $(classes).html(`<div class='pawn ${team.teamName}'></div>`)
            // console.log("TCL: init -> $(`.diamond .${team.teamName}`)", $(classes))

            // $(`.diamond.${team.teamName}`).append(`<div class='pawn ${team.teamName}'`)
        })

        $('.points').click(function (e) {
            console.log("points clicked")
            const t = $(e.currentTarget)
            console.log("TCL: init -> t", t)
            // t.attr('points');
            console.log("TCL: init -> t.attr('points');", t.attr('points'))
            CURRENT_SELECTED_CARD = drawCard(t.attr('points'))
            $("#exampleModal").modal('show');
        })


        // $.getJSON("js/data.json", data => {
        //     console.log("game setup TCL: data", data)
        // })
    }

    function drawCard(points) {
        return {
            'draw': '1',
            'speak': '2',
            'mime': '3',
            'draw1': '4',
            'speak1': '5',
            'mime1': '6',
        }
    }

    function getCurrentPlayer() {
        return gameDetails.teams[0].players[0];
    }

    function setupBoard() {
        const challengesDiv = $('.challenges');
        console.log("TCL: setupBoard -> challengesDiv", challengesDiv)
        let challengesHtml = '';
        for (var i = 0; i < CHALLENGES.length; i++) {
            let section = CHALLENGES[i];
            console.log("TCL: setupBoard -> section", section.challenges)
            let firstRow = `<div class='challenges--row border-${section.border}'>`;
            let secondRow = `<div class='challenges--row border-${section.border}'>`;
            console.log("TCL: setupBoard -> (section.challenges.length / 2) - 1", (section.challenges.length / 2) - 1)

            for (var j = 0; j < section.challenges.length / 2; j++) {
                console.log("TCL: setupBoard -> j", j, section.challenges[j])
                if (i === 0 && j === 0) {
                    firstRow += `<div class='challenge ${section.challenges[j]} rounded-0'></div>`
                } else {
                    firstRow += `<div class='challenge ${section.challenges[j]}'></div>`
                }
            }
            firstRow += '</div>'
            console.log("TCL: setupBoard -> section.challenges.length", section.challenges.length)

            for (var j = section.challenges.length / 2; j < section.challenges.length; j++) {
                if (i === CHALLENGES.length - 1 && j === section.challenges.length) {
                    secondRow += `<div class='challenge ${section.challenges[j]} rounded-0'></div>`
                } else {
                    secondRow += `<div class='challenge ${section.challenges[j]}'></div>`
                }
            }
            secondRow += '</div>'
            console.log("TCL: setupBoard -> secondRow", secondRow)


            console.log("TCL: setupBoard -> section", section)
            challengesHtml += `${firstRow}${secondRow}`
        }
        challengesDiv.html(challengesHtml)
    }


    return {
        init
    }

})
module.exports = BoardGame;