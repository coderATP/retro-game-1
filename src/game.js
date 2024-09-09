
class Game{
    constructor(canvas){
        this.canvas= canvas;
        this.width = this.canvas.width;
        this.height= this.canvas.height;
        this.score = 0;
        this.gameOver = false;
        this.bulletsFired = 0;
        this.shotsAccuracy = 0;
        //player Instance
        this.player = new Player(this);
        
        //create keys pool
        this.keys = [];
        this.attackKeys = [];
        //directional buttons
        const directionalButtons = document.getElementsByClassName('directionalButton');
        for (let i=0; i< directionalButtons.length; ++i){
            const btn = directionalButtons[i];
            
            btn.addEventListener('touchstart', (e)=>{
                const key = e.target.value
                this.keys.indexOf(key) ==-1 && this.keys.push(key);
            })
            btn.addEventListener('touchend', (e)=>{
                const key = e.target.value
                this.keys.indexOf(key) > -1 && this.keys.splice(key, 1);
            })
        }
        //attack buttons
        const attackButtons = document.getElementsByClassName('attackBtn');
        for (let i=0; i< attackButtons.length; ++i){
            const btn = attackButtons[i];
            
            btn.addEventListener('touchstart', (e)=>{
                const key = e.target.value;
                if(this.attackKeys.indexOf(key) == -1) this.attackKeys.push(key);
                
                if( key==='attack1') this.player.shoot();
                if ( key==='attack2' && this.gameOver ) this.restart();
            })
            btn.addEventListener('touchend', (e)=>{
                const key = e.target.value;
                if(this.attackKeys.indexOf(key) > -1) this.attackKeys.splice(key, 1);
            })
            
        } 
        
        //projectiles Instance 
        this.projectilesPool = [];
        this.numberOfProjectiles = 10;
        this.createProjectilesPool();
        
        //Enemy projectiles Instance 
        this.enemyProjectilesPool = [];
        this.numberOfEnemyProjectiles = 10;
        this.createEnemyProjectilesPool();
    
        //Enemy wave
        this.waves=[];
        this.columns = 1;
        this.rows = 1;
        this.enemiesLeft = this.rows * this.columns;
        this.enemySize = 80;
        this.waves.push(new Wave(this));
        this.waveCount = 1;
        
        //Enemy boss
        this.bossArray = [];
        this.bossLives = 10;
        this.bossArray.push(new Boss(this));
        //animation frames
        this.spriteUpdate = false;
        this.timer = 0;
        this.spriteUpdateInterval = 180;
        
        //audio
        let sounds = [new Audio('./sounds/background.mp3'), new Audio('./sounds/bomb.mp3'), new Audio('./sounds/bonus.mp3'), new Audio('./sounds/gameOver.mp3'), new Audio('./sounds/shoot.wav')];
        sounds.forEach(sound=>{sound.volume = 0.1})
        this.backgroundMusic = sounds[0];
        this.bombSound = sounds[1];
        this.bonusLife = sounds[2];
        this.gameOverSound = sounds[3];
        this.shootSound = sounds[4];
        
        this.restart();
    }
    
    render(ctx, deltaTime){
        //update fps 
        if(this.timer >= this.spriteUpdateInterval){
            this.spriteUpdate = true;
            this.timer = 0;
        }
        else{
            this.timer+= deltaTime;
            this.spriteUpdate = false;
        }
        
        //player
        this.player.draw(ctx);
        this.player.update();
        
        //projectilesPool
        this.projectilesPool.forEach(projectile=>{
            projectile.draw(ctx);
            projectile.update();
        })
        
        //Enemy projectilesPool
        this.enemyProjectilesPool.forEach(enemyProjectile=>{
            enemyProjectile.draw(ctx);
            enemyProjectile.update();
        })
        
        //waves of enemies
        this.waves.forEach(wave=>{
            wave.update();
            wave.draw(ctx);
            //trigger next wave
            if(wave.enemies.length < 1 &&  !wave.nextWaveTriggered && !this.gameOver){
                this.newWave();
                wave.nextWaveTriggered = true;
                //increase lives if less than 7
                if(this.player.lives < this.player.maxLives){
                    this.player.lives++;
                    this.bonusLife.play();
                } 
            }
        })
        this.waves = this.waves.filter(wave=> !wave.markedForDeletion);
        //boss
        this.bossArray.forEach(boss=>{
            boss.draw(ctx);
            boss.update();
            if(boss.lives < 1 &&  !boss.nextBossTriggered && !this.gameOver){
                this.newWave();
                if(this.player.lives < this.player.maxLives){
                    this.player.lives++;
                    this.bonusLife.play();
                }
                boss.nextBossTriggered = true;
            } 
 
        })
        
        
    }
    createProjectilesPool(){
        for(let i=0; i<this.numberOfProjectiles; ++i){
            this.projectilesPool.push(new Projectile());
        }
    }
    getOneFreeProjectile(){
        for(let i=0; i<this.projectilesPool.length; ++i){
            if(this.projectilesPool[i].free) return this.projectilesPool[i];
        }
    }
    
