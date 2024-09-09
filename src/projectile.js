class Projectile{
    constructor(){
        this.width = 3;
        this.height = 30;
        this.x = 0;
        this.y = 0;
        this.speedY = -25;
        this.free = true;
    }
    draw(ctx){
        if(!this.free) {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.fillStyle = 'gold';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        } 
    }
    update(){
        if(!this.free){ this.y+= this.speedY; }
        if(this.y <=0) this.reset();
    }
    start(x, y){
        this.x = x - this.width*0.5;
        this.y = y - this.height;
        this.free = false;
    }
    reset(){
        this.free = true;
    }
}


class EnemyProjectile{
    constructor(game){
        this.game = game;
        this.width = 50;
        this.height = 35;
        this.x = 0;
        this.y = 0;
        this.speedY = 3;
        this.free = true;
        this.image = document.getElementById('enemyProjectile');
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 2);
        this.lives = 4;
        this.maxLives = this.lives;
    }
    draw(ctx){
        if(!this.free) {
            ctx.save();
            //ctx.lineWidth = 1;
            //ctx.fillStyle = 'white';
            //ctx.strokeRect(this.x, this.y, this.width, this.height);
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.frameX *this.width, this.frameY *this.height, this.width, this.height, this.x, this.y, this.width, this.height)
            ctx.restore();
        } 
    }
    update(){
        if(!this.free){ this.y+= this.speedY; }
        if(this.y > this.game.height - this.height) this.reset();
        
        //slow down enemy projectiles upon collision
        this.game.projectilesPool.forEach(projectile=>{
            if(!projectile.free && this.game.rectangularCollision(projectile, this)){
                projectile.reset();
                this.hit(1);
                this.speedY *= 0.6;
            }
        })
        if(!this.free && this.game.rectangularCollision(this, this.game.player)){
            this.reset();
            this.game.player.lives--;
            if(this.game.player.lives < 1) this.game.gameOver = true;
        }
    }
    start(x, y){
        this.x = x - this.width*0.5;
        this.y = y - this.height;
        this.free = false;
    }
    hit(damage){
        this.lives -= damage;
        if(this.lives <1){
            this.reset();
            this.x = 0;
            this.y = 0;
            this.speedY = 3;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 2);
        } 
    }
    reset(){
        this.free = true;
    }
}
