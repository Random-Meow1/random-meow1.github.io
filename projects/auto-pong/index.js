const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.backgroundColor = 'black';

let paddleSnapStrength = 0.08;

let paddles = [
    {
        x: canvas.width / 2,
        y: 20,
        width: 100,
        height: 20,
        color: 'white'
    },
    {
        x: canvas.width / 2,
        y: canvas.height - 20,
        width: 100,
        height: 20,
        color: 'white'
    }
];

let ball = {
    x: paddles[0].x,
    y: paddles[0].y + 50,
    size: 50,
    velocityX: 3,
    velocityY: 4,
    gravity: 0,
    color: 'white'
}

function reset() {
    ball.x = paddles[0].x;
    ball.y = paddles[0].y + 50;
    ball.velocityY = Math.abs(ball.velocityY);
    hitsCount = 0;
    paddles[0].color = 'white';
    paddles[1].color = 'white';
}


// Drawing

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPaddles() {
    // Paddle 0
    ctx.fillStyle = paddles[0].color;
    ctx.fillRect(paddles[0].x - (paddles[0].width / 2), paddles[0].y - (paddles[0].height / 2), paddles[0].width, paddles[0].height);

    // Paddle 1
    ctx.fillStyle = paddles[1].color;
    ctx.fillRect(paddles[1].x - (paddles[1].width / 2), paddles[1].y - (paddles[1].height / 2), paddles[1].width, paddles[1].height);
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);
}


// Game mechanics

let hitsCount = 0

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ball.velocityY += ball.gravity / 10;
    checkBallCollision();
}

function checkBallCollision() {
    if (
        ball.x >= canvas.width - ball.size / 2 ||
        ball.x <= ball.size / 2
    ) {
        ball.velocityX *= -1;
    }
    if (ball.y >= paddles[1].y) {
        paddles[1].color = 'red';
    }
    if (ball.y <= paddles[0].y) {
        paddles[0].color = 'red';
    }
    if (
        ball.y >= canvas.height + 150 ||
        ball.y <= -150
    ) {
        reset();
    }

    if (
        ball.x >= paddles[0].x - paddles[0].width / 2 &&
        ball.x <= paddles[0].x + paddles[0].width / 2 &&
        ball.y >= paddles[0].y - paddles[0].height / 2 &&
        ball.y <= paddles[0].y + (paddles[0].height / 2 + ball.size / 2)
    ) {
        ball.velocityY *= -1;
        hitsCount += 1;
    }
    if (
        ball.x <= paddles[1].x + paddles[1].width / 2 &&
        ball.x >= paddles[1].x - paddles[1].width / 2 &&
        ball.y >= paddles[1].y - (paddles[1].height / 2 + ball.size / 2) &&
        ball.y <= paddles[1].y + paddles[1].height / 2
    ) {
        ball.velocityY *= -1;
        hitsCount += 1;
    }
}

let targetX = [canvas.width / 2, canvas.width / 2];

function updateAI() {
    // Made with AI
    // Top paddle (Paddle 0): Tracks ball position when ball moves up
    if (ball.velocityY < 0) {
        targetX[0] = ball.x;
    } else {
        targetX[0] = canvas.width / 2;
    }

    // Bottom paddle (Paddle 1): Tracks ball position when ball moves down
    if (ball.velocityY > 0) {
        targetX[1] = ball.x;
    } else {
        targetX[1] = canvas.width / 2;
    }
}

function updatePaddles() {
    // Made with AI
    updateAI();

    // Smooth factor between 0 (no movement) and 1 (instant snap)
    // 0.05 to 0.08 creates a responsive, natural human ease-in/ease-out effect
    const ease = paddleSnapStrength;

    // Linear Interpolation: currentPos += (targetPos - currentPos) * ease
    paddles[0].x += (targetX[0] - paddles[0].x) * ease;
    paddles[1].x += (targetX[1] - paddles[1].x) * ease;

    // Clamp paddle positions so they stay inside the canvas boundary
    paddles.forEach(paddle => {
        const halfWidth = paddle.width / 2;
        if (paddle.x - halfWidth < 0) paddle.x = halfWidth;
        if (paddle.x + halfWidth > canvas.width) paddle.x = canvas.width - halfWidth;
    });
}

const ballSpeedInputX = document.querySelector('#ballSpeedX');
const ballSpeedInputY = document.querySelector('#ballSpeedY');
const paddleSnapStrengthInput = document.querySelector('#paddleSnapStrength');
const ballSizeInput = document.querySelector('#ballSize');
const paddleLengthInput = document.querySelector('#paddleLength');

const canvasWidthInput = document.querySelector('#canvasWidth');
const canvasHeightInput = document.querySelector('#canvasHeight');

function resizeCanvas(newWidth, newHeight) {
    if (canvas.width === newWidth && canvas.height === newHeight) return;

    // Update actual canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Reposition top and bottom paddles relative to new dimensions
    paddles[0].y = 20;
    paddles[1].y = canvas.height - 20;

    // Keep paddles within horizontal bounds
    paddles.forEach(paddle => {
        const halfWidth = paddle.width / 2;
        if (paddle.x - halfWidth < 0) paddle.x = halfWidth;
        if (paddle.x + halfWidth > canvas.width) paddle.x = canvas.width - halfWidth;
    });
}

function applyUserValues() {
    const newSpeedX = parseFloat(ballSpeedInputX.value);
    const newSpeedY = parseFloat(ballSpeedInputY.value);
    const newPaddleSnapStrength = parseFloat(paddleSnapStrengthInput.value);
    const newBallSize = parseFloat(ballSizeInput.value);
    const newPaddleLength = parseFloat(paddleLengthInput.value);
    
    // Read canvas dimension inputs
    const newCanvasWidth = parseFloat(canvasWidthInput.value);
    const newCanvasHeight = parseFloat(canvasHeightInput.value);

    // Apply canvas dimensions if valid
    if (!isNaN(newCanvasWidth) && newCanvasWidth >= 100 &&
        !isNaN(newCanvasHeight) && newCanvasHeight >= 100) {
        resizeCanvas(newCanvasWidth, newCanvasHeight);
    }

    if (!isNaN(newSpeedX) && newSpeedX >= 0 && !isNaN(newSpeedY) && newSpeedY >= 0) {
        // Preserve moving direction while updating magnitude
        const dirX = Math.sign(ball.velocityX) || 1;
        const dirY = Math.sign(ball.velocityY) || 1;

        ball.velocityX = dirX * newSpeedX;
        ball.velocityY = dirY * newSpeedY;
    }

    if (!isNaN(newPaddleSnapStrength)) {
        paddleSnapStrength = newPaddleSnapStrength;
    }

    if (!isNaN(newBallSize) && newBallSize > 0) {
        ball.size = newBallSize;
    }

    if (!isNaN(newPaddleLength) && newPaddleLength >= 30) {
        paddles[0].width = newPaddleLength;
        paddles[1].width = newPaddleLength;
    }
}


// Game start

function gameLoop() {
    clearCanvas();
    
    updateBall();
    updatePaddles();

    drawPaddles();
    drawBall();

    applyUserValues();

    requestAnimationFrame(gameLoop);
}

gameLoop();