/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.players = [p1, p2];
    this.currentPlayer = p1;
    this.makeBoard();
    this.makeBoardHtml();
    this.gameOver = false;
  }

  /**makeBoard =>  creates in-game board structure
   * board = array of rows, each row is an array of cells with coordinates
   * board([y][x])
   */

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /**makeBoardHtml => creates HTML table of rows and columns */

  makeBoardHtml() {
    const table = document.getElementById("board");
    table.innerHTML = "";

    // top clickable area for players to choose where pieces go
    const top = document.createElement("tr");
    top.setAttribute("id", "top-column");

    // store reference to handleClick function to remove correctly later
    this.handleGameClick = this.handleGameClick.bind(this);

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    table.append(top);

    // main part of game board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      table.append(row);
    }
  }

  /**findSpotForPiece => given x value from top column, return top y (null if filled) */

  findSpotForPiece(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) return y;
    }
    return null;
  }

  /**placeInTable => update DOM and place piece into board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add(
      "slide-bottom",
      "piece",
      `${this.currentPlayer === this.players[0] ? "p1" : "p2"}`
    );

    const innerPiece = document.createElement("div");
    innerPiece.classList.add("inner-piece");
    piece.append(innerPiece);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /**endGame => alerts players of the winner and end of the game  */

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#top-column");
    top.removeEventListener("click", this.handleGameClick);
  }

  /**handleGameClick => handle click of top column to play pieces */

  handleGameClick(e) {
    //get x from the "id" of clicked cell
    const x = +e.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForPiece(x);
    if (y === null) return;

    //place piece in board and add to HTML table
    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);

    //check for a tie
    if (this.board.every((row) => row.every((cell) => cell)))
      return this.endGame("Tie!");

    //check for winner
    if (this.checkForWinner()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currentPlayer.color} player won!`);
    }

    // switch players
    this.currentPlayer =
      this.currentPlayer === this.players[0]
        ? this.players[1]
        : this.players[0];
  }

  /**checkForWinner => check board cell-by-cell for a win in each direction */

  checkForWinner() {
    // check for four cells that are all current player color
    // - cells: array of four (y,x) cells
    const win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currentPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        //get checklist of 4 cells (starting here) for each of the different ways to win
        const horizontal = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vertical = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner
        if (win(horizontal) || win(vertical) || win(diagDR) || win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player("red");
  let p2 = new Player("gold");
  new Game(p1, p2);
  let game = document.querySelector("#game");
  game.style.display = "block";
});
