function TheGame() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    let helper = true
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let asteroids = [];
    let bullets = []
    let score = 0;
    let lives = 5;


// function collides(obj1, obj2) {
//     return obj1.x < obj2.x + obj2.width &&
//         obj1.x + obj1.width > obj2.x &&
//         obj1.y < obj2.y + obj2.height &&
//         obj1.y + obj1.height > obj2.y;
//
// }
    let highScore;

    function CircleCollision(obj1, obj2) {

        return (obj1.radius + obj2.radius) >
            Math.sqrt(
                (Math.pow(obj1.x - obj2.x, 2)) +
                (Math.pow(obj1.y - obj2.y, 2)));
    }

    class GameObj {
        constructor(x, y, speed, radius, angle) {
            this.angle = angle
            this.radius = radius
            this.speed = speed
            this.y = y
            this.x = x
        }
    }


    class Ship extends GameObj {
        constructor() {
            super(canvas.width / 2, canvas.height / 2, 0.05, 14, Math.PI / 2)
            this.movingFront = false;
            this.movingLeft = false;
            this.movingRight = false;
            this.accX = 0;
            this.accY = 0;
            this.angleSpeed = Math.PI / 0.9;
            this.layoutRadius = 20;
            this.gunPlaceX = canvas.width / 2;
            this.gunPlaceY = canvas.height / 2;
            this.visible = true;
        }

        update(secondPart) {
            window.addEventListener('keydown', (e) => {
                if (e.code === 'KeyW') {
                    this.movingFront = true

                }
                if (e.code === 'KeyA') {
                    this.movingLeft = true
                    this.movingRight = false
                }
                if (e.code === 'KeyD') {
                    this.movingLeft = false
                    this.movingRight = true
                }
            })
            window.addEventListener('keyup', (e) => {
                if (e.code === 'KeyW') {
                    this.movingFront = false

                }
                if (e.code === 'KeyA') {
                    this.movingLeft = false
                }
                if (e.code === 'KeyD') {
                    this.movingRight = false
                }
            })
            if (this.movingLeft) {
                this.angle += this.angleSpeed * secondPart
            }
            if (this.movingRight) {
                this.angle -= this.angleSpeed * secondPart
            }


            if (this.movingFront) {
                this.accX += this.speed * Math.cos(this.angle)
                this.accY += this.speed * Math.sin(this.angle)
            } else {
                this.accX /= 1.01
                this.accY /= 1.01
            }
            this.x += this.accX
            this.y -= this.accY

            if (this.x < 0) {
                this.x = canvas.width
            }
            if (this.x > canvas.width) {
                this.x = 0
            }
            if (this.y < 0) {
                this.y = canvas.height
            }
            if (this.y > canvas.height) {
                this.y = 0
            }
        }


        render() {
            const dAngle = (Math.PI * 2) / 3
            this.gunPlaceX = this.x + this.layoutRadius * Math.cos(this.angle) / 4
            this.gunPlaceY = this.y - this.layoutRadius * Math.sin(this.angle) / 4
            ctx.beginPath()
            ctx.moveTo(
                this.x + this.layoutRadius * Math.cos(this.angle) / 2,
                this.y - this.layoutRadius * Math.sin(this.angle) / 2
            )
            ctx.lineTo(
                this.x + this.layoutRadius * Math.cos(this.angle + dAngle) / 3,
                this.y - this.layoutRadius * Math.sin(this.angle + dAngle) / 3
            )
            if (spaceship.movingFront) {
                ctx.lineTo(
                    this.x - this.layoutRadius * Math.cos(this.angle + 1) / 12,
                    this.y + this.layoutRadius * Math.sin(this.angle + 1) / 12
                )
                ctx.lineTo(
                    this.x - this.layoutRadius * Math.cos(this.angle) / 4,
                    this.y + this.layoutRadius * Math.sin(this.angle) / 4
                )
            }

            ctx.lineTo(
                this.x - this.layoutRadius * Math.cos(this.angle) / 16,
                this.y + this.layoutRadius * Math.sin(this.angle) / 16
            )
            if (spaceship.movingFront) {
                ctx.lineTo(
                    this.x - this.layoutRadius * Math.cos(this.angle) / 4,
                    this.y + this.layoutRadius * Math.sin(this.angle) / 4
                )
                ctx.lineTo(
                    this.x - this.layoutRadius * Math.cos(this.angle - 1) / 12,
                    this.y + this.layoutRadius * Math.sin(this.angle - 1) / 12
                )
            }

            ctx.lineTo(
                this.x + this.layoutRadius * Math.cos(this.angle + 2 * dAngle) / 3,
                this.y - this.layoutRadius * Math.sin(this.angle + 2 * dAngle) / 3
            )

            ctx.closePath()
            ctx.fillStyle = "black";
            ctx.fill()
            ctx.strokeStyle = 'red'
            ctx.stroke()
        }

    }


    class Bullet extends GameObj {
        constructor(angle) {
            super(spaceship.gunPlaceX, spaceship.gunPlaceY, 10, 2, angle)
            this.visible = true;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y -= Math.sin(this.angle) * this.speed;
        }

        render() {
            if (this.visible) {
                ctx.beginPath()
                ctx.strokeStyle = '#b4b4b4';
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.stroke()
            }
        }
    }

    class Asteroid extends GameObj {
        constructor(x, y, radius, level, layoutRadius) {
            super(
                x || Math.floor(Math.random() * canvas.width),
                y || Math.floor(Math.random() * canvas.height),
                3,
                radius || 46,
                Math.random() * Math.PI
            )
            this.level = level || 1
            this.layoutRadius = layoutRadius || 50;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.x < 0) {
                this.x = canvas.width
            }
            if (this.x > canvas.width) {
                this.x = 0
            }
            if (this.y < 0) {
                this.y = canvas.height
            }
            if (this.y > canvas.height) {
                this.y = 0
            }
        }

        render() {
            ctx.beginPath();
            let vertAngle = ((Math.PI * 2) / 7);
            for (let i = 0; i < 7; i++) {
                ctx.lineTo(this.x - this.layoutRadius * Math.cos(vertAngle * i + this.angle), this.y - this.layoutRadius * Math.sin(vertAngle * i + this.angle));
            }
            ctx.fillStyle = "rgb(180,180,180,0.03)";
            ctx.strokeStyle = '#b4b4b4'
            ctx.closePath();
            ctx.stroke()
            ctx.fill()

        }
    }


    window.addEventListener('keyup', (e) => {
            if (e.code === 'Enter') {
                bullets.push(new Bullet(spaceship.angle))
            }
        }
    )

    highScore = localStorage.getItem('highScore') || 0
    let spaceship = new Ship()
    let gun = new Bullet()
    let pTime = 0
    requestAnimationFrame(animation)

    function animation(timestamp) {
        if (+highScore < +score) {
            highScore = score
            localStorage.setItem('highScore', score.toString())
        }
        if (asteroids.length === 0) {
            for (let i = 0; i < 8; i++) {
                asteroids.push(new Asteroid());
            }
        }
        const diff = timestamp - pTime
        pTime = timestamp
        const fps = (1000 / diff) ^ 0
        const secondPart = diff / 1000
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'white'
        ctx.textAlign = 'left'
        ctx.font = '20px Georgia'
        ctx.fillText(`FPS: ${fps}`, canvas.width * 0.9, canvas.height * 0.1)
        ctx.fillText(`High score: ${highScore}`, canvas.width * 0.1, canvas.height * 0.1 - 20)
        ctx.fillText(`score: ${score}`, canvas.width * 0.1, canvas.height * 0.1)
        ctx.fillText(`lives: ${lives}`, canvas.width * 0.1, canvas.height * 0.1 + 20)

        if (asteroids.length !== 0) {
            for (let i = 0; i < asteroids.length; i++) {
                if (CircleCollision(spaceship, asteroids[i])
                ) {
                    if (helper) {
                        lives -= 1
                        helper = false
                    }
                    spaceship.visible = false
                    gun.visible = false
                    setTimeout(() => {
                        helper = true
                        gun.visible = true
                        spaceship.visible = true
                        spaceship.x = canvas.width / 2
                        spaceship.y = canvas.height / 2
                        spaceship.accX = 0
                        spaceship.accY = 0
                    }, 1000)

                }
            }
        }
        if (asteroids.length !== 0 && bullets.length !== 0) {
            loop:
                for (let i = 0; i < asteroids.length; i++) {
                    for (let j = 0; j < bullets.length; j++) {
                        if (CircleCollision(asteroids[i], bullets[j])) {
                            if (asteroids[i].level === 1) {
                                asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5, asteroids[i].radius / 2, 2, asteroids[i].layoutRadius / 2))
                                score += 10
                                asteroids.push(new Asteroid(asteroids[i].x + 5, asteroids[i].y + 5, asteroids[i].radius / 2, 2, asteroids[i].layoutRadius / 2))
                            } else if (asteroids[i].level === 2) {
                                asteroids.push(new Asteroid(asteroids[i].x - 10, asteroids[i].y - 10, asteroids[i].radius / 2, 3, asteroids[i].layoutRadius / 2))
                                asteroids.push(new Asteroid(asteroids[i].x + 10, asteroids[i].y + 10, asteroids[i].radius / 2, 3, asteroids[i].layoutRadius / 2))
                                score += 20
                            } else if (asteroids[i].level === 3) {
                                score += 30
                            }
                            asteroids.splice(i, 1);
                            bullets.splice(j, 1);
                            break loop
                        }
                    }
                }
        }
        if (lives <= 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            asteroids.length = 0
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.font = '200px Georgia'
            ctx.fillText(`Game over`, canvas.width / 2, canvas.height / 2)
            ctx.font = '70px Georgia'
            ctx.fillText(`press space to restart`, canvas.width / 2, canvas.height / 2 + 200)
            ctx.font = '30px Georgia'
            ctx.fillText(`Your score ${score}`, canvas.width / 2, canvas.height / 2 + 270)
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    score = 0
                    lives = 5
                }
            })
        } else {
            if (spaceship.visible) {
                spaceship.update(secondPart)
                spaceship.render()
            }
            if (bullets.length !== 0) {
                for (let i = 0; i < bullets.length; i++) {
                    bullets[i].update(spaceship.angle)
                    bullets[i].render()
                }
            }
            if (asteroids.length !== 0) {
                for (let j = 0; j < asteroids.length; j++) {
                    asteroids[j].update();
                    asteroids[j].render(j);
                }
            }
        }

        requestAnimationFrame(animation)

// '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();
    }

}
