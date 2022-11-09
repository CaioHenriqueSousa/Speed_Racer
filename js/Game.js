class Game {
  constructor() {
    this.resetButton = createButton("")
    this.resetTitle = createElement("h2")
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
    this.placar = createElement("h2")
    this.firstPos = createElement("h2")
    this.secondPos = createElement("h2")
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();
    car1 = createSprite(width/2 -50, height -100)
    car1.addImage(car1Img)
    car1.scale = 0.07
    car1.addImage("blast",blastImg)
    car2 = createSprite(width/2 +100, height -100)
    car2.addImage(car2Img)
    car2.scale = 0.07
    car2.addImage("blast",blastImg)
    cars = [car1,car2]
    coinGroup = new Group()
    fuelGroup = new Group()
    obstacleGroup = new Group()
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    
    this.addSprites(coinGroup,10, coinImg,0.07)
    this.addSprites(fuelGroup,10,fuelImg,0.03)
    this.addSprites(obstacleGroup,obstaclesPositions.length, obstacle1Image,0.04,obstaclesPositions)
  }

  addSprites(spriteGroup, numberofSprites, spriteImg, scale, positions = []) {
    for(var i = 0;i < numberofSprites; i++ ){
      var x,y
      if(positions.length > 0){
       x = positions[i].x
       y = positions[i].y
       spriteImg = positions[i].image
      }
      else{
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(- height * 4.5, height - 400)
      }
      var sprite = createSprite(x,y)
      sprite.addImage(spriteImg)
      sprite.scale = scale
      spriteGroup.add(sprite)
    }
  }
 
  getState() {
    var gameStateGet = database.ref("gameState")
    gameStateGet.on("value", function(data){
      gameState = data.val()
    })
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    })
  }
  play() {
    player.getCarsAtEnd()
    this.handleElements()
    this.handleResetButton()
    Player.getPlayerInfo()
    if( allPlayers !== undefined){
      image(pistaImg, 0,-height *5,width ,height *6)
      this.showLife()
      this.showFuelBar()
      this.playersRankView()
      
       var index = 0
       for(var plr in allPlayers){
        index = index + 1
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        var currentLife = allPlayers[plr].life
        if( currentLife <= 0){
          cars[index-1].changeImage("blast")
          cars[index-1].scale = 0.15
          
        }
        cars[index - 1].position.x = x
        cars[index - 1].position.y = y
        if(index == player.index){
          stroke(10)
          fill("red")
          ellipse(x,y,60,60)
          this.collisionCars(index)
          this.collisionCar(index)
          this.overlapCoin(index)
          this.overlapFuel(index)
          if(player.life <= 0){
            this.blast = true
            this.playerMoving = false
          }
        
          camera.position.y = cars[index-1].position.y
        } 
        
       }
       this.carControl()
       const linhaChegada = height*6 - 100
       if(player.positionY > linhaChegada ){
        gameState = 2
        player.rank += 1
        Player.updateCarAtEnd(player.rank)
        player.update()
        this.showRank()
       }
      drawSprites()
    }

  }
  handleElements() {
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resetButton.class("resetButton")
    this.resetButton.position(width / 2 + 250, 40)
    this.resetTitle.html("Reiniciar")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width / 2 + 250, 50)

    this.placar.html("Placar")
    this.placar.class("resetText")
    this.placar.position(width/2 - 500, 150)
    this.firstPos.class("leadersText")
    this.firstPos.position(width/2 - 500, 180)
    this.secondPos.class("leadersText")
    this.secondPos.position(width/2 - 500, 210)
  }
  carControl() {
   if(!this.blast ){ 
    if(keyDown(UP_ARROW) ){

      player.positionY += 10
      player.update()
      
    }
    if(!this.playerMoving){
    player.positionY +=5
    player.update()
    }
    if(keyDown(RIGHT_ARROW) && player.positionX < width / 2 +280){
      player.positionX += 5
      this.leftKeyActive = false
      player.update()
    }
    if(keyDown(LEFT_ARROW) && player.positionX > width/3 - 70){
      player.positionX -= 5
      this.leftKeyActive = true
      player.update()
    }
  }
}
  handleResetButton(){
    this.resetButton.mousePressed(()=> {
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd: 0

      })
      window.location.reload()
    })
  }
  overlapCoin(index){
 cars[index-1].overlap(coinGroup, function(collector,collected){
  player.score +=10
  player.update()
  collected.remove()

 })
  }
  overlapFuel(index){
    cars[index-1].overlap(fuelGroup, function(collector,collected){
      player.fuel = 185
      collected.remove()
   })
   if(player.fuel > 0 && !this.playerMoving) {
    player.fuel -=0.4
   }
  if(player.fuel <= 0){
    gameState = 2
    this.gameOver()
  }
  }
  showRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  showLife(){
    push()
    image(lifeImg,width/2 -150,height - player.positionY - 260, 20 ,20)
    fill("white")
    rect(width/2 - 100, height - player.positionY - 260, 185, 20)
    fill("red")
    rect(width/2 - 100, height - player.positionY - 260, player.life, 20)
    noStroke()
    pop()
  }
  showFuelBar(){
  push()
  image(fuelImg,width/2 -150,height - player.positionY - 300, 20 ,20)
  fill("white")
  rect(width/2 - 100, height - player.positionY - 300, 185, 20)
  fill("orange")
  rect(width/2 - 100, height - player.positionY - 300, player.fuel, 20)
  noStroke()
  pop()
  }
  collisionCars(index) {
    if(cars[index-1].collide(obstacleGroup)){
      if(this.leftKeyActive){
        player.positionX +=100
      }
      else {
        player.positionX -= 100
      }
      if(player.life> 0){
        player.life -=185/4
      }
      player.update()
     
    }
  }
  collisionCar(index) {
    if(index === 1){
      if(cars[index-1].collide(cars[1])){
        if(this.leftKeyActive){
          player.positionX +=100
        }
        else {
          player.positionX -= 100
        }
        if(player.life> 0){
          player.life -=185/4
        }
        player.update()
       
      }
    }
    if( index == 2){
      if(cars[index-1].collide(cars[0])){
        if(this.leftKeyActive){
          player.positionX +=100
        }
        else {
          player.positionX -= 100
        }
        if(player.life> 0){
          player.life -=185/4
        }
        player.update()
       
      }
    }
  }
  
   
  playersRankView() {
    var plr1, plr2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      plr1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      plr2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      plr1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      plr2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.firstPos.html(plr1);
    this.secondPos.html(plr2);
  }
    
  }


