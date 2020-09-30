const config = {
    monsterWidth: 40,
    monsterHeight: 40,
    monsterGap: 20,
    monstersXOffset: 60,
    monstersYOffset: 50,
    monsterDx: 20,
    monsterDy: 20,
    userDx: 7,
    shotDy: -8,
    shotWidth: 8,
    shotHeight: 20,
}

const getMonsterPosition = i => {
    return (config.monsterWidth + config.monsterGap) * i;
}

const getMonsterXPosition = i => config.monstersXOffset + getMonsterPosition(i);
const getMonsterYPosition = i => config.monstersYOffset + getMonsterPosition(i);

const getImage = path => {
    const img = new Image();
    img.src = path;
    return img;
}

const getMonster = (x, y) => {
    return {
        img: getImage('monster.png'),
        x,
        y,
        width: config.monsterWidth,
        height: config.monsterHeight,
    }
}

const getHero = (x, y) => {
    return {
        img: getImage('battleship.svg'),
        x,
        y,
        width: config.monsterWidth,
        height: config.monsterHeight,
    }
}

const getNewHeroXPosition = (x, direction, planWidth) => {
    const newX = x + (config.userDx * direction)
    if (newX < config.monstersXOffset) return x;
    if (newX > planWidth - config.monstersXOffset) return x;
    return newX;
}

const getNewShotPosition = shot => {
    return {
        ...shot,
        y: shot.y + config.shotDy
    }
};
const getNewShotsPosition = shots => shots.map(shot => getNewShotPosition(shot));

const getNewShot = hero => {
    return {
        img: getImage('shot.png'),
        width: config.shotWidth,
        height: config.shotHeight,
        x: hero.x + config.monsterWidth / 2,
        y: hero.y
    }
}

const isColliding = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
}

const isCollidingWithArray = (item, array) => {
    return array.reduce((res,i) =>  !res ? isColliding(i, item) : res, false)
}

const getNotCollidedEntities = (enemies, shots) => {
    const newEnemies = enemies.filter(e => !isCollidingWithArray(e, shots))
    const newShots = shots.filter(e => !isCollidingWithArray(e, enemies))

    return [newEnemies, newShots]
}

const getMovedEnemy = (enemy, moveDown, xDirection) => {
    return {
        ...enemy,
        x: moveDown ? enemy.x : enemy.x + config.monsterDx * xDirection,
        y: moveDown ? enemy.y + config.monsterDy : enemy.y
    }
};
const getMovedEnemies = (enemies, moveDown, xDirection) => {
    return enemies.map(e => getMovedEnemy(e, moveDown, xDirection))
}

const Game = {
    constructEntities() {
        this.entities = [...this.enemies, this.hero, ...this.shots]
    },

    moveEnemies() {
        const moveDown = this.moves % 5 === 0
        const direction = this.moves % 10 >= 5 ? -1 : 1
        this.enemies = getMovedEnemies(this.enemies, moveDown, direction)
        this.moves++;
    },

    init(width, height) {
        this.planWidth = width;
        this.planHeight = height;
        this.enemies = []
        this.shots = []
        this.moves = 0;

        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 5; j++) {
                this.enemies.push(getMonster(getMonsterXPosition(i), getMonsterYPosition(j)))
            }
        }

        this.hero = getHero(width / 2 - config.monsterWidth / 2, height - 50);

        this.constructEntities()
    },

    next(left = false, right = false, shoot = false, movingEnemies = false) {
        let direction = 0
        if (left) direction = -1
        if (right) direction = 1
        if (left && right) direction = 0

        this.hero = {
            ...this.hero,
            x: getNewHeroXPosition(this.hero.x, direction, this.planWidth)
        }

        if (shoot) this.shots = this.shots.concat([getNewShot(this.hero)])
        this.shots = getNewShotsPosition(this.shots);
        this.shots = this.shots.filter(s => s.y > -100);

        [this.enemies, this.shots] = getNotCollidedEntities(this.enemies, this.shots);

        if (movingEnemies) this.moveEnemies()

        this.constructEntities()
        return this
    }
};