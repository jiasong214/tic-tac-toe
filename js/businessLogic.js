// 1. set the game board
const board = {
  gameBoard: [],
  boardSize: 3,

  // create a game board and fill it with an empty string
  initialise: function(size) {
    // reset the gameBoard array
    this.gameBoard = [];
    // set the board size. if argument is not exist, it'll use former of "boardSize"
    this.boardSize = size || this.boardSize;

    for(let i=0; i<this.boardSize; i++) {
      let rowArr = new Array(this.boardSize).fill("");
    
      this.gameBoard.push(rowArr);
    }
  },

  // mark the token on the "gameBoard" array 
  mark: function(row, column, player) {
    // if target position is already filled with token, return false
    if(this.gameBoard[row][column] !== "") {
      return false;
    }

    this.gameBoard[row][column] = player.token;
  },
}


// 2. set players
const player = {
  players: {
    player1: {
      id: 1,
      name: "PLAYER1",
      token: "o"
    },
    player2: {
      id: 2,
      name: "PLAYER2",
      token: "x"
    }
  },

  // update "players" object with user input
  changePlayersName: function(player1Name, player2Name) {
    this.players.player1.name = player1Name;
    this.players.player2.name = player2Name;
  },

  changePlayersToken: function(player1Token, player2Token) {
    this.players.player1.token = player1Token;
    this.players.player2.token = player2Token;
  },
}


// 3. play game
const game = {
  // set a default current player
  currentPlayer: player.players.player1,
  singlePlayer: true,
  gameCounter: 0,

  swapPlayer: function() {    
    if(this.currentPlayer.name === player.players.player1.name) {
      this.currentPlayer = player.players.player2;
    }else {
      this.currentPlayer = player.players.player1;
    }
  },

  iterateRowsAndColumns: function() {
    const currentBoard = board.gameBoard;

    let currentROW = currentBoard[0][0];
    let currentCOL = currentBoard[0][0];


    // 1. check rows and columns
    for(let i=0; i<currentBoard.length; i++) {

      let answerTrackerROW = [];
      let answerTrackerCOL = [];

      let counterCOL = 0;
      let counterROW = 0;

      for(let j=0; j<currentBoard.length; j++) {
        // 1-1. check rows
        // if current is "" or is not matched with the current cell, 
        // reset the counter and move the current to the next cell.
        if(currentROW === "" || currentROW !== currentBoard[i][j]) {
          // reset the counter and answerTracker for the next column check
          counterROW = 0;
          answerTrackerROW = [];

          // move to the next column
          currentROW = currentBoard[i][j];
        } 

        if(currentROW === currentBoard[i][j]) {
          // add counter
          counterROW++;
          // push the current combination to the "answerTracker"
          answerTrackerROW.push([i, j]);

          // if the counter is 3 (3 cells are matched in a row), return answerTracker
          if(counterROW === 3) {
            return answerTrackerROW;
          }
        }
  
        // 1-2. check columns
        if(currentCOL === "" || currentCOL !== currentBoard[j][i]) {
          counterCOL = 0;
          answerTrackerCOL = [];
          currentCOL = currentBoard[j][i];
        }
        
        if(currentCOL === currentBoard[j][i]){
          counterCOL++;
          answerTrackerCOL.push([j, i]);

          if(counterCOL === 3) {
            return answerTrackerCOL;
          }
        }
      }
    }

    return false;
  },

  iterateDiagonals: function() {
    const currentBoard = board.gameBoard;

    current_rightTop = currentBoard[0][0];
    current_rightBottom = currentBoard[0][0];

    let boardSize = currentBoard.length;
    let diagonalLines = (boardSize + boardSize) - 1
    let longestDiagonalLine = (diagonalLines / 2) + 1
    let itemsInDiagonal = 0;

    for (let i = 1; i <= diagonalLines; i++) {
      let row_rightTop;
      let column_rightTop;


      let counter_rightTop = 0;
      let counter_rightBottom = 0;

      let answerTracker_rightTop = [];
      let answerTracker_rightBottom = [];

      if (i <= longestDiagonalLine) {
        itemsInDiagonal++;
        for (let j = 0; j < itemsInDiagonal; j++) {
          // iterate cells right up from 0 to mid
          row_rightTop = (i - j) - 1;
          column_rightTop = j;

          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop = 0;
            answerTracker_rightTop = [];
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop++;
            answerTracker_rightTop.push([row_rightTop, column_rightTop]);
    
            if(counter_rightTop === 3) {
              return answerTracker_rightTop;
            }
          }

          // iterate cells right dowm from 0 to mid
          row_rightBottom = boardSize - (i - j);
          column_rightBottom = j;

          if(current_rightBottom === "" || current_rightBottom !== currentBoard[row_rightBottom][column_rightBottom]) {
            counter_rightBottom = 0;
            answerTracker_rightBottom = [];
            current_rightBottom = currentBoard[row_rightBottom][column_rightBottom];
          }

          if(current_rightBottom === currentBoard[row_rightBottom][column_rightBottom]) {
            counter_rightBottom++;
            answerTracker_rightBottom.push([row_rightBottom, column_rightBottom]);
    
            if(counter_rightBottom === 3) {
              return answerTracker_rightBottom;
            }
          }
        }
      } else {
        itemsInDiagonal--;

        for (let j = 0; j < itemsInDiagonal; j++) {
          row_rightTop = (boardSize - 1) - j;
          column_rightTop = (i - boardSize) + j;

          // iterate cells right top from mid - last
          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop = 0;
            answerTracker_rightTop = [];
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop++;
            answerTracker_rightTop.push([row_rightTop, column_rightTop]);
    
            if(counter_rightTop === 3) {
              return answerTracker_rightTop;
            }
          }

          // iterate cells right bottom
          row_rightBottom = boardSize - j -1;
          column_rightBottom = 2 * boardSize - i - j -1;

          if(current_rightBottom === "" || current_rightBottom !== currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom = 0;
            answerTracker_rightBottom = [];
            current_rightBottom = currentBoard[column_rightBottom][row_rightBottom];
          }
      
          if(current_rightBottom === currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom++;
            answerTracker_rightBottom.push([column_rightBottom, row_rightBottom]);
    
            if(counter_rightBottom === 3) {
              return answerTracker_rightBottom;
            }
          }
        }
      }
    }

    return false;
  },

  checkWin: function() {
    // checkWin will run every time when the players actually mark the gameBoard.
    this.gameCounter++;

    // if(this.iterateRowsAndColumns() !== false) {
    //   return this.iterateRowsAndColumns();
    // }

    if(this.iterateDiagonals() !== false) {
      return this.iterateDiagonals();
    }
  },

  checkDraw: function() {
    const totalCells = Math.pow(parseInt(board.gameBoard.length), 2);
    // if the players play games as many time as totalCells - 1, the game is drawn
    if(this.gameCounter >= totalCells -1) {
      return true;
    }
  },
}

