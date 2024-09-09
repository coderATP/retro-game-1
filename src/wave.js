class Wave{
    constructor(game){
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = 0;
        this.speedX= Math.random() < 0.5 ? -0.5 : 0.5;
        this.speedY= 0;
        this.nextWaveTriggered = false;
        this.markedForDeletion = false;
        
        //enemies grid
        this.enemies = [];
        for(let y =0; y <this.game.rows; ++y){
            for(let x =0; x <this.game.columns; ++x){
                //set each enemy's location in grid
                const xPos = x * this.game.enemySize + this.x;
                const yPos = y * this.game.enemySize + this.y;
                let randomNumber = Math.random();
                
                if(randomNumber < 0.2) this.enemies.push(new Eaglemorph(this.game, xPos, yPos));
                else if(randomNumber < 0.4) this.enemies.push(new Lobstermorph(this.game, xPos, yPos))
                else if(randomNumber < 0.6) this.enemies.push(new Squidmorph(this.game, xPos, yPos))
                else if(randomNumber < 0.8) this.enemies.push(new Rhinomorph(this.game, xPos, yPos))
                else this.enemies.push(new Beetlemorph(this.game, xPos, yPos));
            }
        } 
    }
    draw(ctx){
        //draw wave
        ctx.lineWidth = 8;
        ctx.strokeStyle = "cyan";
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        //enemies grid (nested in each wave)
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        })
        
    }
    update(){
        this.speedY = 0;
        //wave
        if(this.y < 0){
            this.y+= 3;
        }
        if(this.x < 0 || this.x+this.width > this.game.width){
            this.speedX *= -1;
            this.speedY = this.game.enemySize;
        }
        
        this.x+= this.speedX;
        this.y+= this.speedY;

        //enemies grid (nested in each wave)
        this.enemies.forEach(enemy => {
            enemy.update(this.speedX, this.speedY);
        })
        //filter enemy array following markedForDeletion
        this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
        if(this.enemies.length < 1) this.markedForDeletion = true;
    }
} 