//nsjakehwhgzyzgegzoxonsbavagavagsjksksnnshallrleyuyshndnnsmsnsbzbnsbshalleleuyahnsnnsjsjsjshbssbsbhshshshgg#vssnsn#nnkskakskajsjn/jjjhgddvvvvvv

window.addEventListener('load', ()=>{
  
    const startDialogue = document.getElementById('startMessage');
    startDialogue.addEventListener('click', ()=>{
        startDialogue.style.display = 'none';
        const background_music = new Audio('../sounds/background.mp3');
        background_music.play();
        background_music.volume = 0.5;

        const canvas = document.getElementById('canvas');
        canvas.width = 500;
        canvas.height = 800;
        if(startDialogue.style.display=='grid') return;
        
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    
        const game = new Game(canvas);
   
       let animationID = 0;
       let timestart = 0, deltaTime = 0;
        function loop(timestamp){
            ctx.clearRect(0,0, canvas.width, canvas.height);
            deltaTime = timestamp - timestart;
            timestart = timestamp;

            animationID = requestAnimationFrame(loop);
            game.drawStatusText(ctx, timestamp);
            game.render(ctx, deltaTime);
        } 
            loop(0);
    
    })
    
})