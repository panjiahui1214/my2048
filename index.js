var my2048;
var rows = 4;
var cols = 4;
var squareWidth = 100;
var spacing = 12;
var fontSize = 50;
var boardArr = [];
var lock = false;
var backgroundColor = "#bbada0";
var directionMap = { left: { key: "left" }, right: { key: "left" }, up: { key: "top" }, down: { key: "top" } };
var colorMap = { 0: "#ccc0b3", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67e5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#9c0", 1024: "#33b5e5", 2048: "#09c", 4096: "#5b67ff" };

window.onload = function () {
    init();
}

function init() {
    initBoard();
    randSquareDiv();
    randSquareDiv();

    // 监听键盘事件
    document.addEventListener("keydown", function (e) {
        if (lock) return;
        setTimeout(function () {
            lock = true;
            if (isOver()) {
                alert("GAME OVER ~");
                return;
            }
            switch (e.key) {
                case "ArrowUp": keyDown("up"); break;
                case "ArrowDown": keyDown("down"); break;
                case "ArrowLeft": keyDown("left"); break;
                case "ArrowRight": keyDown("right"); break;
                default: break;
            }
            lock = false;
        }, 300);
    });
}

// 初始化棋盘
function initBoard() {
    my2048 = document.getElementById("my2048");
    my2048.style.width = squareWidth * cols + spacing * (cols + 1) + "px";
    my2048.style.height = squareWidth * rows + spacing * (rows + 1) + "px";
    my2048.style.fontSize = fontSize + "px";
    my2048.style.lineHeight = squareWidth + "px";
    my2048.style.background = backgroundColor;

    for (var i = 0; i < rows; i++) {
        boardArr[i] = [];
        for (var j = 0; j < cols; j++) {
            var temp = createSquareDiv(i, j, 0);
            my2048.appendChild(temp);
            boardArr[i][j] = { val: 0 };
        }
    }
}

// 生成小方块div
function createSquareDiv(row, col, val) {
    var temp = document.createElement("div");
    temp.style.width = squareWidth + "px";
    temp.style.height = squareWidth + "px";
    temp.style.background = colorMap[val];
    temp.style.top = spacing * (row + 1) + squareWidth * row + "px";
    temp.style.left = spacing * (col + 1) + squareWidth * col + "px";
    if (val > 0) {
        temp.innerHTML = "" + val;
    }
    temp.row = row;
    temp.col = col;
    temp.val = val;
    return temp;
}

// 随机生成小方块div
function randSquareDiv() {
    randVal = Math.random() >= 0.5 ? 2 : 4;
    for (; ;) {
        randRow = Math.floor(Math.random() * rows);
        randCol = Math.floor(Math.random() * cols);
        if (!boardArr[randRow][randCol].val) {
            var temp = createSquareDiv(randRow, randCol, randVal);
            my2048.appendChild(temp);
            boardArr[randRow][randCol] = temp;
            return true;
        }
    }
}

// 根据键盘方向进行操作
function keyDown(direction) {
    analysisActions(direction);
    randSquareDiv();
}

// 处理重叠小方块
function DealOverlap(arr) {
    if (0 == arr.length) {
        return [];
    }
    var tempArr = [];
    tempArr.push(arr[0]);

    for (var i = 1; i < arr.length; i++) {
        var tempDiv;
        var temp = tempArr.length - 1;
        if (arr[i].val == tempArr[temp].val && !tempArr[temp].last) {
            tempDiv = arr[i];
            tempDiv.last = tempArr[temp];
            tempArr[temp] = tempDiv;
        }
        else {
            tempArr.push(arr[i]);
        }
    }
    return tempArr;
}

// 移动小方块
function move(temp, direction, newRow, newCol) {
    boardArr[temp.row][temp.col] = 0;
    temp.style.transition = directionMap[direction].key + " 0.3s";
    temp.style.top = spacing * (newRow + 1) + squareWidth * newRow + "px";
    temp.style.left = spacing * (newCol + 1) + squareWidth * newCol + "px";
    temp.row = newRow;
    temp.col = newCol;
    boardArr[newRow][newCol] = temp;
}

// 分析移动操作
function analysisActions(direction) {
    if (direction == "left") {
        // 循环每行
        for (var i = 0; i < boardArr.length; i++) {
            var tempArr = [];
            // 从左往右循环输出有值的小方块div
            for (var j = 0; j < boardArr[i].length; j++) {
                if (boardArr[i][j].val) {
                    tempArr.push(boardArr[i][j]);
                }
            }
            tempArr = DealOverlap(tempArr);
            for (var k = 0; k < tempArr.length; k++) {
                if (tempArr[k].last && tempArr[k].last.col != k) {
                    move(tempArr[k].last, direction, i, k);
                }
                if (tempArr[k].col != k) {
                    move(tempArr[k], direction, i, k);
                }
            }
        }
    } else if (direction == "right") {
        // 循环每行
        for (var i = 0; i < boardArr.length; i++) {
            var tempArr = [];
            // 从右往左循环输出有值的小方块div
            for (var j = boardArr[i].length - 1; j >= 0; j--) {
                if (boardArr[i][j].val) {
                    tempArr.push(boardArr[i][j]);
                }
            }
            tempArr = DealOverlap(tempArr);
            for (var k = 0; k < tempArr.length; k++) {
                var newCol = boardArr[i].length - 1 - k;
                if (tempArr[k].last && tempArr[k].last.col != newCol) {
                    move(tempArr[k].last, direction, i, newCol);
                }
                if (tempArr[k].col != newCol) {
                    move(tempArr[k], direction, i, newCol);
                }
            }
        }
    } else if (direction == "up") {
        // 循环每列
        for (var j = 0; j < boardArr.length; j++) {
            var tempArr = [];
            // 从上往下循环输出有值的小方块div
            for (var i = 0; i < boardArr[j].length; i++) {
                if (boardArr[i][j].val) {
                    tempArr.push(boardArr[i][j]);
                }
            }
            tempArr = DealOverlap(tempArr);
            for (var k = 0; k < tempArr.length; k++) {
                if (tempArr[k].last && tempArr[k].last.row != k) {
                    move(tempArr[k].last, direction, k, j);
                }
                if (tempArr[k].row != k) {
                    move(tempArr[k], direction, k, j);
                }
            }
        }
    } else if (direction == "down") {
        // 循环每列
        for (var j = 0; j < boardArr.length; j++) {
            var tempArr = [];
            // 从下往上循环输出有值的小方块div
            for (var i = boardArr[j].length - 1; i >= 0; i--) {
                if (boardArr[i][j].val) {
                    tempArr.push(boardArr[i][j]);
                }
            }
            tempArr = DealOverlap(tempArr);
            for (var k = 0; k < tempArr.length; k++) {
                var newRow = boardArr[j].length - 1 - k;
                if (tempArr[k].last && tempArr[k].last.row != newRow) {
                    move(tempArr[k].last, direction, newRow, j);
                }
                if (tempArr[k].row != newRow) {
                    move(tempArr[k], direction, newRow, j);
                }
            }
        }
    }
    refresh();
}

// 刷新棋盘小方块
function refresh() {
    for (var i = 0; i < boardArr.length; i++) {
        for (var j = 0; j < boardArr[i].length; j++) {
            if (boardArr[i][j].last) {
                my2048.removeChild(boardArr[i][j].last);
                boardArr[i][j].last = undefined;
                boardArr[i][j].val *= 2;
                boardArr[i][j].innerHTML = "" + boardArr[i][j].val;
                boardArr[i][j].style.background = colorMap[boardArr[i][j].val];
            }
        }
    }
}

// 判断游戏是否结束
function isOver() {
    for (var i = 0; i < boardArr.length; i++) {
        for (var j = 0; j < boardArr[i].length; j++) {
            if (0 == boardArr[i][j]) {
                return false;
            }
            if (boardArr[i][j + 1] && boardArr[i][j + 1].val == boardArr[i][j].val || boardArr[i+1] && boardArr[i + 1][j] && boardArr[i + 1][j].val == boardArr[i][j].val) {
                return false;
            }
        }
    }
    return true;
}