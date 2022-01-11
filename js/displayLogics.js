const DOM = {
  drawGameBoard: function() {
    const gameBoard = board.gameBoard;
    // clean the DOM, and set the layout with grid
    $("#board")
      .html("")
      .css({
      "grid-template-columns": `repeat(${gameBoard.length}, 1fr)`,
      "grid-template-rows": `repeat(${gameBoard.length}, 1fr)`
    });

    // append items in board
    for(let i=0; i<gameBoard.length; i++) {
      for(let j=0; j<gameBoard.length; j++) {
        $("#board").append(`
          <div data-column="${i}" data-row="${j}">
            <span>${gameBoard[i][j]}</span>
          </div>
        `);
      }
    }

    // connect to event handler
    $("#board > div").on("click", function() {
      const column = $(this).attr("data-column");
      const row = $(this).attr("data-row");

      DOM.clickBoard(column, row);
    })
  },

  markResultOnGameBoard: function(resultArr) {
    for(let item of resultArr) {
      const targetElement = $(`div[data-column='${item[0]}'][data-row='${item[1]}']`);
      targetElement.css("background", "rgb(214, 51, 51)");
    }
  },

  updatePlayersInfo: function() {
    const playersInfo = player.players;

    $("#player1 > h2").html(playersInfo.player1.name);
    $("#player1 > p").html(playersInfo.player1.token);
    $("#player2 > h2").html(playersInfo.player2.name);
    $("#player2 > p").html(playersInfo.player2.token);
  },

  displayGameResult: function(winner) {
    // block the click event
    $("#board").css("pointer-events", "none");

    // delay this for smoother animation
    setTimeout(() => {
      $("#resultScreen").css("display", "block");

      if(winner === undefined) {
        // if
        $(".resultScreen__text").html(`Draw!`);
      }else {
        // if one player win, 
        $(".resultScreen__text").html(`${winner.name} wins!`);
        $(".playersBar__player img").css("filter", "brightness(0.2)");
        $(`#player${winner.id} img`).css({
          "width": "360px",
          "filter": "none",
        });
      }

      // enable the click event for next game
      $("#board").css("pointer-events", "auto");
    }, 500);
  },

  cleanTheGameResult: function() {
    $("#resultScreen").css("display", "none");
    $(".playersBar__player img").css({
      "filter": "none",
      "width": "180px",
    });
  },

  clickBoard: function(column, row) {
    // mark the "gameBoard" array
    const isMarked = board.mark(column, row, game.currentPlayer);

    // if the piece was already marked, return null
    if(isMarked === false) {
      return null;
    }

    // update the board in the DOM
    this.drawGameBoard();

    // check the game result
    if(game.checkWin() !== undefined) {
      const matchedPiecesArr = game.checkWin();
      this.markResultOnGameBoard(matchedPiecesArr);
      this.displayGameResult(game.currentPlayer);

      return null;
    }

    // if nobody win yet, check if the game is drawn
    if(game.checkDraw()) {
      this.displayGameResult();

      return null;
    }

    // if game is still going, swap the player
    game.swapPlayer();
  },
}



board.initialise();
DOM.drawGameBoard();

// playAgain button click event handler
$("#playAgainBtn").on("click", function() {
  // clean the result screen
  DOM.cleanTheGameResult();
  // initialise the game board
  board.initialise();
  // draw the initialised game board in the DOM
  DOM.drawGameBoard();
});

// newGame button click event handler
$("#playNewGameBtn").on("click", function() {
  // clean the result screen
  DOM.cleanTheGameResult();
  // activate the game setting screen
  $("#gameSettingScreen").attr("class", "active");
});

// form submit event handler
$("#playersInfoForm").on("submit", function(event) {
  // prevent refresh
  event.preventDefault();

  // get players names from the input. if a user didn't type anything, set it default value as "Player1"
  const player1Name = $("#player1Name").val() || "Player1";
  const player2Name = $("#player2Name").val() || "Player2";

  // get players tokens
  const player1Token = $("#player1Token").val();
  const player2Token = $("#player2Token").val();

  // put the value in the business logic part
  player.changePlayersName(player1Name, player2Name);
  player.changePlayersToken(player1Token, player2Token);
  // and update the DOM as well
  DOM.updatePlayersInfo();

  // get a board size
  const boardSize = parseInt($("#boardSize").val());

  // initialise the game board with user's size input
  board.initialise(boardSize);

  // and draw the game board in the DOM
  DOM.drawGameBoard();

  // close the "gameSettingScreen" by removing "active" class
  $("#gameSettingScreen").attr("class", "");
});