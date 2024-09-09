//sjshwgwgaggagahahhaavavvahahagshwurjjrjfdhehhegsgwvwgwgvevehehejejejskehveveveeghhdgdggdvsgdhhehegvevshhshehehgevevvevevevvevevev

class Laser{
    constructor(game){
        this.game = game;
        this.height = this.game.height - 60;
        this.x = 0;
        this.y = 0;
        this.fired = false;
    }
    draw(ctx){
        if(this.game.player.cooldown) return;
        ctx.save();
        ctx.fillStyle = 'gold';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle= 'white'
        ctx.fillRect(this.x + this.width*0.2, this.y, this.width*0.6, this.height);
        ctx.restore();
    }
    update(){
        //detect collision
        
        //a. with waves of enemies
        if(this.game.player.cooldown) return;
    if(this.game.spriteUpdate){
        this.game.waves.forEach(wave=>{
            wave.enemies.forEach(enemy=>{
                if(this.game.rectangularCollision(enemy, this) &&
                    enemy.lives >= 1){
                        this.game.player.energy -= 2;
                        enemy.hit(this.damage);
                        enemy.lives = Math.floor(enemy.lives);
                }
            })
        })
        
        //b. with enemy projectiles
        this.game.enemyProjectilesPool.forEach(enemyProjectile=>{
            if(this.game.rectangularCollision(this, enemyProjectile)){
                enemyProjectile.hit(this.damage * 4);
                this.game.player.energy -= 1;
                if(enemyProjectile.lives < 1) enemyProjectile.reset();
            }
        })
        
        //c. with boss
        this.game.bossArray.forEach(boss=>{
            if(this.game.rectangularCollision(boss, this) &&
                boss.lives >=1 &&
                boss.y >= 0){
                    boss.hit(this.damage);
                    this.game.player.energy -= 10*this.damage;
                    boss.lives = Math.floor (boss.lives)
            }
        })
    }
        
    }
}

class SmallLaser extends Laser{
    constructor(game){
        super(game);
        this.width = 5;
        this.damage = 0.5;
    }
    draw(ctx){
        this.x = this.game.player.x + this.game.player.width*0.5 -this.width * 0.5;
        super.draw(ctx);
    }
}

class BigLaser extends Laser{
    constructor(game){
        super(game);
        this.width = 25;
        this.damage = 1.5;
    }
    draw(ctx){
        this.x = this.game.player.x + this.game.player.width*0.5 - this.width * 0.5;
        super.draw(ctx);
    }
}