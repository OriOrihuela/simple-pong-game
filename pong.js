const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_COLOR = '#fff';
const BALL_COLOR = '#0ff';

let player = {
    x: PLAYER_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let ai = {
    x: AI_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = '#fff3';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Paddle collision (player)
    if (
        ball.x < player.x + player.width &&
        ball.x > player.x &&
        ball.y + ball.size > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.x = player.x + player.width;
        ball.dx *= -1.05;
        let collidePoint = ball.y + ball.size / 2 - (player.y + player.height / 2);
        ball.dy = collidePoint * 0.2;
    }

    // Paddle collision (AI)
    if (
        ball.x + ball.size > ai.x &&
        ball.x + ball.size < ai.x + ai.width &&
        ball.y + ball.size > ai.y &&
        ball.y < ai.y + ai.height
    ) {
        ball.x = ai.x - ball.size;
        ball.dx *= -1.05;
        let collidePoint = ball.y + ball.size / 2 - (ai.y + ai.height / 2);
        ball.dy = collidePoint * 0.2;
    }

    // Score check
    if (ball.x < 0 || ball.x + ball.size > canvas.width) {
        resetBall();
    }

    // AI movement (much faster)
    let target = ball.y - (ai.height / 2) + (ball.size / 2);
    // Increased max speed and multiplier for much faster movement:
    if (ai.y + ai.height / 2 < ball.y + ball.size / 2) {
        ai.dy = Math.min(16, target - ai.y);
    } else {
        ai.dy = Math.max(-16, target - ai.y);
    }
    ai.y += ai.dy * 0.2;

    // Clamp AI paddle
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, PADDLE_COLOR);
    drawRect(ai.x, ai.y, ai.width, ai.height, PADDLE_COLOR);
    drawRect(ball.x, ball.y, ball.size, ball.size, BALL_COLOR);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

gameLoop();
