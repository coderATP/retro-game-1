class Enemy{
    constructor(game, x, y){
        this.game = game;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.x = x;
        this.y = y;
        this.markedForDeletion = false;
    }
    draw(ctx){
        ctx.lineWidth = 6;
        ctx.strokeStyle= 'yellow';
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frameX *this.width, this.frameY *this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font= '20px Serif';
        const enemyCentre = [this.x+this.width*0.5, this.y+this.height* 0.5]
        ctx.fillText(this.lives, ...enemyCentre);
        ctx.restore();
    }
    update(speedX, speedY){
        this.x += speedX;
        this.y += speedY;
        
        //check for collision
        this.checkForCollision();
    }
    checkForCollision(){
        //between enemy and projectile
        this.game.projectilesPool.forEach(projectile=>{
            if(!projectile.free &&
            this.game.rectangularCollision(this, projectile) &&
            this.lives > 0){
                this.hit(1);
                projectile.reset();
           }
        })
        if(this.lives < 1){
            //animation plays for when enemy is about to die
            this.animateDeathState();
            if(this.frameX > this.frames)
            {
                this.game.bombSound.play();
                this.markedForDeletion = true;
                this.game.enemiesLeft--;
                this.game.score+= this.maxLives;
            } 
        }
               
        //between enemy and player
        //or between wallBottom and player
        if (!this.markedForDeletion &&
            (this.game.rectangularCollision(this, this.game.player) ||
             this.y >= this.game.height) )
        {
             this.game.player.lives--;
             this.markedForDeletion = true;
             this.game.enemiesLeft--;
             if (this.game.player.lives < 0){
                this.game.gameOver = true;
                this.game.gameOverSound.play();
             } 
        }
    }
    hit(damage){
        this.lives -= damage;
        if(this.lives > 0) this.frameX = Math.floor(this.maxLives - this.lives);
    }
    animateDeathState(){
        if(this.game.spriteUpdate) this.frameX++;
    } 
}

class Beetlemorph extends Enemy{
    constructor(game, x, y){
        super(game, x, y);
        this.image = document.getElementById('beetlemorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*4);
        this.lives = 1;
        this.maxLives = this.lives;
        this.frames = 3;
    }
    
}

class Rhinomorph extends Enemy{
    constructor(game, x, y){
        super(game, x, y);
        this.image = document.getElementById('rhinomorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*4);
        this.lives = 3;
        this.maxLives = this.lives;
        this.frames = 6;
    }
    
}

class Squidmorph extends Enemy{
    constructor(game, x, y){
        super(game, x, y);
        this.image = document.getElementById('squidmorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*4);
        this.lives = 11;
        this.maxLives = this.lives;
        this.frames = 17;
    }
    
}

class Lobstermorph extends Enemy{
    constructor(game, x, y){
        super(game, x, y);
        this.image = document.getElementById('lobstermorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*4);
        this.lives = 8;
        this.maxLives = this.lives;
        this.frames = 14;
    }
    
}

class Eaglemorph extends Enemy{
    constructor(game, x, y){
        super(game, x, y);
        this.image = document.getElementById('eaglemorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()*4);
        this.lives = 4;
        this.maxLives = this.lives;
        this.frames = 9;
    }
    
    hit(damage){
        this.shoot();
        this.lives -= damage;
        if(this.lives > 0) this.frameX = Math.floor(this.maxLives - this.lives);
    }
    shoot(){
        //Enemy reacts to being hit: shoots back
        const bullet = this.game.getOneFreeEnemyProjectile();
        const eagleCentre = [this.x + this.width* 0.5, this.y+this.height]
        if(bullet)  bullet.start(...eagleCentre);
    }
    
}


class Boss{
    constructor(game){
        this.game = game;
        this.width = 200;
        this.height = 200;
        this.x = this.game.width*0.5 - this.width*0.5;
        this.y = -this.height;
        this.speedX = Math.random() < 0.5 ? -1 : 1;
        this.speedY = 0;
        this.lives = this.game.bossLives;
        this.maxLives = this.lives;
        this.image= document.getElementById('boss8');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 8);
        this.frames = 11;
        this.markedForDeletion = false;
        this.nextBossTriggered = false;
    }
    draw(ctx){
        ctx.drawImage(this.image, this.frameX *this.width, this.frameY *this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font= '30px fantasy';
        const bossCentre = [this.x+this.width*0.5, this.y+20]
        ctx.fillText(this.lives, ...bossCentre);
        ctx.restore();
    }
    
    update(){
        
       this.animateHitState();
        this.speedY = 0;
        if(this.y < 0){
            this.y+=3;
        }
        if(this.x < 0 || this.x > this.game.width - this.width){
            this.speedX *= -1;
            this.speedY = this.height*0.5;
        }
        this.x+= this.speedX;
        this.y+= this.speedY;
        //boss collision with projectile
        this.game.projectilesPool.forEach(projectile=>{
            if(this.lives > 0 &&
               ! projectile.free &&
               this.game.rectangularCollision(projectile, this)){
                   this.hit(1);
                   projectile.reset();
               }
        })
        if(this.lives < 1){
             this.frameX++;
             if(this.frameX > this.frames){
                 this.markedForDeletion = true;
                 if(this.markedForDeletion) this.game.score+=this.maxLives;
             } 
        }
        //boss collision with wall bottom or player
        if(!this.gameOver &&
        (this.y + this.height >= this.game.height ||
        this.game.rectangularCollision(this, this.game.player)) ){
            this.game.gameOver = true;
            this.game.gameOverSound.play();
        }
                   
        this.game.bossArray = this.game.bossArray.filter(boss=> !boss.markedForDeletion);
    }
    hit(damage){
        this.lives -=damage;
        if(this.lives > 0)this.frameX = 1;
    }
    animateHitState(){
        if(this.game.spriteUpdate && this.lives > 0){
            this.frameX = 0;
        }
    }
}