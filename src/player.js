class Player{
    constructor(game){
        this.game = game;
        this.width = 140;
        this.height = 120;
        this.x = this.game.width*0.5 - this.width*0.5;
        this.y = this.game.height - this.height;
        this.speedX = 0;
        this.lives = 3;
        this.maxLives = 7;
        this.image= document.getElementById('player');
        this.player_jets = document.getElementById('player_jets');
        this.frameX = 0;
        this.laser1 = new SmallLaser(this.game);
        this.laser2 = new BigLaser(this.game);
        this.energy = 50;
        this.maxEnergy = 100;
        this.cooldown = false;
    }
    draw(ctx){
        if(this.game.keys.indexOf('ArrowRight') > -1){
            this.frameX = 1;
        }
        else if(this.game.keys.indexOf('ArrowLeft') > -1){
            this.frameX = 0;
        }
        
        if(this.game.attackKeys.indexOf('attack3') > -1){
            this.frameX = 2;
            this.laser1.draw(ctx);
            this.laser1.update();

        }
        else if(this.game.attackKeys.indexOf('attack4') > -1){
            this.frameX = 3;
            this.laser2.draw(ctx);
            this.laser2.update();
 
        }
        else this.frameX = 1;
        
       // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.player_jets, this.frameX *this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.frameX *this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update() {
        //energy
        if(this.energy < this.maxEnergy){
            this.energy+= 0.1;
        }
        //energy cannot go below 1
        if(this.energy < 1){
            this.energy = 1;
        }
        
        //cool down conditions
        if(this.energy >= this.maxEnergy * 0.2) this.cooldown = false;
        else this.cooldown = true;
        this.speedX = 0;
        this.game.keys.forEach(key=>{
            if(key=='ArrowLeft'){  this.speedX = -5; } 
            else if(key=='ArrowRight'){ this.speedX = 5; } 
        })
        
        if(this.x <= -this.width*0.5) this.x = -this.width*0.5;
        else if(this.x + this.width*0.5 >= this.game.width) this.x = this.game.width - this.width*0.5;
        
        this.x+= this.speedX;
        

    }
    shoot(){
        const bullet = this.game.getOneFreeProjectile();
        const playerMidPoint = [this.x+ this.width*0.5, this.y]
        if(bullet){
        bullet.start(...playerMidPoint);
        this.game.bulletsFired++;
        this.game.shootSound.play();
        }
    }
    restart(){
        this.x = this.game.width*0.5 - this.width*0.5;
        this.y = this.game.height - this.height;
        this.lives = 3;
    }
}
 