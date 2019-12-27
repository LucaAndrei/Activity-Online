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
let PAWN_ELEMENTS = {
    'red': `<div class='pawn red' teamName='red'></div>`,
    'green': `<div class='pawn green' teamName='green'></div>`,
    'yellow': `<div class='pawn yellow' teamName='yellow'></div>`,
    'blue': `<div class='pawn blue' teamName='blue'></div>`,
}
const BoardGame = (($, uiService, storageService, components) => {
    const MAX_POINTS = 48;

    let CURRENT_SELECTED_CARD = null;
    let GAME_DETAILS = null;

    let CURRENT_PLAYER = null;
    let CURRENT_TEAM = null;

    let CORRECT_ANSWER = false;

    let COUNTDOWN_TIMER = null;

    let TIME = 10;

    let CARDS = [];

    let USED_CARDS = [];

    var init = () => {
        $.getJSON("components/boardgame/data-json-tradus.json", cards => {
            GAME_DETAILS = storageService.get();
            CURRENT_PLAYER = GAME_DETAILS.currentPlayer;
            CURRENT_TEAM = GAME_DETAILS.teams.find(team => team.name === CURRENT_PLAYER.team)
            USED_CARDS = GAME_DETAILS.usedCards;
            if (USED_CARDS.length > 0) {
                for(let i = 0; i < USED_CARDS.length; i++) {
                    cards = cards.filter(card => card['draw'] !== USED_CARDS[i]['draw'])
                }
            }
            CARDS = cards;
            setupBoard();
            setupPawns();
            setCurrentPlayer();
            storageService.save(GAME_DETAILS);
            setupCardEvents();

            $('#cardModal').modal({ backdrop: 'static', show: false });
        })
        
    }

    function setupBoard() {
        const challengesDiv = $('.challenges');
        let challengesHtml = '';
        for (var i = 0; i < CHALLENGES.length; i++) {
            let section = CHALLENGES[i];
            let firstRow = `<div class='challenges--row border-${section.border}'>`;
            let secondRow = `<div class='challenges--row border-${section.border}'>`;
            for (var j = 0; j < section.challenges.length / 2; j++) {
                if (i === 0 && j === 0) {
                    firstRow += `<div class='challenge ${section.challenges[j]} rounded-0'></div>`
                } else {
                    firstRow += `<div class='challenge ${section.challenges[j]}'></div>`
                }
            }
            firstRow += '</div>'
            for (var j = section.challenges.length / 2; j < section.challenges.length; j++) {
                if (i === CHALLENGES.length - 1 && j === section.challenges.length) {
                    secondRow += `<div class='challenge ${section.challenges[j]} rounded-0'></div>`
                } else {
                    secondRow += `<div class='challenge ${section.challenges[j]}'></div>`
                }
            }
            secondRow += '</div>'
            challengesHtml += `${firstRow}${secondRow}`
        }
        challengesDiv.html(challengesHtml)
    }

    function setupPawns() {
        GAME_DETAILS.teams.forEach(team => {
            const pawnHTML = `<div class='pawn ${team.name}' teamName='${team.name}'></div>`
            if (team.points > 0) {
                const challenges = $('.challenge');
                $(challenges[team.points - 1]).html(PAWN_ELEMENTS[team.name]);
            } else {
                const classes = `.diamond.${team.name}`
                $(classes).html(pawnHTML);
            }
        })
    }

    function setCurrentPlayer() {
        $('.currentPlayer').html(`<p class="current-player">Current Player : ${CURRENT_TEAM.name} - ${CURRENT_PLAYER.name}</p>`)
    }

    function setupCardEvents() {
        $(".startTimer").click(function () {
            $(".startTimer").attr('disabled', 'disabled');
            TIME = 10;
            COUNTDOWN_TIMER = setInterval(function () {
                $('.time-left').text(TIME);
                TIME -= 1;
                if (TIME < 0) {
                    clearInterval(COUNTDOWN_TIMER);
                    CORRECT_ANSWER = false;
                    $('#cardModal').modal('hide');
                }
            }, 1000);
        })
        $(".wrongAnswer").click(function () {
            CORRECT_ANSWER = false;
            clearInterval(COUNTDOWN_TIMER);
            $('#cardModal').modal('hide');
        })
        $(".correctAnswer").click(function () {
            CORRECT_ANSWER = true;
            clearInterval(COUNTDOWN_TIMER);
            $('#cardModal').modal('hide');
        })

        $('#cardModal').on('show.bs.modal', function () {
            // disable success and wrong buttons until start timer?
            $(".startTimer").attr('disabled', null);
            const cardChallenge = $('#cardModal').find('.card-challenge')

            cardChallenge.each(function (index) {
                const textElement = $(this).find('.text');
                textElement.removeClass('red');
                let challengeText = CURRENT_SELECTED_CARD[textElement.attr('challenge')];
                const isRedWord = challengeText.indexOf('red') > -1;
                if (isRedWord) {
                    textElement.addClass('red');
                    challengeText = challengeText.split(' red')[0];
                }

                
                textElement.text(challengeText)
            })
        });

        $('#cardModal').on('hide.bs.modal', function () {
            if (CORRECT_ANSWER) {
                CURRENT_TEAM.points += parseInt(CURRENT_SELECTED_CARD.points);
                setPawn();
                CORRECT_ANSWER = false;
            }
            CURRENT_PLAYER.played = true;
            if (CURRENT_TEAM.players.filter(player => player.played === false).length === 0) {
                CURRENT_TEAM.players.forEach(player => player.played = false);
            }
            findNextPlayer();
            setCurrentPlayer();
    
            const winningTeam = GAME_DETAILS.teams.find(team => team.points > MAX_POINTS);
            if (winningTeam !== undefined) {
                console.log("GAME FINISHED")
                $("#winningTeam").text(`${winningTeam.name}`)
                $('#finishModal').modal({ backdrop: 'static', show: true })
            }
            storageService.save(GAME_DETAILS);
        });

        $(".restartGame").click(() => {
            GAME_DETAILS.teams.forEach(team => team.points = 0);
            GAME_DETAILS.usedCards = [];
            storageService.save(GAME_DETAILS);
            location.reload();
        })

        $('.points').click(function (e) {
            const selectedCardPoints = $(e.currentTarget).attr('points')
            CURRENT_SELECTED_CARD = drawCard(selectedCardPoints)
            $("#cardModal").modal('show');
        })
    }


    function drawCard(points) {
        const pointsCards = CARDS.filter(card => card.points == points);
        const randomCardIndex = Math.floor(Math.random() * (pointsCards.length + 1))
        const selectedCard = pointsCards[randomCardIndex];
        CARDS = CARDS.filter(card => card['draw'] !== selectedCard['draw'])
        USED_CARDS.push(selectedCard);
        return selectedCard;
    }

    function findNextPlayer() {
        let currentTeamIndex = GAME_DETAILS.teams.findIndex(team => team.name === CURRENT_TEAM.name)
        let nextTeamIndex = 0;
        if (currentTeamIndex + 1 === GAME_DETAILS.teams.length) {
            nextTeamIndex = 0;
        } else {
            nextTeamIndex = ++currentTeamIndex;
        }
        const nextPlayer = GAME_DETAILS.teams[nextTeamIndex].players.find(player => player.played === false);
        CURRENT_TEAM = GAME_DETAILS.teams[nextTeamIndex];
        CURRENT_PLAYER = {
            ...nextPlayer,
            team: GAME_DETAILS.teams[nextTeamIndex].name
        }
    }

    function setPawn() {
        const challenges = $('.challenge');
        const currentChallenge = challenges[CURRENT_TEAM.points - 1]
        const existingPawn = $(currentChallenge).find('.pawn');

        $(`.pawn.${CURRENT_TEAM.name}`).parent().html(''); // remove pawn from current position

        if (existingPawn.length) {
            const existingPawnTeamDetails = GAME_DETAILS.teams.find(team => team.name === existingPawn.attr('teamName'));
            $(currentChallenge).html(PAWN_ELEMENTS[CURRENT_TEAM.name]);
            $(currentChallenge).prev().html(PAWN_ELEMENTS[existingPawnTeamDetails.name])
            existingPawnTeamDetails.points -= 1;
        } else {
            $(currentChallenge).html(PAWN_ELEMENTS[CURRENT_TEAM.name]);
        }
    }


    return {
        init
    }

})
module.exports = BoardGame;