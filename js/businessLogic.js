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
  mark: function(column, row, player) {
    // if target position is already filled with token, return false
    if(this.gameBoard[column][row] !== "") {
      return false;
    }

    this.gameBoard[column][row] = player.token;
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

  checkWin: function() {
    // checkWin will run every time when the players actually mark the gameBoard.
    this.gameCounter++;

    const currentBoard = board.gameBoard;

    let current = currentBoard[0][0];
    let counter = 0;

    // 1. check rows
    for(let i=0; i<currentBoard.length; i++) {
      let answerTracker = [];

      for(let j=0; j<currentBoard.length; j++) {
        // if current is "" or is not matched with the current cell, 
        // reset the counter and move the current to the next cell.
        if(current === "" || current !== currentBoard[i][j]) {
          // reset the counter and answerTracker for the next column check
          counter = 0;
          answerTracker = [];

          // move to the next column
          current = currentBoard[i][j];
        }
  
        // if current is not "" and is matched with the current cell,
        if(current !== "" && current === currentBoard[i][j]) {
          // add counter
          counter++;
          // push the current combination to the "answerTracker"
          answerTracker.push([i, j]);

          // if the counter is 3 (3 cells are matched in a row), return answerTracker
          if(counter === 3) {
            return answerTracker;
          }
        }
      }
      // reset the counter before check next column
      counter = 0;
    }

    // reset the current
    current = currentBoard[0][0];

    // 2. check columns
    for(let i=0; i<currentBoard.length; i++) {
      let answerTracker = [];


      for(let j=0; j<currentBoard.length; j++) {
        if(current === "" || current !== currentBoard[j][i]) {
          counter = 0;
          answerTracker = [];
          current = currentBoard[j][i];
        }
  
        if(current === currentBoard[j][i]) {
          counter++;
          answerTracker.push([j, i]);

          if(counter === 3) {
            return answerTracker;
          }
        }
      }
      counter=0;
    }

    current = currentBoard[0][0];

    let answerTracker = [];

    // 3. check diagonal top right
    for(let i=0; i<currentBoard.length; i++) {
      if(current === "" || current !== currentBoard[i][i]) {
        counter = 0;
        answerTracker = [];
        current = currentBoard[i][i];
      }
  
      if(current === currentBoard[i][i]) {
        counter++;
        answerTracker.push([i, i]);

        if(counter === 3) {
          return answerTracker;
        }
      }
    }

    current = currentBoard[0][0];
    counter = 0;
    answerTracker = [];

    // 4. check diagonal top left
    for(let i=0; i<currentBoard.length; i++) {
      if(current === "" || current !== currentBoard[i][currentBoard.length-i-1]) {
        counter = 0;
        answerTracker = [];
        current = currentBoard[i][currentBoard.length-i-1];
      }
  
      if(current === currentBoard[i][currentBoard.length-i-1]) {
        counter++;
        answerTracker.push([i, currentBoard.length-i-1]);

        if(counter === 3) {
          return answerTracker;
        }
      }
    }
  },

  checkDraw: function() {
    const totalCells = Math.pow(parseInt(board.gameBoard.length), 2);
    // if the players play games as many time as totalCells - 1, the game is drawn
    if(this.gameCounter >= totalCells -1) {
      return true;
    }
  },

  AIPlay: function() {
    const column = parseInt(Math.random() * board.boardSize);
    const row = parseInt(Math.random() * board.boardSize);

    console.log(column, row)

    return [column, row];
  }

}