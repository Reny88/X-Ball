// X ball

document.addEventListener("DOMContentLoaded", () => {
    const runButton = document.getElementById("runButton");
    const gameOver = document.getElementById("gameOver");
    const scoreElement = document.getElementById("score");
    const gameArea = document.querySelector(".game-area");
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let ballRadius = 15;
    let x;
    let y;
    let dx;
    let dy;
    let paddleHeight = 20;
    let paddleWidth = 95;
    let paddleX;
    let rightPressed = false;
    let leftPressed = false;
    let bricks = [];
    let playerScore = 0;
    let computerScore = 0;
    let isGameOver = false;

    function applyMediaQueryAdjustments() {
        if (window.matchMedia("(max-width: 390px) and (max-height: 844px) and (-webkit-min-device-pixel-ratio: 3)").matches) {
            paddleWidth = 60;
            paddleHeight = 10;
            ballRadius = 10;
        } else {
            paddleWidth = 95;
            paddleHeight = 20;
            ballRadius = 15;
        }
    }

    function initBricks() {
        bricks = [];
        const brickContainers = document.querySelectorAll(".bricks-container1, .bricks-container2, .bricks-container3, .bricks-container4, .bricks-container5, .bricks-container6, .bricks-container7, .bricks-container8");
        brickContainers.forEach(container => {
            const brickNodes = container.querySelectorAll(".brick");
            brickNodes.forEach(brick => {
                brick.style.visibility = 'visible';
                const rect = brick.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                bricks.push({
                    x: rect.left - canvasRect.left,
                    y: rect.top - canvasRect.top,
                    width: rect.width,
                    height: rect.height,
                    status: 1,
                    node: brick
                });
            });
        });
    }

    function startGame() {
        applyMediaQueryAdjustments();
        gameArea.style.display = "block";
        gameOver.style.display = "none";
        runButton.style.display = "none";
        scoreElement.style.display = "block";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        rightPressed = false;
        leftPressed = false;
        isGameOver = false;
        initBricks();
        draw();
    }

    runButton.addEventListener("click", startGame);

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function collisionDetection() {
        bricks.forEach(brick => {
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brick.width && y > brick.y && y < brick.y + brick.height) {
                    dy = -dy;
                    brick.status = 0;
                    brick.node.style.visibility = 'hidden';
                    if (bricks.every(b => b.status === 0)) {
                        playerScore++;
                        updateScore();
                        startGame();
                    }
                }
            }
        });
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth && y + dy > canvas.height - paddleHeight - ballRadius) {
                dy = -dy;
                y = canvas.height - paddleHeight - ballRadius;
            } else {
                console.log("Game Over - Ball missed the paddle");
                computerScore++;
                updateScore();
                gameOver.style.display = "block";
                runButton.style.display = "block";
                isGameOver = true;
                return;
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

        if (!isGameOver) {
            requestAnimationFrame(draw);
        }
    }

    function updateScore() {
        scoreElement.textContent = `Player: ${playerScore} - Computer: ${computerScore}`;
    }

    applyMediaQueryAdjustments();
    window.addEventListener("resize", applyMediaQueryAdjustments);
});