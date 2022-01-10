// 1. set the game board
const board = {
  gameBoard: [],

  // create a game board depends on arguments value
  initialise: function(column, row) {
    for(let i=0; i<column; i++) {
      let rowArr = new Array(row).fill("");
    
      this.gameBoard.push(rowArr);
    }
  },

  // update the array for tracking
  updateGameBoard: function(column, row, mark) {
    // if target position is already filled with mark, return false
    if(this.gameBoard[column][row] !== "") {
      return false;
    }

    this.gameBoard[column][row] = mark;
  },

  // represent the board in DOM
  drawDOM: function() {
    // clean the DOM first
    $("#board").html("");

    for(let i=0; i<this.gameBoard.length; i++) {
      for(let j=0; j<this.gameBoard[i].length; j++) {
        $("#board").append(`
          <div class="${i}-${j}">
            <span>${this.gameBoard[i][j]}</span>
          </div>
        `);
      }
    }

    // connect to event handler
    $("#board > div").on("click", function(event) {
      game.clickBoard(event.target.className);
    });
  },
}

board.initialise(3,3);
board.drawDOM();

// 2. set players
const player = {
  players: {
    player1: {
      name: "PLAYER1",
      mark: "o"
    },
    player2: {
      name: "PLAYER2",
      mark: "x"
    }
  },

  changePlayersName: function(player1Name, player2Name) {
    this.players.player1.name = player1Name;
    this.players.player2.name = player2Name;
  },

  changePlayersMark: function(player1Mark, player2Mark) {
    this.players.player1.mark = player1Mark;
    this.players.player2.mark = player2Mark;
  },

  updateDOM: function() {
    $("#player1Info > h2").html(this.players.player1.name);
    $("#player1Info > p").html(this.players.player1.mark);
    $("#player2Info > h2").html(this.players.player2.name);
    $("#player2Info > p").html(this.players.player2.mark);
  }
}
// form submit event
$("#playerForm").on("submit", function(event) {
  event.preventDefault();

  const player1Name = $("#player1Name").val();
  const player2Name = $("#player2Name").val();

  const player1Mark = $("#player1Mark").val();
  const player2Mark = $("#player2Mark").val();

  player.changePlayersName(player1Name, player2Name);
  player.changePlayersMark(player1Mark, player2Mark);
  player.updateDOM();
});



// 3. play game
const game = {
  currentPlayer: player.players.player1,

  swapPlayer: function() {
    if(this.currentPlayer === player.players.player1) {
      this.currentPlayer = player.players.player2;
    }else {
      this.currentPlayer = player.players.player1;
    }
  },

  checkWin: function() {
    const currentBoard = board.gameBoard;

    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard[i].length; j++) {
        // ...
      }
    }

  },

  clickBoard: function(boardID) {
    const columnID = parseInt(boardID[0]);
    const rowID = parseInt(boardID[2]);

    // mark the board.gameBoard 
    const isMarked = board.updateGameBoard(columnID, rowID, this.currentPlayer.mark);


    // if the ? was already marked, return null
    if(isMarked === false) {
      return null;
    }

    // update board DOM
    board.drawDOM();

    // check if game is over
    this.checkWin();

    // swap player
    this.swapPlayer();
  },
}