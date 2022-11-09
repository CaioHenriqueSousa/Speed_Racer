class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank = 0
    this.life = 185
    this.fuel = 185
    this.score = 0
  }
  getCount() {
    var getPlayerCount = database.ref("playerCount")
    getPlayerCount.on("value", data => {
      playerCount = data.val()
    })
  }
  updateCount(count) {
   database.ref("/").update({
    playerCount: count
   })
  }
  addPlayer() {
    var playerIndex = "players/player" + this.index
     if(this.index == 1) {
      this.positionX = width/2 -100
     }
     else {
      this.positionX = width/2 +100
     }
     database.ref(playerIndex).set({
      name: this.name, 
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
     })
  }
  static getPlayerInfo() {
    var infoPlayer = database.ref("players")
    infoPlayer.on("value", data => {
      allPlayers = data.val()
    })
  }
  update(){
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).update({
    positionX: this.positionX,
    positionY: this.positionY,
    rank: this.rank,
    score: this.score,
    life: this.life
    })

  }
  getDistance(){
    var playerDistanceRef = database.ref("players/player" + this.index)
    playerDistanceRef.on("value", data => {
      var data = data.val()
      this.positionX = data.positionX
      this.positionY = data.positionY
    })
  }
  getCarsAtEnd(){
  database.ref("carsAtEnd").on("value", data => {
    this.rank = data.val()
  })
  }
  static updateCarAtEnd(rank){
database.ref("/").update({
  carsAtEnd: rank
})
  }
}
