(function () {
    initSnake("containerGame", 14, 20, 150);
})();



function initSnake(containerId, rowsCount, colsCount, speed) {
    let board = new Board(containerId, rowsCount, colsCount);
    board.render();
    document.getElementById('snakeScore').innerHTML = localStorage.getItem('score');
    board.startButton().addEventListener("click", function () {
        board.hidePreview();
        let snake = new Snake(board, speed, new Cell(2, 2, "right"));
        snake.start();
    });
}
let bestScore;
function Board(containerId, rowsCount, colsCount) {
    this.containerId = containerId;
    this.rowsCount = rowsCount;
    this.colsCount = colsCount;

    this.render = function () {
        let html = "<div class='snake-board'><table>";
        for (let i = 0; i < this.rowsCount; i++) {
            html += "<tr id='row-" + i + "' class='row'>";
            for (let j = 0; j < this.colsCount; j++) {
                html += "<td id='" + cellId(i, j) + "' class='col'></td>";
            }
            html += "</tr>"
        }
        html += "</table><div class='preview'> <div class='gameName' id='gameNameSnake'>ЗМЕЯ</div></div><div class='score'><p>ИГРА ОКОНЧЕНА</p><p>ТВОИ БАЛЛЫ: <span class='score-value'></span></p></div><button type='button'>Start</button></div>";
        document.getElementById(containerId).innerHTML = html;
    };

    this.hidePreview = function () {
        let container = document.getElementById(containerId);
        container.getElementsByClassName("preview")[0].style.display = "none";
        container.getElementsByTagName("button")[0].style.display = "none";
        container.querySelector(".score").style.display = "none";
    };

    this.startButton = function () {
        return document.getElementById(this.containerId).getElementsByTagName("button")[0];
    };

    this.setScoreValue = function (value) {
        document.getElementById(containerId).querySelector(".score-value").innerHTML = value;
        if(!localStorage.getItem('score')){
            localStorage.setItem('score' , 0);
        }else if (Number(localStorage.getItem('score')) < value){
            localStorage.setItem('score' , value);
        }

        document.getElementById('snakeScore').innerHTML = localStorage.getItem('score');
    };

    this.showResults = function () {
        let container = document.getElementById(containerId);
        container.getElementsByClassName("preview")[0].style.display = "block";
        container.getElementsByTagName("button")[0].style.display = "block";
        container.querySelector(".score").style.display = "block";
        let cells = container.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            removeClass(cell, "fruit");
            removeClass(cell, "snake");
        }
    }
}

function Snake(board, speed, head) {
    this.head = head;
    this.tail = head;
    this.cells = [head];
    this.board = board;

    let $snake = this;
    this.start = function () {
        addClass(document.getElementById(cellId(head.row, head.col)), "snake");

        addFruitToBoard(board, this);
        addKeyboardListener(this);


        let intervalId = setInterval(function () {
            let newCells = [];

            let headMovingResult = moveHead();
            if (!headMovingResult) {
                clearInterval(intervalId);
                $snake.board.setScoreValue($snake.cells.length);
                $snake.board.showResults();
                return;
            }
            newCells.push(headMovingResult.newHead);

            if ($snake.cells.length > 1) {
                newCells.push.apply(newCells, moveCellsAfterHead($snake));
            }

            $snake.head = newCells[0];
            $snake.tail = newCells[newCells.length - 1];
            $snake.cells = newCells;
            if (headMovingResult.fruit) {
                $snake.grow();
                addFruitToBoard($snake.board, $snake);
            }
        }, speed);

        function moveHead() {
            let newHead = $snake.head.next();
            let nextHeadElement = document.getElementById(cellId(newHead.row, newHead.col));
            if (!nextHeadElement || nextHeadElement.classList.contains("snake")) {
                return null;
            }

            let fruit = nextHeadElement.classList.contains("fruit");
            if (fruit) {
                removeClass(nextHeadElement, "fruit");
            }

            removeClass(document.getElementById(cellId($snake.head.row, $snake.head.col)), "snake");
            addClass(nextHeadElement, "snake");
            return {newHead: newHead, fruit: fruit};
        }

        function moveCellsAfterHead($snake) {
            let newCells = [];
            for (let i = 1; i < $snake.cells.length; i++) {
                let currentCell = $snake.cells[i];
                removeClass(document.getElementById(cellId(currentCell.row, currentCell.col)), "snake");

                let nextCell = $snake.cells[i - 1];
                addClass(document.getElementById(cellId(nextCell.row, nextCell.col)), "snake");

                newCells.push(nextCell);
            }
            return newCells;
        }
    };

    this.setHeadDirection = function (keywordDirection) {
        this.head.direction = keywordDirection;
        this.cells[0].direction = keywordDirection;
    };

    this.grow = function () {
        let newTail = this.tail.prev();
        this.cells.push(newTail);
        this.tail = newTail;
    };

    this.containsCell = function (row, col) {
        for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];
            if (cell.row === row && cell.col === col) {
                return true;
            }
        }
        return false;
    };
}
let row,col;
function addFruitToBoard(board, snake) {
    do {
         row = Math.floor(Math.random() * board.rowsCount);
         col = Math.floor(Math.random() * board.colsCount);
    } while (snake.containsCell(row, col));
    addClass(document.getElementById(cellId(row, col)), "fruit");
}

function addKeyboardListener(snake) {
    document.addEventListener("keydown", function (event) {
        event.preventDefault();
        let keywordDirection = direction(event.which);
        if (keywordDirection && isAllowedDirection(snake.head.direction, keywordDirection)) {
            snake.setHeadDirection(keywordDirection);
        }
    });
}


function isAllowedDirection(direction, keywordDirection) {
    return direction !== keywordDirection && !(direction === "right" && keywordDirection === "left") && !(direction === "left" && keywordDirection === "right") && !(direction === "up" && keywordDirection === "down") && !(direction === "down" && keywordDirection === "up");
}

function direction(keyCode) {
    this.keyCodeToDirection = {2: "left", 4: "right", 8: "up", 16: "down", 37: "left", 38: "up", 39: "right", 40: "down"};
    return this.keyCodeToDirection[keyCode];
}

function Cell(row, col, direction) {
    this.row = row;
    this.col = col;
    this.direction = direction;

    this.next = function () {
        switch (this.direction) {
            case "up":
                return new Cell(this.row - 1, this.col, this.direction);
            case "down":
                return new Cell(this.row + 1, this.col, this.direction);
            case "left":
                return new Cell(this.row, this.col - 1, this.direction);
            case "right":
                return new Cell(this.row, this.col + 1, this.direction);
        }
    };

    this.prev = function () {
        switch (this.direction) {
            case "up":
                return new Cell(this.row + 1, this.col, this.direction);
            case "down":
                return new Cell(this.row - 1, this.col, this.direction);
            case "left":
                return new Cell(this.row, this.col + 1, this.direction);
            case "right":
                return new Cell(this.row, this.col - 1, this.direction);
        }
    };
}

function addClass(element, className) {
    element.classList.add(className);
}

function removeClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

function cellId(row, col) {
    return "snake-board-" + row + "-" + col;
}