const AI = {
  generateRandomPosition: function() {
    const row = parseInt(Math.random() * board.boardSize);
    const column = parseInt(Math.random() * board.boardSize);

    return {row, column};
  },

  isEmptyCell: function(row, column) {
    return board.gameBoard[row][column] === "" ? true : false;
  },

  findLastCellToWin: function() {
    const currentBoard = board.gameBoard;
    const AItoken = player.players.player2.token;

    let current = currentBoard[0][0];
    let counter = 0;

    // 1. check rows
    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard.length; j++) {
        if(current === AItoken || current !== currentBoard[i][j]) {
          counter = 0;
          current = currentBoard[i][j];
        }
  
        // if current is not "" and is matched with the current cell,
        if(current !== "" && current === currentBoard[i][j]) {
          // add counter
          counter++;

          if(counter === 2) {
            return {row: i, column: j+1}
          }
        }
      }
      counter = 0;
    }

    current = currentBoard[0][0];

    // 2. check columns
    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard.length; j++) {
        if(current === AItoken || current !== currentBoard[j][i]) {
          counter = 0;
          current = currentBoard[j][i];
        }
  
        if(current === currentBoard[j][i]) {
          counter++;

          if(counter === 2) {
            return {row: j, column: i+1}
          }
        }
      }
      counter=0;
    }

    current = currentBoard[0][0];

    // 3. check diagonal top right
    for(let i=0; i<currentBoard.length; i++) {
      if(current === AItoken || current !== currentBoard[i][i]) {
        counter = 0;
        current = currentBoard[i][i];
      }
  
      if(current === currentBoard[i][i]) {
        counter++;

        if(counter === 2) {
          return {row: i+1, column: i+1};
        }
      }
    }

    current = currentBoard[0][0];
    counter = 0;

    // 4. check diagonal top left
    for(let i=0; i<currentBoard.length; i++) {
      if(current === AItoken || current !== currentBoard[i][currentBoard.length-i-1]) {
        counter = 0;
        current = currentBoard[i][currentBoard.length-i-1];
      }
  
      if(current === currentBoard[i][currentBoard.length-i-1]) {
        counter++;

        if(counter === 2) {
          return {row: i+1, column: currentBoard.length-i};
        }
      }
    }

    // 5. if there is no cell to win, return false;
    return false;
  },

  chooseCell: function() {
    const position = this.findLastCellToWin();

    console.log(position)
    // let randomPosition = this.generateRandomPosition();

    // let row = randomPosition.row;
    // let column = randomPosition.column;

    // // check if randomPosition is not taken
    // if(!this.isEmptyCell(row, column)) {
    //   console.log(`AI choose taken mark ${row}, ${column}`)

    //   return this.chooseCell();
    // }

    

    // return [row, column];
  }
}


// to test AI
const gameData = JSON.parse(localStorage.getItem('tic-tac-toe'));
board.gameBoard = gameData.board.gameBoard;
board.boardSize = gameData.board.size;

console.log(AI.chooseCell());