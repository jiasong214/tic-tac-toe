// 1. set the game board
const board = {
  gameBoard: [],

  boardSize: 3,

  // create a game board depends on arguments value
  initialise: function(size) {
    this.gameBoard = [];
    this.boardSize = size || this.boardSize;

    for(let i=0; i<this.boardSize; i++) {
      let rowArr = new Array(this.boardSize).fill("");
    
      this.gameBoard.push(rowArr);
    }
  },

  // mark the array 
  mark: function(column, row, player) {
    // if target position is already filled with mark, return false
    if(this.gameBoard[column][row] !== "") {
      return false;
    }

    this.gameBoard[column][row] = player.mark;
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

  markResult: function(resultArr) {
    for(let item of resultArr) {
      $(`.${item[0]}-${item[1]}`).css("background", "rgb(214, 51, 51)");
    }
  }
}



// 2. set players
const player = {
  players: {
    player1: {
      id: 1,
      name: "PLAYER1",
      mark: "o"
    },
    player2: {
      id: 2,
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

  activatePlayerForm: function() {
    $("#form-bg").attr("class", "active");
  },

  updateDOM: function() {
    $("#player1 > h2").html(this.players.player1.name);
    $("#player1 > p").html(this.players.player1.mark);
    $("#player2 > h2").html(this.players.player2.name);
    $("#player2 > p").html(this.players.player2.mark);
  }

}
// form submit event
$("#gameSettingForm").on("submit", function(event) {
  event.preventDefault();

  const player1Name = $("#player1Name").val() || "Player1";
  const player2Name = $("#player2Name").val() || "Player2";

  const player1Mark = $("#player1Mark").val();
  const player2Mark = $("#player2Mark").val();

  player.changePlayersName(player1Name, player2Name);
  player.changePlayersMark(player1Mark, player2Mark);
  player.updateDOM();

  $("#form-bg").attr("class", "");

  const boardSize = parseInt($("#boardSize").val());

  board.initialise(boardSize);
  board.drawDOM();
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
      let answerTracker = [];


      for(let j=0; j<currentBoard.length; j++) {
        // console.log(`%c------------------- ${i}th loop start -------------------------`, `background: orange`)
        // if ref is "" or is not matched with the current piece, initialise counter and move ref to next piece.
        if(ref === "" || ref !== currentBoard[i][j]) {
          // initialise counter and answerTracker for next column check
          counter = 0;
          answerTracker = [];

          // move to next column
          ref = currentBoard[i][j];
        }
  
        // if ref is not "" and is matched with the current piece, add counter
        if(ref !== "" && ref === currentBoard[i][j]) {
          counter++;

          answerTracker.push([i, j]);
          console.log(`you clicked a piece on column ${i}, row ${j}, counter: ${counter}`);

          // if counter is 3 (3 pieces are matched in a row), return winner
          if(counter === 3) {
            console.log(answerTracker);

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
        //  not matched
        if(ref === "" || ref !== currentBoard[j][i]) {
          counter = 0;
          answerTracker = [];
          ref = currentBoard[j][i];
        }
  
        // matched
        if(ref === currentBoard[j][i]) {
          counter++;
          answerTracker.push([j, i]);

          if(counter === 3) {
            console.log("columns")
            console.log(answerTracker)

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
          console.log("diagonal top right")
          console.log(answerTracker);

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
          console.log("diagonal top left");
          console.log(answerTracker);

          return answerTracker;
        }
      }
    }
  },

  checkDraw: function() {
    const currentBoard = board.gameBoard;

    const totalPieces = currentBoard.length * currentBoard.length;
    let counter = 0;
  

    for(let i=0; i<currentBoard.length; i++) {
      for(let j=0; j<currentBoard.length; j++) {
        if(currentBoard[i][j] !== "") {
          counter++;
        }

        if(counter >= totalPieces - 1) {
          return true;
        }
      }
    }
  },

  displayResult: function(winner) {
    // block click event
    $("#board").css("pointer-events", "none");

    // delay for animation
    setTimeout(() => {
      $("#winner-bg").css("display", "block");

      if(winner === undefined) {
        $("#winner-bg p").html(`Draw!`);
      }else {
        $("#winner-bg p").html(`${winner.name} won!`);
        $(".playersInfo img").css("filter", "brightness(0.2)");
        $(`#player${winner.id} img`).css({
          "width": "360px",
          "filter": "none",
        });
      }
      $("#board").css("pointer-events", "auto");
    }, 500);


  },

  cleanResultDOM: function() {
    $("#winner-bg").css("display", "none");
    $(".playersInfo img").css({
      "filter": "none",
      "width": "180px",
    });
  },

  clickBoard: function(boardID) {
    const columnID = parseInt(boardID[0]);
    const rowID = parseInt(boardID[2]);

    // mark the board.gameBoard 
    const isMarked = board.mark(columnID, rowID, this.currentPlayer);

    // if the piece was already marked, return null
    if(isMarked === false) {
      return null;
    }

    // update board DOM
    board.drawDOM();

    // check the game result
    if(this.checkWin() !== undefined) {
      const matchedPiecesArr = this.checkWin();
      board.markResult(matchedPiecesArr);
      this.displayResult(this.currentPlayer);

      return null;
    }

    if(this.checkDraw()) {
      this.displayResult();

      return null;
    }

    // swap player
    this.swapPlayer();
  },
}

$("#playAgainBtn").on("click", function() {
  board.initialise();
  board.drawDOM();
  game.cleanResultDOM();
});

$("#playNewGameBtn").on("click", function() {
  // board.initialise();
  // board.drawDOM();
  game.cleanResultDOM();
  player.activatePlayerForm();
});