    createEnemyProjectilesPool(){
        for(let i=0; i<this.numberOfEnemyProjectiles; ++i){
            this.enemyProjectilesPool.push(new EnemyProjectile(this) );
        }
    }
    getOneFreeEnemyProjectile(){
        for(let i=0; i<this.enemyProjectilesPool.length; ++i){
            if(this.enemyProjectilesPool[i].free) return this.enemyProjectilesPool[i];
        }
    }
    rectangularCollision(a, b){
        return(
            a.x + a.width >= b.x &&
            a.x <= b.x + b.width &&
            a.y + a.height >= b.y &&
            a.y <= b.y + b.height
            )
    }
    newWave(){
        this.waveCount++;
        //spawn boss after every 3rd wave
        if(this.waveCount % 4 == 0)  {
            this.bossLives+= 10;
            this.enemiesLeft = 1;
            this.bossArray.push(new Boss(this));
        }
        //spawn boss 50% of the times
        else{
           //increase columns or rows on a 50/50 chance
            if(Math.random() < 0.5 && this.columns * this.enemySize < this.width* 0.8) this.columns++;
            else if(Math.random() >= 0.5 && this.rows * this.enemySize < this.height* 0.6) this.rows++;
            //push a new wave
            this.enemiesLeft = this.rows* this.columns;
            this.waves.push(new Wave(this));
         }
    }
    
    drawLives(ctx){
        ctx.fillStyle= 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        const width = 10, height= 25;
        const marginLeft = 10; // margin to the left of game area from where life bar will be drawn
        const padding = 20; //spacing between life bars
        for(let i=0; i<this.player.maxLives; ++i){
            const x = (width + padding) * i + marginLeft;
            ctx.strokeRect(x, 100, width, height);
        }
        for (let i = 0; i < this.player.lives; ++i) {
            const x = (i * (width + padding) ) + marginLeft;
            ctx.fillRect(x, 100, width, height);
        }
    }
    drawStatusText(ctx, timestamp){
        ctx.save();
  
        ctx.font= "20px Serif";
        //current wave
        ctx.fillText("Wave: "+ this.waveCount, this.width - 100, 20);
        //enemies remaining
        ctx.fillText("Enemies: "+ this.enemiesLeft, this.width - 120, 40);
        //bullets fired
        ctx.fillText("Shots: "+this.bulletsFired, 10, 20);
        //score
        ctx.fillText("Score: "+this.score, 10, 40);
        //accuracy
        this.shotsAccuracy = Math.round(this.score/this.bulletsFired*100 || 0);
        ctx.fillText("Accuracy: "+this.shotsAccuracy+'%', 10, 60);
        //time expended in game
        timestamp = Math.floor(timestamp/1000);
        ctx.fillText("Time: "+ timestamp+' s', 10, 80);
        //lives
        this.drawLives(ctx);

        //energy
        for(let i= 0; i< this.player.energy; ++i){
            
            const width= 2;
            const height = 20;
            const padding = 0;
            const marginLeft = 10;
            const x = (i * (width + padding) ) + marginLeft;
            ctx.save();
            this.player.cooldown ? ctx.fillStyle = 'red' : ctx.fillStyle = 'gold';
            ctx.fillRect(x, 150, width, height);
            ctx.restore();
        }
       //Game over text
        if(this.gameOver){
            ctx.textAlign = 'center';
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = 'green'
            ctx.font = '60px Impact';
            ctx.fillText("GAME OVER!", this.width * 0.5, this.height * 0.5);
            ctx.font = '20px Arial'
            ctx.fillText("Press B to restart!", this.width * 0.5, this.height * 0.5 +20);
        }
        ctx.restore();
    }
    
    restart(){
        this.player.restart();
        this.waves=[];
        this.bossArray = [];
        this.columns= 1;
        this.rows = 1;
        this.bossLives = 0;
        this.enemiesLeft = this.rows * this.columns;
        this.waves.push(new Wave(this));
        this.waveCount = 1;
        this.gameOver = false;
        this.score = 0;
        this.bulletsFired = 0;
        this.shotsAccuracy = 0;
    }
}

