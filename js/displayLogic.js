const DOM = {
  // this will run once for every game
  drawGameBoard: function() {
    // get data from business part
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

  markGameBoard: function(column, row, currentPlayer) {
    const targetElement = $(`div[data-column='${column}'][data-row='${row}']`);
    targetElement.html(`<span>${currentPlayer.token}</span>`)
  },

  markResultOnGameBoard: function(resultArr) {
    for(let item of resultArr) {
      const targetElement = $(`div[data-column='${item[0]}'][data-row='${item[1]}']`);
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
        // if
        $(".resultScreen__text").html(`Draw!`);
      }else {
        // if one player win, 
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

  clickBoard: function(column, row) {
    // get data from business part
    const currentPlayer = game.currentPlayer;

    // mark the "gameBoard" array
    const isMarked = board.mark(column, row, currentPlayer);

    // if the piece was already marked, return null
    if(isMarked === false) {
      return null;
    }

    // update the board in the DOM
    this.markGameBoard(column, row, currentPlayer);

    // check the game result
    if(game.checkWin() !== undefined) {
      const matchedPiecesArr = game.checkWin();
      this.markResultOnGameBoard(matchedPiecesArr);
      this.displayGameResult(currentPlayer);

      return null;
    }

    // if nobody win yet, check if the game is drawn
    if(game.checkDraw()) {
      this.displayGameResult();

      return null;
    }

    // if game is still going, swap the player
    game.swapPlayer();
    // and active effect of the other player to play
    this.activeCurrentPlayer();
    // save current variables in the local storage
    DOM.saveInLocalStorage();

    // if a user is playing with AI
    if(game.singlePlayer) {
      // AI should click a piece here
    }
  },

  bringTheGameSettingScreen: function(delay) {
    //clear the local storage
    DOM.clearTheLocalStorageData();
    // activate the game setting screen
    $("#gameSettingScreen").addClass("active");
    setTimeout(() => {
      $(".gameTypeButtons-wrapper").addClass("active");
    }, delay);
    $("#playersInfoForm").removeClass("active");
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

    // save these in local storage
    localStorage.setItem("tic-tac-toe", JSON.stringify(gameData));
  },

  // this will run when a user refresh the browser, or start a new game
  getLocalStorageData: function() {
    // get local storage data
    const gameData = JSON.parse(localStorage.getItem('tic-tac-toe'));

    // if it's empty, do early return
    if(gameData === null) {
      return false;
    }

    // close the "gameSettingScreen" by removing "active" class
    $("#gameSettingScreen").addClass("class");

    // set local storage data in business logic variables
    board.gameBoard = gameData.board.gameBoard;
    board.boardSize = gameData.board.size;
    player.players = gameData.players;
    game.gameCounter = gameData.game.gameCounter;
    game.currentPlayer = gameData.game.currentPlayer;
    game.singlePlayer = gameData.game.singlePlayer;

    // and draw game board with those
    this.drawGameBoard();
  },

  clearTheLocalStorageData: function() {
    localStorage.clear("tic-tac-toe");
  }
}

// initialise game board (except player's info)
const initialiseGameBoard = function(boardSize) {
  // initialise gameCounter for new game
  game.gameCounter = 0;
  // initialise the game board 
  // it'll initialise the board to same size with before if you don't put argument
  board.initialise(boardSize);
  // clean the result screen
  DOM.cleanTheGameResult();
  // draw the initialised game board in the DOM
  DOM.drawGameBoard();
  // update players name and token
  DOM.updatePlayersInfo();
  // save initialised values in the local storage
  DOM.saveInLocalStorage();
}


// when browser is loaded
$(document).ready(function() {
  // check local storage first
  const LSData = DOM.getLocalStorageData();

  if(LSData === false) {
    DOM.bringTheGameSettingScreen();
  }

  DOM.updatePlayersInfo();
  // indicate the current player in the DOM
  DOM.activeCurrentPlayer();
})


// playAgain button click event handler
$("#playAgainBtn").on("click", function() {
  initialiseGameBoard();
});


// newGame button click event handler
$("#playNewGameBtn").on("click", function() {
  DOM.bringTheGameSettingScreen(1500);
});


$("#exitBtn").on("click", function() {
  DOM.bringTheGameSettingScreen(1500);
});


// form submit event handler
$("#playersInfoForm").on("submit", function(event) {
  // prevent refresh
  event.preventDefault();

  // get players names from the input. if a user didn't type anything, set it default value as "Player1"
  const player1Name = $("#player1Name").val() || "Player1";
  let player2Name = $("#player2Name").val() || "Player2";

  if(game.singlePlayer) {
    player2Name = "Robot";
  }

  // get players tokens
  const player1Token = $("#player1Token").val();
  const player2Token = $("#player2Token").val();

  // put the value in the business logic part
  player.changePlayersName(player1Name, player2Name);
  player.changePlayersToken(player1Token, player2Token);

  // get a board size
  const boardSize = parseInt($("#boardSize").val());
  // initialise game board with the boardSize
  initialiseGameBoard(boardSize);

  // close everything by removing "active" class
  $("#gameSettingScreen").removeClass("active");
  $("#playersInfoForm").removeClass("active");
});


// multiplayer button click event handler
$("#multiplayerBtn").on("click", function() {
  // update business logic variable
  game.singlePlayer = false;

  // close the game type modal
  $(".gameTypeButtons-wrapper").removeClass("active");
  // open the player info form
  $("#playersInfoForm").addClass("active");
});


// single player button click event handler
$("#singlePlayerBtn").on("click", function() {
  // update business logic variable
  game.singlePlayer = true;

  // close the game type modal
  $(".gameTypeButtons-wrapper").removeClass("active");
  // block the player2 inputs
  $(".playersInfoForm__player2").css({
    "opacity": 0.2,
    "pointer-events": "none",
  });
  // show a user playerInfoForm
  $("#playersInfoForm").addClass("active");
});