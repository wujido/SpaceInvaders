const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let userMoveLeft = false;
let userMoveRight = false;
let userSpace = false;

const handleKeyDown = e => {
    const key = e.key
    if (key === 'ArrowLeft') userMoveLeft = true;
    if (key === 'ArrowRight') userMoveRight = true;
    if (key === ' ') userSpace = true;
}

const handleKeyUp = e => {
    const key = e.key
    if (key === 'ArrowLeft') userMoveLeft = false;
    if (key === 'ArrowRight') userMoveRight = false;
}

const handleUserInput = () => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
};

const print = frame => {
    frame.entities.forEach(e => {
        ctx.drawImage(e.img, e.x, e.y, e.width, e.height);
    })
}

let timeFromPreviousMove = 0;
let previousFrameTime = 0;


const canMoveEnemy = () => {
    if (timeFromPreviousMove > 1500) {
        timeFromPreviousMove = 0
        return true
    }
    return false
}

const frame = timeFromStart => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleUserInput()

    timeFromPreviousMove += timeFromStart - previousFrameTime;
    const currentFrame = Game.next(userMoveLeft, userMoveRight, userSpace, canMoveEnemy())
    userSpace = false;

    // console.log(currentFrame)
    print(currentFrame)
    previousFrameTime = timeFromStart
    requestAnimationFrame(frame)
}


Game.init(canvas.width, canvas.height);
requestAnimationFrame(frame)
