// 1. set the game board
const board = {
  gameBoard: [],

  // create a game board depends on arguments value
  initialise: function(size) {
    for(let i=0; i<size; i++) {
      let rowArr = new Array(size).fill("");
    
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
    // clean the DOM, layout grid
    $("#board")
      .html("")
      .css({
      "grid-template-columns": `repeat(${this.gameBoard.length}, 1fr)`,
      "grid-template-rows": `repeat(${this.gameBoard.length}, 1fr)`
    });

    // append items in board
    for(let i=0; i<this.gameBoard.length; i++) {
      for(let j=0; j<this.gameBoard.length; j++) {
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

board.initialise(3);
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
$("#gameSettingForm").on("submit", function(event) {
  event.preventDefault();

  const player1Name = $("#player1Name").val();
  const player2Name = $("#player2Name").val();

  const player1Mark = $("#player1Mark").val();
  const player2Mark = $("#player2Mark").val();

  player.changePlayersName(player1Name, player2Name);
  player.changePlayersMark(player1Mark, player2Mark);
  player.updateDOM();

  $("#form-bg").attr("class", "");
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

    let ref = currentBoard[0][0];
    let counter = 0;

    // 1. check rows
    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "") {
          continue;
        }
  
        if(ref === currentBoard[i][j]) {
          counter++;

          if(counter === 3) {
            console.log(`there is winner in column ${i}, row ${j}`);
            console.log(`[${i}, ${j-2}], [${i}, ${j-1}], [${i}, ${j}]`);
          }
        }else {
          counter = 0;
          ref = currentBoard[i][j];
        }
  
        // console.log(currentBoard)
        // console.log(counter);
      }
    }

    ref = currentBoard[0][0];

    // 2. check columns
    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard.length; j++) {
        if(ref === "") {
          continue;
        }
  
        if(ref === currentBoard[j][i]) {
          counter++;

          if(counter === 3) {
            console.log(`there is winner in column ${j}, row ${i}`);
            console.log(`[${i}, ${j-2}], [${i}, ${j-1}], [${i}, ${j}]`);
          }
        }else {
          counter = 0;
          ref = currentBoard[j][i];
        }
  
        console.log(currentBoard)
        console.log(counter);
      }
    }

    ref = currentBoard[0][0];


    // 3. check diagonal (1)
    for(let i=0; i<currentBoard.length; i++) {
      if(ref === "") {
        continue;
      }
  
      if(ref === currentBoard[i][i]) {
        counter++;

        if(counter === 3) {
          console.log(`there is winner in column ${i}, row ${i}`)
        }
      }else {
        counter = 0;
        ref = currentBoard[i][i];
      }
    }

    ref = currentBoard[0][0];


    // 4. check diagonal (2)
    for(let i=0; i<currentBoard.length; i++) {
      if(ref === "") {
        continue;
      }

      console.log(currentBoard.length-i, i)
  
      if(ref === currentBoard[currentBoard.length-i-1][i]) {
        counter++;

        if(counter === 3) {

          console.log(`there is winner in column ${currentBoard.length-i-1}, row ${i}`)
        }
      }else {
        counter = 0;
        ref = currentBoard[currentBoard.length-i-1][i];
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