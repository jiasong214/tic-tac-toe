// 1. set the game board
const board = {
  gameBoard: [],
  // default board size 3
  boardSize: 3,
  // number of tokens in a row to win
  numberToWin: 3,

  setNumberToWin: function() {
    // set the number of tokens needed in a row to win depending on boardSize
    this.numberToWin = this.boardSize > 4 ? 4 : 3;
  },

  // create the game board and initialise each cell with an empty string
  initialise: function(size) {
    // reset the gameBoard array
    this.gameBoard = [];
    // set the board size. if argument not given, it'll use "boardSize" property
    this.boardSize = size || this.boardSize;
    // set the number of tokens needed in a row to win depending on boardSize
    this.setNumberToWin();

    // generate 2D array filling it with empty strings
    for(let i=0; i<this.boardSize; i++) {
      let rowArr = new Array(this.boardSize).fill("");
    
      this.gameBoard.push(rowArr);
    }
  },

  // mark the token on the "gameBoard" array 
  mark: function(row, column, player) {
    // if target position is already filled, return false
    if(this.gameBoard[row][column] !== "") {
      return false;
    }

    this.gameBoard[row][column] = player.token;
  },
}


// 2. set players
const player = {
  // default players info
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

  // update "players" object with the user input
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
  // to check if a user is playing with the AI
  singlePlayer: true,
  // to keep count of the number of games played (to determine draw)
  gameCounter: 0,

  swapPlayer: function() {
    if(this.currentPlayer.name === player.players.player1.name) {
      this.currentPlayer = player.players.player2;
    }else {
      this.currentPlayer = player.players.player1;
    }
  },

  iterateRows: function() {
    const currentBoard = board.gameBoard;

    // reference cell to start
    let ref = currentBoard[0][0];

    // iterate through each row
    for(let i=0; i<currentBoard.length; i++) {

      // to track the cells that matched in a row
      let answerTracker = [];

      // to count how many cells matched
      let counter = 0;

      // iterate through each column
      for(let j=0; j<currentBoard.length; j++) {

        // if ref is "" or is not matched with the current cell, 
        // reset the counter and move the ref to the next cell.
        if(ref === "" || ref !== currentBoard[i][j]) {
          // reset the counter and answerTracker for the next column check
          counter = 0;
          answerTracker = [];

          // move the ref to the next column
          ref = currentBoard[i][j];
        } 

        if(ref === currentBoard[i][j]) {
          counter++;
          // push the current position to the "answerTracker"
          answerTracker.push([i, j]);

          // if the counter gets to "board.numberToWin" (eg. 3 cells are matched in a row), return answerTracker
          if(counter === board.numberToWin) {
            return answerTracker;
          }
        }
      }
    }
    // if 
    return false;
  },

  iterateColumns: function() {
    const currentBoard = board.gameBoard;

    let ref = currentBoard[0][0];

    for(let i=0; i<currentBoard.length; i++) {
      let answerTracker = [];
      let counter = 0;

      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "" || ref !== currentBoard[j][i]) {
          counter = 0;
          answerTracker = [];
          ref = currentBoard[j][i];
        }
        
        if(ref === currentBoard[j][i]){
          counter++;
          answerTracker.push([j, i]);

          if(counter === board.numberToWin) {
            return answerTracker;
          }
        }
      }
    }
    return false;
  },

  // it iterates diagonally from bottom left to top right
  iterateDiagonals1: function() {
    const currentBoard = board.gameBoard;

    const boardSize = currentBoard.length;
    const diagonalLines = (boardSize * 2) - 1;
    const midLine = (diagonalLines / 2) + 1;
    let cellsInDiagonal = 0;

    let ref = currentBoard[0][0];

    for (let i = 1; i <= diagonalLines; i++) {
      let row;
      let column;

      let counter = 0;
      let answerTracker = [];

      if (i <= midLine) {
        // cells in diagonal go up by 1 up to midLine
        cellsInDiagonal++;

        // iterate each cell diagonally
        for (let j = 0; j < cellsInDiagonal; j++) {

          row = i - j - 1;
          column = j;

          // if ref is "", OR if ref is not matched with the cell currently being checked
          if(ref === "" || ref !== currentBoard[row][column]) {
            // reset counter and answer tracker
            counter = 0;
            answerTracker = [];
            // and move ref to the cell currently being checked
            ref = currentBoard[row][column];
          }
      
          // if ref is matched to the cell
          if(ref === currentBoard[row][column]) {
            counter++;
            // push the position value in answer array
            answerTracker.push([row, column]);
    
            // if the counter is 3, it means they found 3 same tokens in a row 
            if(counter === board.numberToWin) {
              return answerTracker;
            }
          }
        }
      } else {
        // if it's grater than the midLine, then number of cells in diagonal decrease by 1 every time
        cellsInDiagonal--;

        for (let j = 0; j < cellsInDiagonal; j++) {

          row = boardSize - 1 - j;
          column = i + j - boardSize;

          if(ref === "" || ref !== currentBoard[row][column]) {
            counter = 0;
            answerTracker = [];
            ref = currentBoard[row][column];
          }
      
          if(ref === currentBoard[row][column]) {
            counter++;
            answerTracker.push([row, column]);
    
            if(counter === board.numberToWin) {
              return answerTracker;
            }
          }
        }
      }
    }
    return false;
  },

  // it iterates diagonally from top left to bottom right
  iterateDiagonals2: function() {
    const currentBoard = board.gameBoard;
    const boardSize = currentBoard.length;
    const diagonalLines = (boardSize + boardSize) - 1
    const midLine = (diagonalLines / 2) + 1
    let cellsInDiagonal = 0;

    let ref = currentBoard[0][0];

    for (let i = 1; i <= diagonalLines; i++) {
      let row;
      let column;
      let counter = 0;
      let answerTracker = [];

      if (i <= midLine) {
        cellsInDiagonal++;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = boardSize - (i - j);
          column = j;

          if(ref === "" || ref !== currentBoard[row][column]) {
            counter = 0;
            answerTracker = [];
            ref = currentBoard[row][column];
          }

          if(ref === currentBoard[row][column]) {
            counter++;
            answerTracker.push([row, column]);
    
            if(counter === board.numberToWin) {
              return answerTracker;
            }
          }
        }
      } else {
        cellsInDiagonal--;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = boardSize - 1 - j;
          column = 2 * boardSize - i - j - 1;

          if(ref === "" || ref !== currentBoard[column][row]) {
            counter = 0;
            answerTracker = [];
            ref = currentBoard[column][row];
          }
      
          if(ref === currentBoard[column][row]) {
            counter++;
            answerTracker.push([column, row]);
    
            if(counter === board.numberToWin) {
              return answerTracker;
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

    // check win conditions by iterating through the board,
    // if it has a winner, it will return the array with the winning positions to update UI
    const rowCheck = this.iterateRows();
    if(rowCheck !== false) {
      return rowCheck;
    }

    const columnCheck = this.iterateColumns();
    if(columnCheck !== false) {
      return columnCheck;
    }

    const diagonalCheck1 = this.iterateDiagonals1();
    if(diagonalCheck1 !== false) {
      return diagonalCheck1;
    }

    const diagonalCheck2 = this.iterateDiagonals2();
    if(diagonalCheck2 !== false) {
      return diagonalCheck2;
    }
  },

  checkDraw: function() {
    const totalCells = Math.pow(parseInt(board.gameBoard.length), 2);
    // if the players play games as many time as totalCells without winning move, the game is drawn
    if(this.gameCounter >= totalCells ) {
      return true;
    }
  },
}


// 4. AI
const AI = {
  isEmptyCell: function(row, column) {
    return board.gameBoard[row][column] === "" ? true : false;
  },

  isValidCell: function(row, column) {
    if(row >= board.boardSize || row < 0 || column >= board.boardSize || column < 0) {
      return false;
    }else {
      return true;
    }
  },

  generateRandomPosition: function() {
    // this will generate random number between 0 and boardSize
    const row = Math.floor(Math.random() * board.boardSize);
    const column = Math.floor(Math.random() * board.boardSize);

    // if the position is already taken, 
    // run this function again to find different value
    if(!this.isEmptyCell(row, column)) {
      return this.generateRandomPosition();
    }else {
      // if it's valid, return the position
      return [row, column];
    }
  },

  iterateRows: function() {
    const nextPositions = [];

    const currentBoard = board.gameBoard;

    let ref = currentBoard[0][0];

    for(let i=0; i<currentBoard.length; i++) {
      let counter = 0;

      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "" || ref !== currentBoard[i][j]) {
          counter = 0;
          ref = currentBoard[i][j];
        } 

        if(ref === currentBoard[i][j]) {
          counter++;

          if(counter === board.numberToWin-1) {
            // push the cell's position that can lead to a win
            nextPositions.push([i, j+1]);
          }
        }
      }
    }
    // return array of positions
    return nextPositions;
  },

  iterateColumns: function() {
    const nextPositions = [];

    const currentBoard = board.gameBoard;

    let ref = currentBoard[0][0];

    for(let i=0; i<currentBoard.length; i++) {
      let counter = 0;

      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "" || ref !== currentBoard[j][i]) {
          counter = 0;
          ref = currentBoard[j][i];
        }
        
        if(ref === currentBoard[j][i]){
          counter++;

          if(counter === board.numberToWin - 1) {
            nextPositions.push([j+1, i])
          }
        }
      }
    }
    return nextPositions;
  },

  iterateDiagonals1: function() {
    const nextPositions = [];

    const currentBoard = board.gameBoard;

    const boardSize = currentBoard.length;
    const diagonalLines = (boardSize * 2) - 1
    const midLine = (diagonalLines / 2) + 1
    let cellsInDiagonal = 0;

    let ref = currentBoard[0][0];

    for (let i = 1; i <= diagonalLines; i++) {
      let row;
      let column;
      let counter = 0;

      if (i <= midLine) {
        cellsInDiagonal++;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = (i - j) - 1;
          column = j;

          if(ref === "" || ref !== currentBoard[row][column]) {
            counter = 0;
            ref = currentBoard[row][column];
          }
      
          if(ref === currentBoard[row][column]) {
            counter++;
    
            if(counter === board.numberToWin - 1) {
              nextPositions.push([row+1, column+1]);
            }
          }
        }
      } else {
        cellsInDiagonal--;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = boardSize - 1 - j;
          column = i + j - boardSize;

          if(ref === "" || ref !== currentBoard[row][column]) {
            counter = 0;
            ref = currentBoard[row][column];
          }
      
          if(ref === currentBoard[row][column]) {
            counter++;
    
            if(counter === board.numberToWin - 1) {
              nextPositions.push([row+1, column+1]);
            }
          }
        }
      }
    }
    return nextPositions;
  },

  iterateDiagonals2: function() {
    const nextPositions = [];

    const currentBoard = board.gameBoard;
    const boardSize = currentBoard.length;
    const diagonalLines = (boardSize + boardSize) - 1
    const midLine = (diagonalLines / 2) + 1
    let cellsInDiagonal = 0;

    let ref = currentBoard[0][0];

    for (let i = 1; i <= diagonalLines; i++) {
      let row;
      let column;
      let counter = 0;

      if (i <= midLine) {
        cellsInDiagonal++;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = boardSize - (i - j);
          column = j;

          if(ref === "" || ref !== currentBoard[row][column]) {
            counter = 0;
            ref = currentBoard[row][column];
          }

          if(ref === currentBoard[row][column]) {
            counter++;
    
            if(counter === board.numberToWin - 1) {
              nextPositions.push([row+1, column+1])
            }
          }
        }
      } else {
        cellsInDiagonal--;

        for (let j = 0; j < cellsInDiagonal; j++) {
          row = boardSize - 1 - j;
          column = 2 * boardSize - i - j - 1;

          if(ref === "" || ref !== currentBoard[column][row]) {
            counter = 0;
            ref = currentBoard[column][row];
          }
      
          if(ref === currentBoard[column][row]) {
            counter++;
    
            if(counter === board.numberToWin - 1) {
              nextPositions.push([row+1, column+1])
            }
          }
        }
      }
    }
    return nextPositions;
  },

  getPositionToWin: function(positionsArr) {
    if(positionsArr.length !== 0) {
      for(let position of positionsArr) {
        // if the position in the array is valid, return it
        if(this.isValidCell(position[0], position[1]) && this.isEmptyCell(position[0], position[1])) {
          return position;
        }
      }
    }
    return false;
  },

  // this will return a random position that is close to any token
  getClosePosition: function() {
    const currentBoard = board.gameBoard;
    const closePositionsArr = [];

    for(let i=currentBoard.length-1; i>=0; i--) {
      for(let j=currentBoard.length-1; j>=0; j--) {
        const randomIndex = Math.floor(Math.random() * 8);

        // find any cell marked
        if(currentBoard[i][j] !== "") {
          const closeCells = [
            [i, j-1], [i, j+1], [i-1, j], [i+1, j], [i-1, j-1], [i+1, j+1], [i-1, j+1], [i+1, j-1]
          ]
          // and push random close cell
          closePositionsArr.push(closeCells[randomIndex]);
        }
      }
    }

    // within closePositionsArr, find valid position, and return it
    for(let position of closePositionsArr) {
      const row = position[0];
      const column = position[1];
      if(this.isValidCell(row, column) && this.isEmptyCell(row, column)) {
        return position;
      }
    }

    return false;
  },

  chooseCell: function() {
    // if the board is empty, put the token in random position
    if(game.gameCounter === 0) {
      return this.generateRandomPosition();
    }

    // to check if any items in the array are valid
    let check1 = false;
    let check2 = false;
    let check3 = false;
    let check4 = false;

    // get the array of positions that could result in a win for both players
    const rowArr = this.iterateRows();
    // and iterate the array to find valid position among them
    check1 = this.getPositionToWin(rowArr);
    // if there is a valid position, return the position
    if (check1){
      return check1;
    }

    const columnArr = this.iterateColumns();
    check2 = this.getPositionToWin(columnArr);
    if (check2){
      return check2;
    }

    const diagonalArr1 = this.iterateDiagonals1();
    check3 = this.getPositionToWin(diagonalArr1);
    if (check3){
      return check3;
    }

    const diagonalArr2 = this.iterateDiagonals2();
    check4 = this.getPositionToWin(diagonalArr2);
    if (check4){
      return check4;
    }

    // console.log({rowArr, columnArr, diagonalArr1, diagonalArr2})


    // if there wasn't a winning move, choose any cell close to other token
    const anyClosePosition = this.getClosePosition();
    if(anyClosePosition) {
      return anyClosePosition;
    }

    // return a random position if everything else fails
    return this.generateRandomPosition();
  }
}