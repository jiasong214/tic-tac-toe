const DOM = {
  // this will run once for every game
  drawGameBoard: function() {
    // get data from business part
    const gameBoard = board.gameBoard;

    // clean the DOM, and set the layout with grid
    $("#board")
      .html("")
      .css({
      "grid-template-rows": `repeat(${gameBoard.length}, 1fr)`,
      "grid-template-columns": `repeat(${gameBoard.length}, 1fr)`
    });

    // append the items in the board
    for(let i=0; i<gameBoard.length; i++) {
      for(let j=0; j<gameBoard.length; j++) {
        $("#board").append(`
          <div data-row="${i}" data-column="${j}">
            <span>${gameBoard[i][j]}</span>
          </div>
        `);
      }
    }

    // connect to the click event handler
    $("#board > div").on("click", function() {
      const row = $(this).attr("data-row");
      const column = $(this).attr("data-column");

      DOM.clickBoard(row, column);
    })
  },

  markGameBoard: function(row, column, currentPlayer) {
    const targetElement = $(`div[data-row='${row}'][data-column='${column}']`);
    targetElement.html(`<span>${currentPlayer.token}</span>`);
  },

  markResultOnGameBoard: function(resultArr) {
    for(let item of resultArr) {
      const targetElement = $(`div[data-row='${item[0]}'][data-column='${item[1]}']`);
      targetElement.css("background", "rgb(214, 51, 51)");
    }
  },

  updatePlayersInfo: function() {
    // get data from business part
    const playersInfo = player.players;

    $("#player1 > h2").html(playersInfo.player1.name);
    $("#player1 > p").html(playersInfo.player1.token);
    $("#player2 > h2").html(playersInfo.player2.name);
    $("#player2 > p").html(playersInfo.player2.token);
  },

  activeCurrentPlayer: function() {
    const currentPlayer = game.currentPlayer;

    $(".playersBar__player img").css({
      "width": "180px",
      "filter": "opacity(0.2)"
    });
    $(`#player${currentPlayer.id} img`).css({
      "width": "200px",
      "filter": "none",
    });
  },

  displayGameResult: function(winner) {
    // block the click event
    $("#board").css("pointer-events", "none");

    // delay this for smoother animation
    setTimeout(() => {
      $("#resultScreen").css("display", "block");

      if(winner === undefined) {
        // if the game is drawn
        $(".resultScreen__text").html(`Draw!`);
      }else {
        // if one player wins, display their name
        $(".resultScreen__text").html(`${winner.name} wins!`);
        $(".playersBar__player img").css("filter", "opacity(0.2)");
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

  openTheGameSettingScreen: function(delay) {
    // clear the local storage
    DOM.clearTheLocalStorageData();
    // activate the game setting screen
    $("#gameSettingScreen").addClass("active");
    // delay for animation
    setTimeout(() => {
      $(".gameTypeButtons-wrapper").addClass("active");
    }, delay);
    $("#playersInfoForm").removeClass("active");
  },

  clickBoard: function(row, column) {
    // get the current player from the business part
    const currentPlayer = game.currentPlayer;

    // 1. mark the "gameBoard" array
    const isMarked = board.mark(row, column, currentPlayer);

    // if the cell was already marked, return null
    if(isMarked === false) {
      return null;
    }

    // 2. update the board in the DOM
    this.markGameBoard(row, column, currentPlayer);

    // 3. check the game result
    // get the winning cell positions
    const winningPositionsArr = game.checkWin();

    if(winningPositionsArr !== undefined) {
      // and mark in the DOM with it
      this.markResultOnGameBoard(winningPositionsArr);
      // and display winner
      this.displayGameResult(currentPlayer);

      return null;
    }

    // 4. if nobody won yet, check if the game is drawn
    if(game.checkDraw()) {
      this.displayGameResult();

      return null;
    }


    // 5. if game is still going, swap the player
    game.swapPlayer();
    // and activate the effect of the other player to play
    this.activeCurrentPlayer();
    // and save the current variables in the local storage
    DOM.saveInLocalStorage();


    // 6. if a user is playing with AI, then next turn is "Robot"
    if(game.currentPlayer.name === "Robot") {
      // disable click while robot is thinking
      $("#board").css("pointer-events", "none");
      this.playWithAI();
    }
  },

  playWithAI: function() {
    // delay for smoother animation
    setTimeout(function() {
      // get the best position from logic part
      const position = AI.chooseCell();

      // and click the board
      DOM.clickBoard(position[0], position[1]);

      // and re-enable click event for the board
      $("#board").css("pointer-events", "auto");
    }, 500);
  },

  // this will run every time when a user clicks the gameBoard
  saveInLocalStorage: function() {
    const gameData = {
      players: player.players,
      board: {
        gameBoard: board.gameBoard,
        size: board.boardSize,
      },
      game: {
        currentPlayer: game.currentPlayer,
        singlePlayer: game.singlePlayer,
        gameCounter: game.gameCounter
      }
    }

    // save the object in local storage
    localStorage.setItem("tic-tac-toe", JSON.stringify(gameData));
  },

  // this will run when a user refreshes the browser, or starts a new game
  getLocalStorageData: function() {
    // get the local storage data
    const gameData = JSON.parse(localStorage.getItem('tic-tac-toe'));

    // if it's empty, do an early return
    if(gameData === null) {
      return false;
    }

    // close the "gameSettingScreen" by removing "active" class
    $("#gameSettingScreen").removeClass("active");
    $("#playersInfoForm").removeClass("active");

    // set the business logic variables with local storage data
    board.gameBoard = gameData.board.gameBoard;
    board.boardSize = gameData.board.size;
    player.players = gameData.players;
    game.gameCounter = gameData.game.gameCounter;
    game.currentPlayer = gameData.game.currentPlayer;
    game.singlePlayer = gameData.game.singlePlayer;
    board.setNumberToWin();

    // and draw game board with those
    this.drawGameBoard();
  },

  clearTheLocalStorageData: function() {
    localStorage.clear("tic-tac-toe");
  }
}

// reset the game board (except the player's info)
const resetGameBoard = function(boardSize) {
  // reset gameCounter for a new game
  game.gameCounter = 0;
  // reset the currentPlayer to avoid robot starting first
  game.currentPlayer = player.players.player1;
  // reset the game board 
  // it'll reset the board to same size as before if you don't put any argument
  board.initialise(boardSize);
  // clean the result screen
  DOM.cleanTheGameResult();
  // draw the reset game board in the DOM
  DOM.drawGameBoard();
  // update players name and token
  DOM.updatePlayersInfo();
  // save reset values in the local storage
  DOM.saveInLocalStorage();
}

// when the browser is loaded
$(document).ready(function() {
  // check the local storage first
  const LSData = DOM.getLocalStorageData();

  if(LSData === false) {
    DOM.openTheGameSettingScreen();
  }

  DOM.updatePlayersInfo();
  // indicate the current player in the DOM
  DOM.activeCurrentPlayer();

  // if the next turn was "Robot", then "Robot" will play automatically
  if(game.currentPlayer.name === "Robot") {
    DOM.playWithAI();
  }
});

// multiplayer button click event handler
$("#multiplayerBtn").on("click", function() {
  // save game type in logic part
  game.singlePlayer = false;

  // close the game-type modal
  $(".gameTypeButtons-wrapper").removeClass("active");
  $(".playersInfoForm__player2").css({
    "opacity": 1,
    "pointer-events": "auto",
  });
  // open the player info form
  $("#playersInfoForm").addClass("active");
});

// single player button click event handler
$("#singlePlayerBtn").on("click", function() {
  game.singlePlayer = true;

  // close the game type modal
  $(".gameTypeButtons-wrapper").removeClass("active");
  // block the player2 inputs
  $(".playersInfoForm__player2").css({
    "opacity": 0.2,
    "pointer-events": "none",
  });
  // display the user playerInfoForm
  $("#playersInfoForm").addClass("active");
});

// form submit event handler
$("#playersInfoForm").on("submit", function(event) {
  // prevent refresh
  event.preventDefault();

  // get players names from the input. if a user didn't type anything, set it's default value as "Player1"
  const player1Name = $("#player1Name").val() || "Player1";
  let player2Name = $("#player2Name").val() || "Player2";

  // if a user is playing with AI, set player2 "Robot"
  if(game.singlePlayer) {
    player2Name = "Robot";
  }

  // player names can't be same
  if(player1Name === player2Name) {
    return null
  }

  // get player tokens
  const player1Token = $("#player1Token").val();
  const player2Token = $("#player2Token").val();

  // save the input values in the business logic part
  player.changePlayersName(player1Name, player2Name);
  player.changePlayersToken(player1Token, player2Token);

  // get a board size 
  const boardSize = parseInt($("#boardSize").val());
  // reset game board with the input boardSize
  resetGameBoard(boardSize);

  // close everything by removing "active" class
  $("#gameSettingScreen").removeClass("active");
  $("#playersInfoForm").removeClass("active");
});

// playAgain button click event handler
$("#playAgainBtn").on("click", function() {
  resetGameBoard();
});

// newGame button click event handler
$("#playNewGameBtn").on("click", function() {
  DOM.openTheGameSettingScreen(1500);
});

$("#exitBtn").on("click", function() {
  DOM.openTheGameSettingScreen(1500);
});