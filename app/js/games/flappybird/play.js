(function(Phaser) {
'use strict';

    angular
        .module('App')
        .factory('FlappyBirdPlay', FlappyBirdPlay);

    FlappyBirdPlay.$inject = ['$cordovaVibration', '$timeout'];




    function FlappyBirdPlay($cordovaVibration, $timeout) {
        
        var $scope = null;
        


//              .                 .             
//            .o8               .o8             
//  .oooo.o .o888oo  .oooo.   .o888oo  .ooooo.  
// d88(  "8   888   `P  )88b    888   d88' `88b 
// `"Y88b.    888    .oP"888    888   888ooo888 
// o.  )88b   888 . d8(  888    888 . 888    .o 
// 8""888P'   "888" `Y888""8o   "888" `Y8bod8P' 
                                             

        var state = {
            init: function() {

	// BACKGROUND COLOR ***************************************
                this.stage.backgroundColor = "#41C9D6";
    // ========================================================
			
    // ? ******************************************************
                this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
    // ========================================================

    // SCALING SIZES ******************************************
				this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.updateLayout();
    // ========================================================
                
    // Pixel Art **********************************************
		        this.game.renderer.renderSession.roundPixels = true;
                this.game.time.desiredFps = 60;
			},
    // ========================================================



//                               oooo                            .o8  
//                               `888                           "888  
// oo.ooooo.  oooo d8b  .ooooo.   888   .ooooo.   .oooo.    .oooo888  
//  888' `88b `888""8P d88' `88b  888  d88' `88b `P  )88b  d88' `888  
//  888   888  888     888ooo888  888  888   888  .oP"888  888   888  
//  888   888  888     888    .o  888  888   888 d8(  888  888   888  
//  888bod8P' d888b    `Y8bod8P' o888o `Y8bod8P' `Y888""8o `Y8bod88P" 
//  888                                                               
// o888o                                                              
                                                                   
            preload: function(){

    // LOAD ASSETS *******************************************
                this.game.load.image('tube', 'assets/tube.png');
                this.game.load.image('ground', 'assets/ground.png');
                this.game.load.spritesheet('bird', 'assets/bird.png', 75, 55);
                
                this.game.load.audio('hit', ['audio/hit.ogg']);
                this.game.load.audio('die', ['audio/die.ogg']);
                this.game.load.audio('point', ['audio/point.ogg']);
                this.game.load.audio('wing', ['audio/wing.ogg', 'audio/wing.mp3']);
            },
    // ========================================================


//                                            .             
//                                          .o8             
//  .ooooo.  oooo d8b  .ooooo.   .oooo.   .o888oo  .ooooo.  
// d88' `"Y8 `888""8P d88' `88b `P  )88b    888   d88' `88b 
// 888        888     888ooo888  .oP"888    888   888ooo888 
// 888   .o8  888     888    .o d8(  888    888 . 888    .o 
// `Y8bod8P' d888b    `Y8bod8P' `Y888""8o   "888" `Y8bod8P' 
                                                         
                                                     
            create: function(){
    // DEBUGGING **********************************************
                // this.isDebugging = $scope.isDebugging;
    // ========================================================

    // SCORE **************************************************
                this.totalScore = 0;
    // ========================================================

    // ? ******************************************************
                this.started = false;
                this.dead = false;
                this.canJump = true;
                this.canRestart = false;
    // ========================================================    
            
    // WORLD BOUNDS *******************************************
                this.game.world.setBounds(-10, 0, this.game.width + 10, this.game.height);
    // ========================================================
            
    // ARCADE PHYICS ******************************************
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // ========================================================

    // ? ******************************************************
                this.game.physics.arcade.checkCollision.up = false;
    // ========================================================
            
    // GREEN TUBES/MARIO TUNNELS ******************************
                this.tubes = this.game.add.group();
                this.tubes.enableBody = true;
                this.tubes.createMultiple(12, 'tube');
                this.newtubes = this.game.time.events.loop(1500, this.newTube, this);
                this.newtubes.timer.stop(false);
    // ========================================================
            
    // ? ******************************************************                
                this.sensors = this.game.add.group();
                this.sensors.enableBody = true;
    // ========================================================
            
    // GROUND *************************************************   
                var groundCache = this.game.cache.getFrame('ground');
                this.ground = this.game.add.tileSprite(-10, this.game.height, this.game.width + 20, groundCache.height, 'ground');
                this.ground.anchor.y = 1;
                this.game.physics.arcade.enable(this.ground);
                this.ground.body.immovable = true;
                this.ground.body.moves = false;
                this.ground.autoScroll(-50, 0);
    // ========================================================
            
    // BIRD *************************************************** 
                this.bird = this.game.add.sprite(this.game.world.centerX/2, this.game.world.centerY, 'bird');
                this.bird.anchor.set(0.5);
                this.bird.scale.set(0.8);
                this.bird.animations.add('fly', null, 15, true);
                this.bird.animations.play('fly');
                this.tweenFly = this.game.add.tween(this.bird);
                this.tweenFly.to({ y: this.bird.y + 20}, 400, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    // ========================================================
            
    // ? ******************************************************
                this.bird.checkWorldBounds = true;
                this.bird.pivot.x = -this.bird.width/2;
                this.bird.events.onOutOfBounds.add(function(){
                    this.canJump = false;
                }, this);
                this.bird.events.onEnterBounds.add(function(){
                    this.canJump = true;
                }, this);
    // ========================================================
            
    // ? ******************************************************    
                this.game.input.onDown.add(this.jump, this);
                
    // ? ******************************************************
                this.scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY/3, "0", { font: "60px Arial", fill: "#ffffff" }); 
                this.scoreText.anchor.set(0.5);
    // ========================================================
            
    // AUDIO EVENTS *******************************************
                this.hitAudio = this.add.audio('hit');
                this.dieAudio = this.add.audio('die');
                this.pointAudio = this.add.audio('point');
                this.wingAudio = this.add.audio('wing');
            },
    // ========================================================



//              .                          .   
//            .o8                        .o8   
//  .oooo.o .o888oo  .oooo.   oooo d8b .o888oo 
// d88(  "8   888   `P  )88b  `888""8P   888   
// `"Y88b.    888    .oP"888   888       888   
// o.  )88b   888 . d8(  888   888       888 . 
// 8""888P'   "888" `Y888""8o d888b      "888" 
                                            

            start: function(){
            
    // GROUND AUTOSCROLL **************************************
                this.ground.autoScroll(0, 0);
                this.tweenFly.stop();
    // ========================================================

    // ENABLE ARCADE PHYSICS ON BIRD **************************
                this.game.physics.arcade.enable(this.bird);
    // ========================================================

    // BIRD SIZE **********************************************
                this.bird.body.setSize(this.bird.width - 10, this.bird.height - 10, 0, 0);
    // ========================================================

    // BIRD GRAVITY *******************************************
                this.bird.body.gravity.y = 2000;
    // ========================================================

    // BIRD WORLD COLLIDER ************************************		
                this.bird.body.collideWorldBounds = true;
    // ========================================================
            
    // CREATE NEW TUBES ***************************************   
                this.newtubes.timer.start();
    // ========================================================

    // START GAME??? ******************************************    
                this.started = true;
            },
    // ========================================================

                                                      
                                                      
//  .oooooooo  .oooo.   ooo. .oo.  .oo.    .ooooo.       
// 888' `88b  `P  )88b  `888P"Y88bP"Y88b  d88' `88b      
// 888   888   .oP"888   888   888   888  888ooo888      
// `88bod8P'  d8(  888   888   888   888  888    .o      
// `8oooooo.  `Y888""8o o888o o888o o888o `Y8bod8P'      
// d"     YD                                             
// "Y88888P'                                                                           
                                                      
//  .ooooo.  oooo    ooo  .ooooo.  oooo d8b              
// d88' `88b  `88.  .8'  d88' `88b `888""8P              
// 888   888   `88..8'   888ooo888  888                  
// 888   888    `888'    888    .o  888                  
// `Y8bod8P'     `8'     `Y8bod8P' d888b                 
                                                      
                                                                                                
            gameOver: function(){
                var self = this;
                this.newtubes.timer.stop(false);
                
                this.game.add.tween(this.game.camera).to({ x: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);
                this.bird.animations.stop();
                
                this.flash = this.game.add.graphics(-10, 0);
				this.flash.beginFill(0xffffff, 1);
				this.flash.drawRect(0, 0, this.game.width + 20, this.game.height);
				this.flash.endFill();
                this.flash.alpha = 0.5;
                this.game.add.tween(this.flash).to({ alpha: 0 }, 50, Phaser.Easing.Cubic.In, true);
                
                this.dead = true;
                
                var self = this;
                setTimeout(function(){
                    self.canRestart = true;
                }, Phaser.Timer.SECOND * 0.5);
                
                this.tubes.forEachAlive(function(tube){
                    tube.body.velocity.x = 0;
                }, this);
                this.sensors.forEachAlive(function(sensor){
                    sensor.body.velocity.x = 0;
                }, this);
                
                try {
                    $cordovaVibration.vibrate(300);
                } catch (error) {
                    console.log(error);
                }
                
                this.hitAudio.play();
                $timeout(function () {
                    self.dieAudio.play();
                }, 300);
            },


//     o8o                                          
//     `"'                                          
//    oooo oooo  oooo  ooo. .oo.  .oo.   oo.ooooo.  
//    `888 `888  `888  `888P"Y88bP"Y88b   888' `88b 
//     888  888   888   888   888   888   888   888 
//     888  888   888   888   888   888   888   888 
//     888  `V88V"V8P' o888o o888o o888o  888bod8P' 
//     888                                888       
// .o. 88P                               o888o      
// `Y888P                                           

            jump: function(){
                if(!this.dead) {
                    this.start();
                }
                
                if(!this.dead && this.canJump) {
                    this.bird.animations.play('fly');
                    this.birdInJump = true;
                    this.bird.body.velocity.y = -550;
                    this.wingAudio.play();
                }
                
                if(this.dead && this.canRestart) {
                    this.game.state.start(this.game.state.current);
                }
            },



//                              .o8                .             
//                             "888              .o8             
// oooo  oooo  oo.ooooo.   .oooo888   .oooo.   .o888oo  .ooooo.  
// `888  `888   888' `88b d88' `888  `P  )88b    888   d88' `88b 
//  888   888   888   888 888   888   .oP"888    888   888ooo888 
//  888   888   888   888 888   888  d8(  888    888 . 888    .o 
//  `V88V"V8P'  888bod8P' `Y8bod88P" `Y888""8o   "888" `Y8bod8P' 
//              888                                              
//             o888o                                             
                         

            update: function(){
                this.game.physics.arcade.collide(this.bird, this.ground);
                
                if(!this.started) return;
                
                this.updateAngle();
                
                if(this.dead) return;
                
                this.game.physics.arcade.overlap(this.bird, this.tubes, this.gameOver, null, this); 
                this.game.physics.arcade.overlap(this.bird, this.sensors, this.incrementScore, null, this);               
                this.ground.tilePosition.x -= 2;
                
                if(this.bird.body.touching.down){
                    this.gameOver();
                }
            },

//                              .o8                .             
//                             "888              .o8             
// oooo  oooo  oo.ooooo.   .oooo888   .oooo.   .o888oo  .ooooo.  
// `888  `888   888' `88b d88' `888  `P  )88b    888   d88' `88b 
//  888   888   888   888 888   888   .oP"888    888   888ooo888 
//  888   888   888   888 888   888  d8(  888    888 . 888    .o 
//  `V88V"V8P'  888bod8P' `Y8bod88P" `Y888""8o   "888" `Y8bod8P' 
//              888                                              
//             o888o                                             
                                                              
//                                  oooo                         
//                                  `888                         
//  .oooo.   ooo. .oo.    .oooooooo  888   .ooooo.               
// `P  )88b  `888P"Y88b  888' `88b   888  d88' `88b              
//  .oP"888   888   888  888   888   888  888ooo888              
// d8(  888   888   888  `88bod8P'   888  888    .o              
// `Y888""8o o888o o888o `8oooooo.  o888o `Y8bod8P'              
//                       d"     YD                               
//                       "Y88888P'                               
                                                              

            updateAngle: function(){
                
                if(this.bird.body.touching.down) return;
                
                if(this.birdInJump){
                    if(this.bird.angle > -30){
                        this.bird.angle -= 10;
                    }else{
                        this.birdInJump = false;
                    }
                }else if(this.bird.angle < 0){
                    this.bird.angle += 1;
                }else if(this.bird.angle < 45){
                    this.bird.animations.stop();
                    this.bird.angle += 2;
                }else if(this.bird.angle < 90){
                    this.bird.angle += 4;
                }
            },


//                              o8o                       
//                              `"'                       
// oooo d8b  .ooooo.   .oooo.o oooo    oooooooo  .ooooo.  
// `888""8P d88' `88b d88(  "8 `888   d'""7d8P  d88' `88b 
//  888     888ooo888 `"Y88b.   888     .d8P'   888ooo888 
//  888     888    .o o.  )88b  888   .d8P'  .P 888    .o 
// d888b    `Y8bod8P' 8""888P' o888o d8888888P  `Y8bod8P' 
                                                       
           
            resize: function(){
                
                if(this.bird){
                    this.bird.x = this.game.world.centerX/2;
                }
                if(this.scoreText){
                    this.scoreText.y = this.game.world.centerY/3;
                    this.scoreText.x = this.game.world.centerX;
                }
                if (this.ground) {
                    this.ground.width = this.game.width + 20;
                }
            },




//                                      .o8                     
//                                     "888                     
// oooo d8b  .ooooo.  ooo. .oo.    .oooo888   .ooooo.  oooo d8b 
// `888""8P d88' `88b `888P"Y88b  d88' `888  d88' `88b `888""8P 
//  888     888ooo888  888   888  888   888  888ooo888  888     
//  888     888    .o  888   888  888   888  888    .o  888     
// d888b    `Y8bod8P' o888o o888o `Y8bod88P" `Y8bod8P' d888b    
                                                                                                   
                                                    
            render: function(){
                if(!this.isDebugging) return;
                
                this.game.debug.text('Debugging', 10, 30, 'white', '20px "Sigmar One"');
                this.game.debug.body(this.bird);
                this.game.debug.body(this.ground, 'rgba(255, 255, 0, 0.5)');
                this.game.debug.geom(new Phaser.Point(this.bird.x, this.bird.y), '#FFFF00');
                this.tubes && this.tubes.forEachAlive(function(tube){
                    this.game.debug.body(tube, 'rgba(0, 0, 255, 0.5)');
                }, this); 
                this.sensors && this.sensors.forEachAlive(function(sensor){
                    this.game.debug.body(sensor, 'rgba(0, 255, 0, 0.5)');
                }, this);
            },
                                  
                                         
// ooo. .oo.    .ooooo.  oooo oooo    ooo   
// `888P"Y88b  d88' `88b  `88. `88.  .8'    
//  888   888  888ooo888   `88..]88..8'     
//  888   888  888    .o    `888'`888'      
// o888o o888o `Y8bod8P'     `8'  `8'       
                                                                 
//     .                .o8                 
//   .o8               "888                 
// .o888oo oooo  oooo   888oooo.   .ooooo.  
//   888   `888  `888   d88' `88b d88' `88b 
//   888    888   888   888   888 888ooo888 
//   888 .  888   888   888   888 888    .o 
//   "888"  `V88V"V8P'  `Y8bod8P' `Y8bod8P' 
                                         
                                                                                    
            newTube: function(){
                var randomPosition = this.game.rnd.integerInRange(120, this.game.height - this.ground.height - 100);
                
                var tube = this.game.cache.getFrame('tube');
                
                var tube1 = this.tubes.getFirstDead();
                tube1.reset(this.game.width + tube.width/2, randomPosition - 100);
                tube1.anchor.setTo(0.5, 1);
                tube1.scale.set(1.4);
                tube1.body.velocity.x = -180;
                tube1.body.immovable = true;
                tube1.checkWorldBounds = true;
                tube1.outOfBoundsKill = true;
                
                var tube2 = this.tubes.getFirstDead();
                tube2.reset(this.game.width + tube.width/2, randomPosition + 100 + tube.height/2);
                tube2.anchor.setTo(0.5, 0.5);
                tube2.scale.setTo(-1.4, -1.4);
                tube2.body.velocity.x = -180;
                tube2.body.immovable = true;
                tube2.checkWorldBounds = true;
                tube2.outOfBoundsKill = true;
                
                var sensor = this.sensors.create(this.game.width + tube.width, 0);
                sensor.body.setSize(40, this.game.height);
                sensor.body.velocity.x = -180;
                sensor.body.immovable = true;
                sensor.alpha = 0;
            },




//  o8o                                                                                       .        
//  `"'                                                                                     .o8        
// oooo  ooo. .oo.    .ooooo.  oooo d8b  .ooooo.  ooo. .oo.  .oo.    .ooooo.  ooo. .oo.   .o888oo      
// `888  `888P"Y88b  d88' `"Y8 `888""8P d88' `88b `888P"Y88bP"Y88b  d88' `88b `888P"Y88b    888        
//  888   888   888  888        888     888ooo888  888   888   888  888ooo888  888   888    888        
//  888   888   888  888   .o8  888     888    .o  888   888   888  888    .o  888   888    888 .      
// o888o o888o o888o `Y8bod8P' d888b    `Y8bod8P' o888o o888o o888o `Y8bod8P' o888o o888o   "888"      
                                                                                                                                                                                         
//  .oooo.o  .ooooo.   .ooooo.  oooo d8b  .ooooo.                                                      
// d88(  "8 d88' `"Y8 d88' `88b `888""8P d88' `88b                                                     
// `"Y88b.  888       888   888  888     888ooo888                                                     
// o.  )88b 888   .o8 888   888  888     888    .o                                                     
// 8""888P' `Y8bod8P' `Y8bod8P' d888b    `Y8bod8P'                                                     
                                                                                                    
                                                                                                                                                                                                 
            incrementScore: function(bird, sensor){
                sensor.kill();
                this.totalScore++;
                this.scoreText.setText(this.totalScore);
                this.pointAudio.play();
            },



//     .                                   oooo            
//   .o8                                   `888            
// .o888oo  .ooooo.   .oooooooo  .oooooooo  888   .ooooo.  
//   888   d88' `88b 888' `88b  888' `88b   888  d88' `88b 
//   888   888   888 888   888  888   888   888  888ooo888 
//   888 . 888   888 `88bod8P'  `88bod8P'   888  888    .o 
//   "888" `Y8bod8P' `8oooooo.  `8oooooo.  o888o `Y8bod8P' 
//                   d"     YD  d"     YD                  
//                   "Y88888P'  "Y88888P'                  
                                                        
//       .o8             .o8                               
//      "888            "888                               
//  .oooo888   .ooooo.   888oooo.  oooo  oooo   .oooooooo  
// d88' `888  d88' `88b  d88' `88b `888  `888  888' `88b   
// 888   888  888ooo888  888   888  888   888  888   888   
// 888   888  888    .o  888   888  888   888  `88bod8P'   
// `Y8bod88P" `Y8bod8P'  `Y8bod8P'  `V88V"V8P' `8oooooo.   
//                                             d"     YD   
//                                             "Y88888P'   
                                                        

            toggleDebug: function (isDebugging) {
                this.game.debug.reset();
                this.isDebugging = isDebugging;
            }
        };
        
        return {


//                          .                   
//                        .o8                   
//  .oooooooo  .ooooo.  .o888oo                 
// 888' `88b  d88' `88b   888                   
// 888   888  888ooo888   888                   
// `88bod8P'  888    .o   888 .                 
// `8oooooo.  `Y8bod8P'   "888"                 
// d"     YD                                    
// "Y88888P'                                    
                                             
//              .                 .             
//            .o8               .o8             
//  .oooo.o .o888oo  .oooo.   .o888oo  .ooooo.  
// d88(  "8   888   `P  )88b    888   d88' `88b 
// `"Y88b.    888    .oP"888    888   888ooo888 
// o.  )88b   888 . d8(  888    888 . 888    .o 
// 8""888P'   "888" `Y888""8o   "888" `Y8bod8P' 
                                             
    
            getState: function (scope) {
                $scope = scope;
                return state;
            }
        };
    }
})(Phaser);