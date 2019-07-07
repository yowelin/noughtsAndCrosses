'use strict';
var huPlayer;
var aiPlayer;
var origBoard;
var isGameRunning = false;
var bestCell;
var redBG = 'orangered';
var greenBG = 'seagreen';
var noBG = '';
var gameStatus;
var isHuPlayerFirst;
var startButton;
window.addEventListener('load', function () {
    gameStatus = document.getElementById('gameStatus');
    startButton = document.getElementById('startButton');
    document.getElementById('menu').onclick = function (e) {
        if (isGameRunning) {
            e = e || event;
            var target = e.target || e.srcElement;
            if ((target.id === 'crossesLabel' && huPlayer === 'nought') || (target.id === 'noughtsLabel' && huPlayer === 'cross') || (target.id === 'firstMove')) {
                askWhetherInterruptGame(e);
            }
        }
    };
    document.getElementById('startButton').onclick = function (e) {
        if (isGameRunning) {
            e = e || event;
            var target = e.target || e.srcElement;
            var cellToReset;
            if (target.id === 'startButton') {
                askWhetherInterruptGame(e);
            }
        } else {
            startButton.setAttribute('value', 'Окончить игру');
            for (var i = 0; i <= 8; i++) {
                cellToReset = document.getElementById(i);
                cellToReset.style.backgroundColor = noBG;
                cellToReset.setAttribute('class', 'empty');
                cellToReset.innerHTML = null;
            }
            origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            var radioCrosses = document.getElementById('crosses');
            var crossesLabel = document.getElementById('crossesLabel');
            var noughtsLabel = document.getElementById('noughtsLabel');
            if (radioCrosses.checked) {
                huPlayer = 'cross';
                aiPlayer = 'nought';
                crossesLabel.style.backgroundColor = greenBG;
                noughtsLabel.style.backgroundColor = noBG;
            } else {
                huPlayer = 'nought';
                aiPlayer = 'cross';
                noughtsLabel.style.backgroundColor = greenBG;
                crossesLabel.style.backgroundColor = noBG;
            }
            var checkboxFirstMove = document.getElementById('firstMove');
            var firstMoveLabel = document.getElementById('firstMoveLabel');
            if (checkboxFirstMove.checked) {
                firstMoveLabel.style.backgroundColor = greenBG;
                isHuPlayerFirst = true;
            } else {
                firstMoveLabel.style.backgroundColor = noBG;
                isHuPlayerFirst = false;
                bestCell = findBestMoveWithMinimax(origBoard, aiPlayer);
                drawMove(aiPlayer, bestCell.index);
            }
            isGameRunning = true;
            gameStatus.innerHTML = 'Игра началась!';
            gameStatus.style.backgroundColor = noBG;
        }
    };
    document.getElementById('gameField').onclick = function (e) {
        if (isGameRunning) {
            e = e || event;
            var target = e.target || e.srcElement;
            var pressedCell = document.getElementById(target.id);
            if (pressedCell !== undefined) {
                if (pressedCell.getAttribute('class') === 'empty') {
                    drawMove(huPlayer, target.id);
                    bestCell = findBestMoveWithMinimax(origBoard, aiPlayer);
                    drawMove(aiPlayer, bestCell.index);
                    var availCells = getEmptyCellsIndices(origBoard);
                    var terminalSituation = checkTerminalSituations(origBoard, aiPlayer);
                    if ((terminalSituation === 0 && availCells.length === 0) || terminalSituation > 0) {
                        highlightTerminalSituationCells(terminalSituation);
                        isGameRunning = false;
                        highlightElemBg(gameStatus);
                        startButton.setAttribute('value', 'Начать игру');
                    }
                }
            }
        } else {
            if (gameStatus.style.backgroundColor === redBG) {
                gameStatus.style.backgroundColor = noBG;
                setTimeout(highlightElemBg, 200, gameStatus);
            } else {
                highlightElemBg(gameStatus);
            }
        }
    };
});
function askWhetherInterruptGame(e) {
    var isNewGameWished = confirm("Хотите отменить текущую партию?");
    if (isNewGameWished) {
        isGameRunning = false;
        gameStatus.innerHTML = 'Нажмите "Начать игру".';
        startButton.setAttribute('value', 'Начать игру');
    } else {
        e.preventDefault();
    }
}
function highlightTerminalSituationCells(atrTerminalSituation) {
    var cellToHighlight;
    for (var i = 0; i <= 8; i++) {
        if (atrTerminalSituation === 0) {
            gameStatus.innerHTML = 'Ничья!';
        } else {
            gameStatus.innerHTML = 'Вы проиграли!';
        }
        if (atrTerminalSituation === 1) {
            if (i === 0 || i === 1 || i === 2) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 2) {
            if (i === 3 || i === 4 || i === 5) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 3) {
            if (i === 6 || i === 7 || i === 8) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 4) {
            if (i === 0 || i === 3 || i === 6) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 5) {
            if (i === 1 || i === 4 || i === 7) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 6) {
            if (i === 2 || i === 5 || i === 8) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 7) {
            if (i === 0 || i === 4 || i === 8) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        } else if (atrTerminalSituation === 8) {
            if (i === 2 || i === 4 || i === 6) {
                cellToHighlight = document.getElementById(i);
                highlightElemBg(cellToHighlight);
            }
        }
    }
}
function getEmptyCellsIndices(atrBoard) {
    return atrBoard.filter(s => s !== aiPlayer && s !== huPlayer);
}
function highlightElemBg(elem) {
    elem.style.backgroundColor = redBG;
}
function drawMove(atrPlayer, atrCellIndex) {
    if (atrCellIndex !== undefined) {
        var cellElem = document.getElementById(atrCellIndex);
        var imgElem = document.createElement('img');
        imgElem.setAttribute('src', (atrPlayer === aiPlayer ? (aiPlayer + '.png') : (huPlayer + '.png')));
        cellElem.appendChild(imgElem);
        cellElem.setAttribute('class', 'full');
        origBoard[atrCellIndex] = atrPlayer;
    }
}
function findBestMoveWithMinimax(atrBoard, atrPlayer) {
    var availCells = getEmptyCellsIndices(atrBoard);
    if (checkTerminalSituations(atrBoard, huPlayer)) {
        return {score: -10};
    } else if (checkTerminalSituations(atrBoard, aiPlayer)) {
        return {score: 10};
    } else if (availCells.length === 0) {
        return {score: 0};
    }
    var movesArr = [];
    for (var i = 0; i < availCells.length; i++) {
        var moveObj = {};
        moveObj.index = atrBoard[availCells[i]];
        atrBoard[moveObj.index] = atrPlayer;
        if (atrPlayer === aiPlayer) {
            var result = findBestMoveWithMinimax(atrBoard, huPlayer);
            moveObj.score = result.score;
        } else {
            var result = findBestMoveWithMinimax(atrBoard, aiPlayer);
            moveObj.score = result.score;
        }
        atrBoard[moveObj.index] = moveObj.index;
        movesArr.push(moveObj);
    }
    var bestMovesArr = [];
    var j = 0;
    if (atrPlayer === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < movesArr.length; i++) {
            if (movesArr[i].score > bestScore) {
                bestScore = movesArr[i].score;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < movesArr.length; i++) {
            if (movesArr[i].score < bestScore) {
                bestScore = movesArr[i].score;
            }
        }
    }
    for (var i = 0; i < movesArr.length; i++) {
        if (movesArr[i].score === bestScore) {
            bestMovesArr[j] = i;
            j++;
        }
    }
    var rand = Math.floor(Math.random() * bestMovesArr.length);
    return movesArr[bestMovesArr[rand]];
}
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