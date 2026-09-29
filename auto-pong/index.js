const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.backgroundColor = 'black';

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
        ball.y >= canvas.height + 50 ||
        ball.y <= -50
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
    const ease = 0.08;

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


// Game start

function gameLoop() {
    clearCanvas();
    
    updateBall();
    updatePaddles();

    drawPaddles();
    drawBall();

    requestAnimationFrame(gameLoop);
}

gameLoop();