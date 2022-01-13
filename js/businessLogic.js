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

  getMatchingNumber: function() {
    return this.boardSize > 4 ? 4 : 3;
  }
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

  iterateRowsAndColumns: function(matchingNumber) {
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
          if(counterROW === matchingNumber) {
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

          if(counterCOL === matchingNumber) {
            return answerTrackerCOL;
          }
        }
      }
    }

    return false;
  },

  iterateDiagonals: function(matchingNumber) {
    const currentBoard = board.gameBoard;

    current_rightTop = currentBoard[0][0];
    current_rightBottom = currentBoard[0][0];

    let boardSize = currentBoard.length;
    let diagonalLines = (boardSize + boardSize) - 1
    let longestDiagonalLine = (diagonalLines / 2) + 1
    let itemsInDiagonal = 0;

    for (let i = 1; i <= diagonalLines; i++) {
      // variables to define their current looping cell
      let row_rightTop;
      let row_rightBottom;
      let column_rightTop;
      let column_rightBottom;

      // if counter gets to 3, it'll return answer
      let counter_rightTop = 0;
      let counter_rightBottom = 0;

      // variables to store cells positions they passed
      let answerTracker_rightTop = [];
      let answerTracker_rightBottom = [];

      if (i <= longestDiagonalLine) {
        itemsInDiagonal++;
        for (let j = 0; j < itemsInDiagonal; j++) {
          // 1-a. iterate cells right up from 0 to mid
          row_rightTop = (i - j) - 1;
          column_rightTop = j;

          // if "current" is not marked, OR if "current" is not matched with the cell,
          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            // reset counter and answer tracker
            counter_rightTop = 0;
            answerTracker_rightTop = [];
            // and move "current" to the cell that is looping now
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          // if "current" is matched to the cell
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            // add counter
            counter_rightTop++;
            // push the position value in answer array
            answerTracker_rightTop.push([row_rightTop, column_rightTop]);
    
            // if the counter is 3, it means they found 3 same tokens in a row 
            if(counter_rightTop === matchingNumber) {
              return answerTracker_rightTop;
            }
          }

          // 2-a. iterate cells right dowm from 0 to mid
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
    
            if(counter_rightBottom === matchingNumber) {
              return answerTracker_rightBottom;
            }
          }
        }
      } else {
        itemsInDiagonal--;

        for (let j = 0; j < itemsInDiagonal; j++) {
          // 1-b. iterate cells right top from mid - last
          row_rightTop = boardSize - 1 - j;
          column_rightTop = i + j - boardSize;

          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop = 0;
            answerTracker_rightTop = [];
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop++;
            answerTracker_rightTop.push([row_rightTop, column_rightTop]);
    
            if(counter_rightTop === matchingNumber) {
              return answerTracker_rightTop;
            }
          }

          // 2-b. iterate cells right bottom
          row_rightBottom = boardSize - 1 - j;
          column_rightBottom = 2 * boardSize - i - j - 1;

          if(current_rightBottom === "" || current_rightBottom !== currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom = 0;
            answerTracker_rightBottom = [];
            current_rightBottom = currentBoard[column_rightBottom][row_rightBottom];
          }
      
          if(current_rightBottom === currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom++;
            answerTracker_rightBottom.push([column_rightBottom, row_rightBottom]);
    
            if(counter_rightBottom === matchingNumber) {
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

    const matchingItemNumber = board.getMatchingNumber();

    if(this.iterateRowsAndColumns(matchingItemNumber) !== false) {
      return this.iterateRowsAndColumns(matchingItemNumber);
    }

    if(this.iterateDiagonals(matchingItemNumber) !== false) {
      return this.iterateDiagonals(matchingItemNumber);
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
  isEmptyCell: function(row, column) {
    return board.gameBoard[row][column] === "" ? true : false;
  },

  isValidCell: function(row, column) {
    if(row >= board.boardSize - 1 || column >= board.boardSize - 1) {
      return false;
    }else {
      return true;
    }
  },

  generateRandomPosition: function() {
    const row = parseInt(Math.random() * board.boardSize);
    const column = parseInt(Math.random() * board.boardSize);

    if(!this.isEmptyCell(row, column)) {
      return this.generateRandomPosition();
    }else {
      return [row, column];
    }
  },

  iterateRowsAndColumns: function(matchingNumber) {
    const currentBoard = board.gameBoard;

    let currentROW = currentBoard[0][0];
    let currentCOL = currentBoard[0][0];

    const nextPosition = {
      first: [],
      second: []
    }


    // 1. check rows and columns
    for(let i=0; i<currentBoard.length; i++) {

      let counterCOL = 0;
      let counterROW = 0;

      for(let j=0; j<currentBoard.length; j++) {
        // 1-1. check rows
        // if current is "" or is not matched with the current cell, 
        // reset the counter and move the current to the next cell.
        if(currentROW === "" || currentROW !== currentBoard[i][j]) {
          // reset the counter and answerTracker for the next column check
          counterROW = 0;
          // move to the next column
          currentROW = currentBoard[i][j];
        } 

        if(currentROW === currentBoard[i][j]) {
          // add counter
          counterROW++;


          if(counterROW === matchingNumber - 1) {
            nextPosition.first.push([i, j+1]);
          }
          if(counterROW === matchingNumber - 2) {
            nextPosition.second.push([i, j+1]);
          }
        }
  
        // 1-2. check columns
        if(currentCOL === "" || currentCOL !== currentBoard[j][i]) {
          counterCOL = 0;
          currentCOL = currentBoard[j][i];
        }
        
        if(currentCOL === currentBoard[j][i]){
          counterCOL++;

          if(counterCOL === matchingNumber - 2) {
            nextPosition.first.push([j+1, i]);
          }
          if(counterCOL === matchingNumber - 1) {
            nextPosition.second.push([j+1, i]);
          }
        }
      }
    }

    return nextPosition;
  },

  iterateDiagonals: function(matchingNumber) {
    const currentBoard = board.gameBoard;

    const nextPosition = {
      first: [],
      second: []
    }

    current_rightTop = currentBoard[0][0];
    current_rightBottom = currentBoard[0][0];

    let boardSize = currentBoard.length;
    let diagonalLines = (boardSize + boardSize) - 1
    let longestDiagonalLine = (diagonalLines / 2) + 1
    let itemsInDiagonal = 0;

    for (let i = 1; i <= diagonalLines; i++) {
      // variables to define their current looping cell
      let row_rightTop;
      let row_rightBottom;
      let column_rightTop;
      let column_rightBottom;

      // if counter gets to 3, it'll return answer
      let counter_rightTop = 0;
      let counter_rightBottom = 0;

      if (i <= longestDiagonalLine) {
        itemsInDiagonal++;
        for (let j = 0; j < itemsInDiagonal; j++) {
          // 1-a. iterate cells right up from 0 to mid
          row_rightTop = (i - j) - 1;
          column_rightTop = j;

          // if "current" is not marked, OR if "current" is not matched with the cell,
          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            // reset counter and answer tracker
            counter_rightTop = 0;
            // and move "current" to the cell that is looping now
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          // if "current" is matched to the cell
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            // add counter
            counter_rightTop++;
    
            if(counter_rightTop === matchingNumber - 1) {
              nextPosition.first.push([row_rightTop + 1, column_rightTop + 1])
            }
            if(counter_rightTop === matchingNumber - 2) {
              nextPosition.second.push([row_rightTop + 1, column_rightTop + 1])
            }
          }

          // 2-a. iterate cells right dowm from 0 to mid
          row_rightBottom = boardSize - (i - j);
          column_rightBottom = j;

          if(current_rightBottom === "" || current_rightBottom !== currentBoard[row_rightBottom][column_rightBottom]) {
            counter_rightBottom = 0;
            current_rightBottom = currentBoard[row_rightBottom][column_rightBottom];
          }

          if(current_rightBottom === currentBoard[row_rightBottom][column_rightBottom]) {
            counter_rightBottom++;
    
            if(counter_rightBottom === matchingNumber - 1) {
              nextPosition.first.push([row_rightBottom + 1, column_rightBottom + 1])
            }
            if(counter_rightBottom === matchingNumber - 2) {
              nextPosition.second.push([row_rightBottom + 1, column_rightBottom + 1])
            }
          }
        }
      } else {
        itemsInDiagonal--;

        for (let j = 0; j < itemsInDiagonal; j++) {
          // 1-b. iterate cells right top from mid - last
          row_rightTop = boardSize - 1 - j;
          column_rightTop = i + j - boardSize;

          if(current_rightTop === "" || current_rightTop !== currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop = 0;
            current_rightTop = currentBoard[row_rightTop][column_rightTop];
          }
      
          if(current_rightTop === currentBoard[row_rightTop][column_rightTop]) {
            counter_rightTop++;
    
            if(counter_rightTop === matchingNumber - 1) {
              nextPosition.first.push([row_rightTop + 1, column_rightTop + 1])
            }
            if(counter_rightTop === matchingNumber - 2) {
              nextPosition.second.push([row_rightTop + 1, column_rightTop + 1])
            }
          }

          // 2-b. iterate cells right bottom
          row_rightBottom = boardSize - 1 - j;
          column_rightBottom = 2 * boardSize - i - j - 1;

          if(current_rightBottom === "" || current_rightBottom !== currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom = 0;
            answerTracker_rightBottom = [];
            current_rightBottom = currentBoard[column_rightBottom][row_rightBottom];
          }
      
          if(current_rightBottom === currentBoard[column_rightBottom][row_rightBottom]) {
            counter_rightBottom++;
            answerTracker_rightBottom.push([column_rightBottom, row_rightBottom]);
    
            if(counter_rightBottom === matchingNumber - 1) {
              nextPosition.first.push([column_rightBottom + 1, row_rightBottom + 1])
            }
            if(counter_rightBottom === matchingNumber - 2) {
              nextPosition.second.push([column_rightBottom + 1, row_rightBottom + 1])
            }
          }
        }
      }
    }

    return nextPosition;
  },

  chooseCell: function() {
    if(game.gameCounter === 0) {
      return this.generateRandomPosition();
    }

    const matchingItemNumber = board.getMatchingNumber();

    const nextPositionRC = this.iterateRowsAndColumns(matchingItemNumber);
    const nextPositionDG = this.iterateDiagonals(matchingItemNumber);

    // 1. check if the position is not marked
    for(let position of nextPositionRC.first){
      // if its not marked, return it
      if(this.isValidCell(position[0], position[1]) && this.isEmptyCell(position[0], position[1])) {
        return position;
      }
    }

    // 2. diagonal checking
    for(let position of nextPositionDG.first){
      // if its not marked, return it
      if(this.isValidCell(position[0], position[1]) && this.isEmptyCell(position[0], position[1])) {
        return position;
      }
    }

    // 3. if there was nothing in , 
    for(let position of nextPositionRC.second){
      // if its not marked, return it
      if(this.isValidCell(position[0], position[1]) && this.isEmptyCell(position[0], position[1])) {
        return position;
      }
    }

    for(let position of nextPositionDG.second){
      // if its not marked, return it
      if(this.isValidCell(position[0], position[1]) && this.isEmptyCell(position[0], position[1])) {
        return position;
      }
    }

    return this.generateRandomPosition();
  }
}