window.onload = () =>{
const gameBoard = document.querySelector('#gameBoard');
const context = gameBoard.getContext('2d');
const statusTracker = document.querySelector('#statusTracker');

gameBoard.width = 800;
gameBoard.height = 562;

width = gameBoard.width;
height = gameBoard.height;

let interval = 100;
let frame = interval / 100;


// arrays....
let enemyFleet = [];
let mag = [];
let enemyMag =[];

//---------------------------------------------------ENEMY BULLET------------------------------------------------------------
class EnemyBullet{
    constructor(x, y){
        this.xVelocity = 40;
        this.x = x;
        this.y = y;
        this.radius = 10;
    }
    drawBullet(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'orange';
        context.fill();
        context.stroke();
        }

    updateBullet(player){
        this.x -= this.xVelocity;
        }
}

//-----------------------------------------------------------------TANK-----------------------------------------------
class BadGuy{
    constructor(boardWidth, boardHeight){
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.firstSpriteXPosition = 0;
        this.spritePositionY = 205;
        this.spritePositionWidth = 132;
        this.spriteExplosionWidth = 115;
        this.maxSpriteWidth = this.spritePositionWidth * 7;
        this.midRoad = 30;
        this.statusTracker = 0;

        this.width = 135;
        this.height = 120;
        this.image = document.querySelector('#tank');
        this.x = gameBoard.width;
        this.y = randomRange(gameBoard.height - this.height, gameBoard.height - this.height - 100);
        this.velocity = -10;
        this.hits = []


        // randomRange(this.boardHeight - this.height, this.boardHeight - this.height - this.midRoad - this.midRoad);
    }
    drawTank(){
        context.drawImage(this.image, this.firstSpriteXPosition, this.spritePositionY, this.spritePositionWidth, this.height, this.x, this.y, this.width, this.height);
    }
    updateTank(mag){            //pass 'player' bullet array for collision detection with tank
        this.x += this.velocity

        mag.forEach(bullet=>{
            //// If Collision between bullet and tank
            if (this.x < bullet.x + bullet.width &&
                this.x + this.width > bullet.x &&  
                this.y < bullet.y + bullet.height &&
                this.y + this.height > bullet.y) {

                    //Remove Bullet After Impact
                    bullet.markedForDeletion = true;
                    
                    //change animation frames of tank
                //     this.spritePositionY = 1200;
                //      this.height = 75;
                //     this.width = 115

                // if(this.firstSpriteXPosition >= 900){
                //     this.firstSpriteXPosition = 115;
                //     }else{this.firstSpriteXPosition += 115}
            }
        }) 
        //////Animate tank 
        if(this.firstSpriteXPosition >= this.spritePositionWidth * 7){
            this.firstSpriteXPosition = 0
        }else(this.firstSpriteXPosition += 132)
        ///remove tank when it gets off of screen
        if(this.x < -1000){
           this.markedForDeletion = true;
        }
    }
    ////Tank shoots back
    shoot(enemyMag){
        enemyMag.push(new EnemyBullet(this.x + 37 , this.y + this.height/2 - 20)); //push bullet into mag array when called.
    }
    
}

////------------------------------------------------------------BACKGROUND------------------------------------------------------
class Background{
    constructor(boardWidth, boardHeight){
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.image = document.querySelector('#background');
        this.width = 2280;
        this.height = 562;
        this.x = 0;
        this.y = 0;
        this.scroll = 2;
    }
    //backGround Image
    drawBackGround(){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    //background movement
    backGroundScroll(player){
        this.x -= this.scroll;
        if(this.x > -1480 && !player.playerHit){ //check if player was hit and if background is within  range
            this.x -=this.scroll;
        }else { 
            this.scroll = 0;
            if(this.scroll === 0 && !player.playerHit){ //if background is at the end, and player not hit show win message
                // statusTracker.style.display = 'block'
                statusTracker.innerHTML = 'YOU MADE IT TO THE END!';
            }
        }
    }
}
///-----------------------------------------------------PLAYER BULLET--------------------------------------------------------------
class Bullet{
    constructor(x, y, velocityX, velocityY){
        this.image = document.querySelector('#bullet');
        this. bulletStartPosition = 0;
        this.bulletYposition = 0;
        this.width = 10;
        this.height = 10;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.x = x;
        this.y = y;
    }
    drawBullet(){
        context.drawImage(this.image, this.bulletStartPosition, this.bulletYposition, 10, 10, this.x, this.y, this.width, this.height)
    } 
    updateBullet(enemyFleet){
            this.x += this.velocityX
            //if bullet goes beyond border mark to be deleted
            if(this.x > gameBoard.width){
                this.markedForDeletion = true
                // console.log(mag)
            }
            //if bullet collides with tank, mark tank to be deleted.
            enemyFleet.forEach(tank=>{
               if(this.x < tank.x + tank.width &&
                this.x + this.width > tank.x &&  
                this.y < tank.y + tank.height &&
                this.y + this.height > tank.y){
                    //keep track of hits each tank recieves
                    tank.hits.push(1)
                    //if hits exceed 11 destroy tank
                    if(tank.hits.length > 11){ tank.markedForDeletion = true }
                }
            });
        } 
    }

////////------------------------------------------------------------PLAYER-------------------------------------------------///////////
class Player{
    constructor(boardWidth, boardHeight){
        this.boardWidth = boardWidth; //canvas width
        this.boardHeight = boardHeight; //canvas height
        this.image = document.querySelector('#playerBackGroundImage');
        this.firstSpriteXPosition = 0;
        this.spritePositionWidth = 181; //width on sprite sheet
        this.runFrameX = 181;
        this.maxRun = 181 * 9; //Run Frames
        this.spritePositionY = 220; //begining y position on sprite sheet.
        this.deathPositionY = 2263;
        // this.lose = [0, 188, 172, 170, 165, 166, 169, 166, 162, 161, 165, 166, 164] //0, 188, 360, 530, 695, 861, 1030, 1196, 1358, 1519, 1684, 1850, 2014
        // this.reduce = this.lose.reduce((acc, num) => acc + num);
        this.velocityX = 8;
        this.velocityY = 8;
        this.velocityXback = 14;
        this.buffer = 5;
        this.width = 182;
        this.height = 110;
        this.x = 0;
        this.y = this.boardHeight - this.height - this.buffer;
        this.playerHit = false;
        this.running = true;
        this.youLose = false;
        this.walkingBack = false;
        this.walkingUp = false;
        this.walkingDown = false;
    }
    drawPlayer(){
        //Hit Area Circle will now update with player location
        this.hitAreaX = this.x + this.width/2 - 20;
        this.hitAreaY = this.y + this.height/2 - 10;
        this.hitAreaRadius = this.height/3;

                           //source             sourceX                  sourceY                sourceW             sourceH                       
        context.drawImage(this.image, this.firstSpriteXPosition, this.spritePositionY, this.spritePositionWidth, this.height, this.x, this.y, this.width, this.height);
        
        ///player circular collision area
        context.beginPath();
        context.arc(this.x + this.width/2 - 20, this.y + this.height/2 - 10, this.height/3, 0, 2 * Math.PI)
        context.stroke();

    }
    upDatePlayer(controller, enemyMag, background){

        //check distance between enemy bullet and player
        enemyMag.forEach(bullet => {
            
            //Handle collision between 'player' and 'enemy bullet'
            const distance = getDistance(this.hitAreaX, bullet.x, this.hitAreaY, bullet.y)
            if(distance < this.hitAreaRadius + bullet.radius){
                bullet.markedForDeletion = true;  //mark enemy bullet for deletion after impact
                this.playerHit = true; //set player hit to true
            }
        });
        //set timeout for 'lose scene' after player is hit
        if(this.playerHit){
            this.youLose = true;
            let timer = setTimeout(() => {
                this.running = false;
                this.firstSpriteXPosition = 1850; //death scene
                this.firstSpriteXPosition = 1850? this.firstSpriteXPosition = 1850: this.firstSpriteXPosition = 1850;
                this.spritePositionY = 2263;
                clearTimeout(timer)
            }, 100);
        }
        //set timeout after loss
        if(this.youLose){
            let timer = setTimeout(() => {
                statusTracker.innerHTML = 'YOU LOSE!' //if status is 'YOU LOSE' game loop stops
                context.fillStyle = 'red';
                context.font = 'bold 60px Comic Sans MS'
                context.fillText('YOU LOSE', width/2 - 100, height/2)
                context.strokeText('YOU LOSE', width/2 - 100, height/2)
                clearTimeout(timer)
            }, 3000);
        }
   
        else if(controller.input.indexOf('ArrowRight') > -1 && this.x + this.width + this.buffer < this.boardWidth && !this.playerHit){
           this.running = true;
            this.x += this.velocityX;
            this.spritePositionY = 220;
         if(this.firstSpriteXPosition >= this.maxRun){
             this.firstSpriteXPosition = 0;
         }else{ this.firstSpriteXPosition += this.runFrameX}
        }
        else if(controller.input.indexOf('ArrowLeft') > -1 && this.x > 0 && !this.playerHit){
            this.walkingBack = true;
            this.x -= this.velocityXback;
            this.spritePositionY = 433;
            if(this.firstSpriteXPosition >= this.runFrameX * 4){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}   
            }
        else if(this.x < 0){
            this.x = 0;
        }
        else if(controller.input.indexOf('ArrowUp') > -1 && this.y > this.boardHeight * .60 && !this.playerHit){
            this.walkingUp = true;
            this.y -= this.velocityY; 
            this.spritePositionY = 220;
            if(this.firstSpriteXPosition >= this.maxRun){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}        
        } 
        else if(controller.input.indexOf('ArrowDown') > -1 && this.y + this.height < this.boardHeight && !this.playerHit){
            this.walkingDown = true;
            this.y += this.velocityY; 
            this.spritePositionY = 220;
            if(this.firstSpriteXPosition >= this.maxRun){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}        
        } 

        if(this.x + this.width + this.buffer > gameBoard.width ){
            this.x = this.boardWidth - this.width;
        } 

        // if(this.running){
        //  //default run state.....
        // if(this.firstSpriteXPosition >= this.maxRun){
        //     this.firstSpriteXPosition = 0;
        // }else{ this.firstSpriteXPosition += this.runFrameX}
        // } 

    }
    
}

////-----------------------------------------------------------------------GAME CONTROLLER---------------------------------------
class Controller{
    constructor(){
        this.input = [];
        document.addEventListener('keydown', (e) =>{
            if((e.key === "ArrowDown" || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.input.indexOf(e.key) === -1){ 
                this.input.push(e.key)
            }
        })
        document.addEventListener('keyup', (e) =>{
            if(e.key === "ArrowDown" || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                this.input.splice(this.input.indexOf(e.key), 1)
            }
        });
    }
}

//random range generator
function randomRange(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function add(arr, position) {
    var accumulator = 0;
    for (var i = 0;i <= position; i++) {
         accumulator += arr[i];
    }
    return i;
}

//get distance between circular objects
function getDistance(x1, x2, y1, y2){
	const xcoordinate = x2 - x1;
	const ycoordinate = y2 - y1;
	return Math.sqrt(Math.pow(xcoordinate, 2) + Math.pow(ycoordinate, 2));
}

//Instantiate background, tank, controller, player;
const background = new Background(gameBoard.width,gameBoard.height);
const tank = new BadGuy();
const controller = new Controller();
const player = new Player(gameBoard.width, gameBoard.height); 

//Push bullets into 'mag' array
document.addEventListener('keydown',(e)=>{
    if(e.key === ' ' && !player.playerHit){
        let xShim = 43;
        let yShim = 40;
        mag.push(new Bullet(player.x + player.width - xShim, player.y + yShim, 40, 0))
    }
})

////-------------------------------------------------------------GAME LOOP-------------------------------------------------
function Game(){
setInterval(() => {
    let tankFiring = Math.floor(Math.random() * enemyFleet.length); //variable to select a random tank in the array

    frame++ //kept trak of framerate for purpose of timing events.

    if(statusTracker.innerHTML === 'YOU MADE IT TO THE END!' || statusTracker.innerHTML === 'YOU LOSE!'){
         //stop game if this condition is true
        return;
    }

    context.clearRect(0, 0, gameBoard.width, gameBoard.height); //clear screen after every frame

    background.drawBackGround(gameBoard.width, gameBoard.height);  //make background visible
    background.backGroundScroll(player) //update background position every frame

    // remove collision objects
    enemyFleet = enemyFleet.filter(tank=>!tank.markedForDeletion); //remove tanks market for deletion
    mag = mag.filter(bullet=> !bullet.markedForDeletion); // remove bullets market for deletion
    enemyMag = enemyMag.filter(bullet => !bullet.markedForDeletion);

    player.drawPlayer();  //make 'player' visible with every update
    player.upDatePlayer(controller, enemyMag) //pass controller argument so player can be controlled

    mag.forEach(bullet=> {
        bullet.updateBullet(enemyFleet) //pass fleet through bullet update for collision detection
        bullet.drawBullet() //render bullet
    });

    enemyMag.forEach(bullet=>{
        bullet.updateBullet(player);
        bullet.drawBullet();
        if(bullet.x < -50){ bullet.markedForDeletion = true } //if bullet goes of screen marke for deletion
        
    });

    enemyFleet.forEach(tank =>{
        tank.updateTank(mag); //pass mag through tank fleet for collision detection
        tank.drawTank();
    });

     //every 10 frames    if array is not 0       this random tank fires if its within view
    if(frame % 10 === 0 && enemyFleet.length > 0 && enemyFleet[tankFiring].x < gameBoard.width){  
        enemyFleet[tankFiring].shoot(enemyMag); //set random tanks to fire
    }
 
}, interval)

// push tanks into 'enemyFleet' array every 3 seconds
let timer = setInterval(() =>{
    enemyFleet.push(new BadGuy())
}, 4000);

}

//deploy game
Game();

console.log(context)

}