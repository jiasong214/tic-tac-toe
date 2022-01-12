// 1. set the game board
const board = {
  gameBoard: [],
  boardSize: 3,

  // create a game board and fill it with an empty string
  initialise: function(size) {
    // initialise gameBoard array
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

    let ref = currentBoard[0][0];
    let counter = 0;

    // 1. check rows
    for(let i=0; i<currentBoard.length; i++) {
      let answerTracker = [];

      for(let j=0; j<currentBoard.length; j++) {
        // if ref is "" or is not matched with the current piece, 
        // initialise the counter and move the ref to the next piece.
        if(ref === "" || ref !== currentBoard[i][j]) {
          // initialise the counter and answerTracker for the next column check
          counter = 0;
          answerTracker = [];

          // move to the next column
          ref = currentBoard[i][j];
        }
  
        // if ref is not "" and is matched with the current piece,
        if(ref !== "" && ref === currentBoard[i][j]) {
          // add counter
          counter++;
          // push the current combination to the "answerTracker"
          answerTracker.push([i, j]);

          // if the counter is 3 (3 pieces are matched in a row), return answerTracker
          if(counter === 3) {
            return answerTracker;
          }
        }
      }
      // initialise counter before check next column
      counter = 0;
    }

    // initialise ref
    ref = currentBoard[0][0];

    // 2. check columns
    for(let i=0; i<currentBoard.length; i++) {
      let answerTracker = [];


      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "" || ref !== currentBoard[j][i]) {
          counter = 0;
          answerTracker = [];
          ref = currentBoard[j][i];
        }
  
        if(ref === currentBoard[j][i]) {
          counter++;
          answerTracker.push([j, i]);

          if(counter === 3) {
            return answerTracker;
          }
        }
      }
      counter=0;
    }

    ref = currentBoard[0][0];

    let answerTracker = [];

    // 3. check diagonal top right
    for(let i=0; i<currentBoard.length; i++) {
      if(ref === "" || ref !== currentBoard[i][i]) {
        counter = 0;
        answerTracker = [];
        ref = currentBoard[i][i];
      }
  
      if(ref === currentBoard[i][i]) {
        counter++;
        answerTracker.push([i, i]);

        if(counter === 3) {
          return answerTracker;
        }
      }
    }

    ref = currentBoard[0][0];
    counter = 0;
    answerTracker = [];

    // 4. check diagonal top left
    for(let i=0; i<currentBoard.length; i++) {
      if(ref === "" || ref !== currentBoard[i][currentBoard.length-i-1]) {
        counter = 0;
        answerTracker = [];
        ref = currentBoard[i][currentBoard.length-i-1];
      }
  
      if(ref === currentBoard[i][currentBoard.length-i-1]) {
        counter++;
        answerTracker.push([i, currentBoard.length-i-1]);

        if(counter === 3) {
          return answerTracker;
        }
      }
    }
  },

  checkDraw: function() {
    const totalPieces = Math.pow(parseInt(board.gameBoard.length), 2);
    // if the players play games as many time as totalPieces - 1, the game is drawn
    if(this.gameCounter >= totalPieces -1) {
      return true;
    }
  },
}