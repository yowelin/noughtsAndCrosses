// human
var huPlayer;
// ai
var aiPlayer;
// this is the atrBoard flattened and filled with some values to easier asses the Artificial Intelligence.
//var origBoard = ['nought', 1, 'cross', 3, 4, 'cross', 6, 'nought', 'nought'];
var origBoard;
// ai first move
var isAiMoveFirst;
// is game running
var isGameRunning = false;
//keeps count of function calls
var fc = 0;
// finding the ultimate play on the game that favors the computer
var bestSpot;
//available spots
window.addEventListener('load', function () {
    var gameStatus = document.getElementById('gameStatus');
    document.getElementById('startButton').onclick = function (e) {
        e = e || event;
        var target = e.target || e.srcElement;
        origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (var i = 0; i < origBoard.length; i++) {
            var cell = document.getElementById(i);
            cell.setAttribute('class', 'empty')
            cell.innerHTML = null;
        }
        var radioCrosses = document.getElementById('crosses');
        var radioNoughts = document.getElementById('noughts');
        if (radioCrosses.checked) {
            huPlayer = 'cross';
            aiPlayer = 'nought';
        } else {
            huPlayer = 'nought';
            aiPlayer = 'cross';
        }
        var checkboxFirstMove = document.getElementById('firstMove');
        if (checkboxFirstMove.checked) {
            isAiMoveFirst = false;
        } else {
            isAiMoveFirst = true;
            aiMoves();
        }
        isGameRunning = true;
        gameStatus.innerHTML = 'Игра началась!';
        gameStatus.style.backgroundColor = 'transparent';
    }
    document.getElementById('gameField').onclick = function (e) {
        if (isGameRunning) {
            e = e || event;
            gameStatus.style.backgroundColor = 'transparent';
            var target = e.target || e.srcElement;
            var pressedCell = document.getElementById(target.id);
            if (pressedCell != undefined) {
                if (pressedCell.getAttribute('class') == 'empty') {
                    var imgHuman = document.createElement('img');
                    imgHuman.setAttribute('src', (huPlayer == 'cross' ? 'cross.png' : 'nought.png'));
                    pressedCell.appendChild(imgHuman);
                    pressedCell.setAttribute('class', 'full');
                    origBoard[target.id] = huPlayer;
                    //console.log(origBoard);
                    aiMoves();
                    var availSpots = emptyIndices(origBoard);

                    if (winning(origBoard, huPlayer)) {
                        gameStatus.innerHTML = 'Вы выиграли!';
                        isGameRunning = false;
                    } else if (winning(origBoard, aiPlayer)) {
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (availSpots.length == 0) {
                        //console.log(availSpots);
                        gameStatus.innerHTML = 'Ничья!';
                        isGameRunning = false;
                    }
                }
            }
        } else {
            if (gameStatus.style.backgroundColor == 'red') {
                gameStatus.style.backgroundColor = 'transparent';
                setTimeout(alertStatus, 200);
                /*setTimeout(gameStatus.style.backgroundColor = 'red', 5000);*/
            } else {
                alertStatus();
            }
        }
    }
});
function alertStatus() {
    gameStatus.style.backgroundColor = 'red';
}
function aiMoves() {
    //AI move
    bestSpot = minimax(origBoard, aiPlayer);
    //loging the results
    //console.log('index: ' + bestSpot.index);
    //console.log('function calls: ' + fc);
    if (bestSpot.index != undefined) {
        var aiElem = document.getElementById(bestSpot.index);
        var imgAI = document.createElement('img');
        imgAI.setAttribute('src', (aiPlayer == 'cross' ? 'cross.png' : 'nought.png'));
        aiElem.appendChild(imgAI);
        aiElem.setAttribute('class', 'full');
        origBoard[bestSpot.index] = aiPlayer;
    }
}
// the main minimax function
function minimax(atrBoard, atrPlayer) {
    //add one to function calls
    fc++;
    var availSpots = emptyIndices(atrBoard);
    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(atrBoard, huPlayer)) {
        return {score: -10};
    } else if (winning(atrBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    //an array to collect all the objects
    var movesArr = [];

    //loop through available spots
    for (var i = 0; i < availSpots.length; i++) {
        //create an object for each and store the index of that spot that was stored as a number in the object's index key
        var moveObj = {};
        moveObj.index = atrBoard[availSpots[i]];

        //set the empty spot to the current atrPlayer
        atrBoard[availSpots[i]] = atrPlayer;

        //if collect the score resulted from calling minimax on the opponent of the current atrPlayer
        if (atrPlayer == aiPlayer) {
            var result = minimax(atrBoard, huPlayer);
            moveObj.score = result.score;
        } else {
            var result = minimax(atrBoard, aiPlayer);
            moveObj.score = result.score;
        }

        //reset the spot to empty
        atrBoard[availSpots[i]] = moveObj.index;

        // push the object to the array
        movesArr.push(moveObj);
    }

    //if it is the computer's turn loop over the movesArr and choose the moveObj with the highest score
    var bestMove;
    if (atrPlayer === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < movesArr.length; i++) {
            if (movesArr[i].score > bestScore) {
                bestScore = movesArr[i].score;
                bestMove = i;
            }
        }
    } else {
        //else loop over the movesArr and choose the moveObj with the lowest score
        var bestScore = 10000;
        for (var i = 0; i < movesArr.length; i++) {
            if (movesArr[i].score < bestScore) {
                bestScore = movesArr[i].score;
                bestMove = i;
            }
        }
    }
    //return the chosen moveObj (object) from the array to the higher depth
    return movesArr[bestMove];
}

//returns the available spots on the atrBoard
function emptyIndices(atrBoard) {
    return  atrBoard.filter(s => s !== 'nought' && s !== 'cross');
}

//winning combinations using the atrBoard indexies for instace the first win could be 3 xes in a row
/*function winning(atrBoard, atrPlayer) {
    if (
            (atrBoard[0] === atrPlayer && atrBoard[1] === atrPlayer && atrBoard[2] === atrPlayer) ||
            (atrBoard[3] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[5] === atrPlayer) ||
            (atrBoard[6] === atrPlayer && atrBoard[7] === atrPlayer && atrBoard[8] === atrPlayer) ||
            (atrBoard[0] === atrPlayer && atrBoard[3] === atrPlayer && atrBoard[6] === atrPlayer) ||
            (atrBoard[1] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[7] === atrPlayer) ||
            (atrBoard[2] === atrPlayer && atrBoard[5] === atrPlayer && atrBoard[8] === atrPlayer) ||
            (atrBoard[0] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[8] === atrPlayer) ||
            (atrBoard[2] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[6] === atrPlayer)
            ) {
        return true;
    } else {
        return false;
    }
}*/
//winning combinations using the atrBoard indexies for instace the first win could be 3 xes in a row
function winning(atrBoard, atrPlayer) {
    if (atrBoard[0] === atrPlayer && atrBoard[1] === atrPlayer && atrBoard[2] === atrPlayer) {
        return 1;
    } else if (atrBoard[3] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[5] === atrPlayer) {
        return 2;
    } else if (atrBoard[6] === atrPlayer && atrBoard[7] === atrPlayer && atrBoard[8] === atrPlayer) {
        return 3;
    } else if (atrBoard[0] === atrPlayer && atrBoard[3] === atrPlayer && atrBoard[6] === atrPlayer) {
        return 4;
    } else if (atrBoard[1] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[7] === atrPlayer) {
        return 5;
    } else if (atrBoard[2] === atrPlayer && atrBoard[5] === atrPlayer && atrBoard[8] === atrPlayer) {
        return 6;
    } else if (atrBoard[0] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[8] === atrPlayer) {
        return 7;
    } else if (atrBoard[2] === atrPlayer && atrBoard[4] === atrPlayer && atrBoard[6] === atrPlayer) {
        return 8;
    } else {
        return 0;
    }
}