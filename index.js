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
//finding the ultimate play on the game that favors the computer
var bestSpot;
//Red background
var redBG = 'orangered';
//Green background
var greenBG = 'seagreen';
//No background
var noBG = 'transparent';
//Terminal Situations Array
var terminalSituationsArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
window.addEventListener('load', function () {
    var gameStatus = document.getElementById('gameStatus');
    document.getElementById('startButton').onclick = function (e) {
        e = e || event;
        var target = e.target || e.srcElement;
        var cellToReset;
        for (var i = 0; i <= 8; i++) {
            cellToReset = document.getElementById(i);
            cellToReset.style.backgroundColor = noBG;
        }
        origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (var i = 0; i < origBoard.length; i++) {
            var cell = document.getElementById(i);
            cell.setAttribute('class', 'empty');
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
        gameStatus.style.backgroundColor = noBG;
    };
    document.getElementById('gameField').onclick = function (e) {
        if (isGameRunning) {
            e = e || event;
            gameStatus.style.backgroundColor = noBG;
            var target = e.target || e.srcElement;
            var pressedCell = document.getElementById(target.id);
            if (pressedCell != undefined) {
                if (pressedCell.getAttribute('class') == 'empty') {
                    var imgHuman = document.createElement('img');
                    imgHuman.setAttribute('src', (huPlayer == 'cross' ? 'cross.png' : 'nought.png'));
                    pressedCell.appendChild(imgHuman);
                    pressedCell.setAttribute('class', 'full');
                    origBoard[target.id] = huPlayer;
                    aiMoves();
                    var availSpots = emptyIndices(origBoard);
                    var terminalSituation = checkTerminalSituations(origBoard, aiPlayer);
                    if (checkTerminalSituations(origBoard, huPlayer)) {
                        gameStatus.innerHTML = 'Вы выиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[1]) {
                        highlightCells(terminalSituationsArr[1]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[2]) {
                        highlightCells(terminalSituationsArr[2]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[3]) {
                        highlightCells(terminalSituationsArr[3]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[4]) {
                        highlightCells(terminalSituationsArr[4]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[5]) {
                        highlightCells(terminalSituationsArr[5]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[6]) {
                        highlightCells(terminalSituationsArr[6]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[7]) {
                        highlightCells(terminalSituationsArr[7]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (terminalSituation == terminalSituationsArr[8]) {
                        highlightCells(terminalSituationsArr[8]);
                        gameStatus.innerHTML = 'Вы проиграли!';
                        isGameRunning = false;
                    } else if (availSpots.length == 0) {
                        gameStatus.innerHTML = 'Ничья!';
                        isGameRunning = false;
                    }
                }
            }
        } else {
            if (gameStatus.style.backgroundColor == redBG) {
                gameStatus.style.backgroundColor = noBG;
                setTimeout(alertStatus, 200);
            } else {
                alertStatus();
            }
        }
    }
});
function highlightCells(atrTerminalSituation) {
    var cellToHighlight;
    for (var i = 0; i <= 8; i++) {
        if (atrTerminalSituation == 1) {
            if (i == 0 || i == 1 || i == 2) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 2) {
            if (i == 3 || i == 4 || i == 5) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 3) {
            if (i == 6 || i == 7 || i == 8) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 4) {
            if (i == 0 || i == 3 || i == 6) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 5) {
            if (i == 1 || i == 4 || i == 7) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 6) {
            if (i == 2 || i == 5 || i == 8) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 7) {
            if (i == 0 || i == 4 || i == 8) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
        if (atrTerminalSituation == 8) {
            if (i == 2 || i == 4 || i == 6) {
                cellToHighlight = document.getElementById(i);
                cellToHighlight.style.backgroundColor = redBG;
            }
        }
    }
}
function alertStatus() {
    gameStatus.style.backgroundColor = redBG;
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
    //checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (checkTerminalSituations(atrBoard, huPlayer)) {
        return {score: -10};
    } else if (checkTerminalSituations(atrBoard, aiPlayer)) {
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
//check winning combinations using the atrBoard indexies for instace the first win could be 3 xes in a row
function checkTerminalSituations(atrBoard, atrPlayer) {
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