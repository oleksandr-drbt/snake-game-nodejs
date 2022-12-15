const GameUI = require('./GameUI');
const {
  GAME_SPEED,
  DEFAULT_BOARD_WIDTH,
  DEFAULT_BOARD_HEIGHT,
  DEFAULT_SNAKE_LENGTH,
  UP_DIRECTION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  DIRECTION_SHIFTS,
} = require('./config');

class Game {
  timer = null;
  snake = [];
  food = null;
  direction = RIGHT_DIRECTION;
  isGameOver = false;

  constructor(boardWidth = DEFAULT_BOARD_WIDTH, boardHeight = DEFAULT_BOARD_HEIGHT) {
    this.ui = new GameUI(boardWidth, boardHeight);
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
  }

  generateBaseSnake() {
    return Array(DEFAULT_SNAKE_LENGTH)
      .fill(null)
      .map((part, index) => ({
        x: index,
        y: 0,
      }))
      .reverse();
  }

  generateRandomFood() {
    const food = {
      x: this.generateRandomCoordinate(0, this.boardWidth - 1),
      y: this.generateRandomCoordinate(0, this.boardHeight - 1),
    };

    // Check if generated food is inside the snake
    if (!!this.snake.find(({ x, y }) => x === food.x && y === food.y)) {
      return this.generateRandomFood();
    }

    return food;
  }

  generateRandomCoordinate(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  init() {
    this.timer = null;
    this.snake = this.generateBaseSnake();
    this.food = this.generateRandomFood();
    this.direction = RIGHT_DIRECTION;
    this.isGameOver = false;
  }

  moveSnake() {
    const headCoordinate = {
      x: this.snake[0].x + DIRECTION_SHIFTS[this.direction].x,
      y: this.snake[0].y + DIRECTION_SHIFTS[this.direction].y,
    };

    if (this.checkCollides(headCoordinate)) {
      clearInterval(this.timer);
      this.isGameOver = true;
      this.ui.showGameOver();
      return;
    }

    this.snake.unshift(headCoordinate);

    // Check if snake ate food
    if (headCoordinate.x === this.food.x && headCoordinate.y === this.food.y) {
      this.food = this.generateRandomFood();
    } else {
      this.snake.pop();
    }
  }

  checkCollides(headCoordinate) {
    const collidedItself = !!this.snake.find(({ x, y }) => x === headCoordinate.x && y === headCoordinate.y);
    const collidedTopWall = headCoordinate.y < 0;
    const collidedBottomWall = headCoordinate.y > this.boardHeight - 1;
    const collidedLeftWall = headCoordinate.x < 0;
    const collidedRightWall = headCoordinate.x > this.boardWidth - 1;

    return collidedItself || collidedTopWall || collidedBottomWall || collidedLeftWall || collidedRightWall;
  }

  tick() {
    this.moveSnake();
    if (this.isGameOver) {
      return;
    }

    this.ui.setSnake(this.snake);
    this.ui.setFood(this.food);
    this.ui.render();
  }

  changeDirection(direction) {
    if (
      (direction === UP_DIRECTION && this.direction !== DOWN_DIRECTION)
      || (direction === DOWN_DIRECTION && this.direction !== UP_DIRECTION)
      || (direction === RIGHT_DIRECTION && this.direction !== LEFT_DIRECTION)
      || (direction === LEFT_DIRECTION && this.direction !== RIGHT_DIRECTION)
    ) {
      this.direction = direction;
    }
  }

  setKeyPressListener() {
    const { stdin } = process;

    stdin.setRawMode(true);
    stdin.resume();

    stdin.on('keypress', (character, key) => {
      if ([UP_DIRECTION, DOWN_DIRECTION, RIGHT_DIRECTION, LEFT_DIRECTION].includes(key.name)) {
        this.changeDirection(key.name);
      }

      if (key.sequence === '\x03') {
        process.exit();
      }
    });
  }

  start() {
    if (!this.timer) {
      this.init();
      this.setKeyPressListener();
      this.timer = setInterval(this.tick.bind(this), GAME_SPEED);
    }
  }
}

module.exports = Game;
