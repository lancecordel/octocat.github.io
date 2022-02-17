const gameBoard = document.querySelector('#gameBoard');
const context = gameBoard.getContext('2d');
const score = document.querySelector('#score');


gameBoard.width = 800;
gameBoard.height = 562;

class tankBullet{
    constructor(x, y){
        this.velocityX = 50;
        this.x = x;
        this.y = y;
        this.radius = 40;
    }
    drawnCanonBall(){
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.x = BadGuy.width;
        this.y = BadGuy.height;
    }
    updateCanonball(){
        this.x += this.velocityX;
    }
}

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
        this.score = 0;

        this.width = 135;
        this.height = 120;
        this.image = document.querySelector('#tank');
        this.x = this.boardWidth + this.boardWidth/ 2;
        this.y = randomRange(this.boardHeight - this.height, this.boardHeight - this.height - this.midRoad - this.midRoad);;
        this.velocity = -10;

        // randomRange(this.boardHeight - this.height, this.boardHeight - this.height - this.midRoad - this.midRoad);
    }
    drawTank(){
        context.drawImage(this.image, this.firstSpriteXPosition, this.spritePositionY, this.spritePositionWidth, this.height, this.x, this.y, this.width, this.height);
    }
    updateTank(mag){
        this.x += this.velocity
        
        mag.forEach(bullet=>{
            if (this.x < bullet.x + bullet.width &&
                this.x + this.width > bullet.x &&  
                this.y < bullet.y + bullet.height &&
                this.y + this.height > bullet.y) {
                    this.spritePositionY = 1200;
                     this.height = 75;
                    this.width = 115
                if(this.firstSpriteXPosition >= 900){
                    this.firstSpriteXPosition = 115;
                    }else{this.firstSpriteXPosition += 115}
                   
                    
            }
        })  

        if(this.x < -2000){
           this.markedForDeletion = true;
            }
    }
    
}

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
    drawBackGround(){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    backGroundScroll(player){
        this.x -= this.scroll;
        if(this.x > -1480){
            this.x -=this.scroll;
            console.log(this.scroll)
        }else { 
            this.scroll = 0;
            if(this.scroll === 0){
                score.style.display = 'block'
                score.innerHTML = 'YOU MADE IT TO THE END!';
            }
        }
    }

}
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
    updateBullet(){
            this.x += this.velocityX
            if(this.x > gameBoard.width){
                this.markedForDeletion = true
                // console.log(mag)
            }
            
        }
    }

class Player{
    constructor(boardWidth, boardHeight){

        this.boardWidth = boardWidth; //canvas width
        this.boardHeight = boardHeight; //canvas height
        this.image = document.querySelector('#playerBackGroundImage');
        this.firstSpriteXPosition = 0;
        this.spritePositionWidth = 181; //width on sprite sheet
        this.runFrameX = 181;
        // this.jumpFrameX = 176;
        this.maxRun = 181 * 9; //Run Frames
        this.spritePositionY = 220; //begining y position on sprite sheet.
        this.velocityX = 8;
        this.velocityY = 8;
        // this.gravity = 5;
        this.buffer = 5;
        this.width = 182;
        this.height = 110;
        this.x = 0;
        this.y = this.boardHeight - this.height - this.buffer;

    }
    drawPlayer(){
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.firstSpriteXPosition, this.spritePositionY, this.spritePositionWidth, this.height, this.x, this.y, this.width, this.height);
        
    }
    upDatePlayer(controller){

        if(controller.input.indexOf('ArrowRight') > -1 && this.x + this.width + this.buffer < this.boardWidth){
        this.x += this.velocityX;
        this.spritePositionY = 220;
         if(this.firstSpriteXPosition >= this.maxRun){
             this.firstSpriteXPosition = 0;
         }else{ this.firstSpriteXPosition += this.runFrameX}
        }
        else if(controller.input.indexOf('ArrowLeft') > -1 && this.x > 0){
            this.x -= this.velocityX;
            this.spritePositionY = 433;
            if(this.firstSpriteXPosition >= this.runFrameX * 4){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}   
            }
        else if(this.x < 0){
            this.x = 0;
        }
        else if(controller.input.indexOf('ArrowUp') > -1 && this.y > this.boardHeight * .60){
            this.y -= this.velocityY; 
            this.spritePositionY = 220;
            if(this.firstSpriteXPosition >= this.maxRun){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}        
        } 
        else if(controller.input.indexOf('ArrowDown') > -1 && this.y + this.height < this.boardHeight){
            this.y += this.velocityY; 
            this.spritePositionY = 220;
            if(this.firstSpriteXPosition >= this.maxRun){
                this.firstSpriteXPosition = 0;
            }else{ this.firstSpriteXPosition += this.runFrameX}        
        } 
        
        if(this.x + this.width + this.buffer > gameBoard.width ){
            this.x = this.boardWidth - this.width;
        }
        
    }

}

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
        })
    }
}
//Utility functions
function randomRange(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//create enemies
function spawnTanks(){
    enemyFleet.forEach(tank =>{
        tank.updateTank(mag);
        tank.drawTank();
    });
    enemyFleet = enemyFleet.filter(tank=>!tank.markedForDeletion);
    mag = mag.filter(bullet=> !bullet.markedForDeletion);
}

let enemyFleet = []
let mag = [];

const background = new Background(gameBoard.width,gameBoard.height);
const tank = new BadGuy(gameBoard.with, gameBoard.height);
const controller = new Controller();
const player = new Player(gameBoard.width, gameBoard.height);
player.drawPlayer();

//Fire Utility
document.addEventListener('keydown',(e)=>{
    if(e.key === ' '){
        mag.push(new Bullet(player.x + player.width - 43, player.y + 40, 40, 0))
    }
})

// Main Animator
function Game(){

setInterval(() => {
    if(score.innerHTML === 'YOU MADE IT TO THE END!')
    return;
    context.clearRect(0, 0, gameBoard.width, gameBoard.height);
    background.drawBackGround(gameBoard.width, gameBoard.height);
    background.backGroundScroll(player)
    spawnTanks();
    player.drawPlayer();
    player.upDatePlayer(controller)
    tank.drawTank();
    mag.forEach(bullet=> {
        bullet.updateBullet() 
        bullet.drawBullet()
    });
 
    // console.log(mag)
}, 100)

// Produce Tanks
let timer = setInterval(() =>{
    enemyFleet.push(new BadGuy(gameBoard.width, gameBoard.height))
    
}, 3000);

}

Game();






