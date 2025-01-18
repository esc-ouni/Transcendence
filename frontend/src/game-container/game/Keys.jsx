const RED_P1 = new THREE.Vector2();
const RED_P2 = new THREE.Vector2();

const BLUE_P1 = new THREE.Vector2();
const BLUE_P2 = new THREE.Vector2();

let Chained_Keys = [
    {w:0},
    {d:0},
    {s:0},
    {a:0},

    {i:0},
    {l:0},
    {k:0},
    {j:0},

    {ArrowUp   :0},
    {ArrowRight:0},
    {ArrowDown :0},
    {ArrowLeft :0},


    {g :0},
    {n :0},
    {b :0},
    {v :0},
]

const handleKeyDown = (event) => {
    const keyName = event.key;
    
    if (keyName === "r"){
        BallCreator.createBall()
    }

    if ( keyName === "w") {
        Chained_Keys.w = 1;
    }
    if (keyName === "s"){
        Chained_Keys.s = 1;
    }
    if (keyName === "d"){
        Chained_Keys.d = 1;
    }
    if (keyName === "a"){
        Chained_Keys.a = 1;
    }


    if ( keyName === "i") {
        Chained_Keys.i = 1;
    }
    if (keyName === "l"){
        Chained_Keys.l = 1;
    }
    if (keyName === "k"){
        Chained_Keys.k = 1;
    }
    if (keyName === "j"){
        Chained_Keys.j = 1;
    }


    if ( keyName === "ArrowUp") {
        Chained_Keys.ArrowUp = 1;
    }
    if (keyName === "ArrowRight"){
        Chained_Keys.ArrowRight = 1;
    }
    if (keyName === "ArrowDown"){
        Chained_Keys.ArrowDown = 1;
    }
    if (keyName === "ArrowLeft"){
        Chained_Keys.ArrowLeft = 1;
    }


    if ( keyName === "g") {
        Chained_Keys.g = 1;
    }
    if (keyName === "n"){
        Chained_Keys.n = 1;
    }
    if (keyName === "b"){
        Chained_Keys.b = 1;
    }
    if (keyName === "v"){
        Chained_Keys.v = 1;
    }

};


const handleKeyUp = (event) => {
    const keyName = event.key;

  if ( keyName === "w") {
      Chained_Keys.w = 0;
    }
    if (keyName === "s"){
      Chained_Keys.s = 0;
    }
  if (keyName === "d"){
      Chained_Keys.d = 0;
    }
    if (keyName === "a"){
      Chained_Keys.a = 0;
  }


  if ( keyName === "i") {
    Chained_Keys.i = 0;
    }
    if (keyName === "l"){
        Chained_Keys.l = 0;
    }
    if (keyName === "k"){
        Chained_Keys.k = 0;
    }
    if (keyName === "j"){
        Chained_Keys.j = 0;
    }


    if ( keyName === "ArrowUp") {
        Chained_Keys.ArrowUp = 0;
    }
    if (keyName === "ArrowRight"){
        Chained_Keys.ArrowRight = 0;
    }
    if (keyName === "ArrowDown"){
        Chained_Keys.ArrowDown = 0;
    }
    if (keyName === "ArrowLeft"){
        Chained_Keys.ArrowLeft = 0;
    }


    if ( keyName === "g") {
        Chained_Keys.g = 0;
    }
    if (keyName === "n"){
        Chained_Keys.n = 0;
    }
    if (keyName === "b"){
        Chained_Keys.b = 0;
    }
    if (keyName === "v"){
        Chained_Keys.v = 0;
    }
}




if ( Chained_Keys.w === 1) {
    RED_P1.y += BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.s === 1){
    RED_P1.y -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.d === 1){
    RED_P1.x -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.a === 1){
    RED_P1.x += BallCreator.PADDLE_SPEED; 
}

if (RED_P1.x > 0){
    RED_P1.x = Math.min(RED_P1.x, 1);
}
if (RED_P1.x < 0){
    RED_P1.x = Math.max(RED_P1.x, -1);
}
if (RED_P1.y > 0){
    RED_P1.y = Math.min(RED_P1.y, 1);
}
if (RED_P1.y < 0){
    RED_P1.y = Math.max(RED_P1.y, -1);
}




if ( Chained_Keys.g === 1) {
    RED_P2.y += BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.b === 1){
    RED_P2.y -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.n === 1){
    RED_P2.x -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.v === 1){
    RED_P2.x += BallCreator.PADDLE_SPEED; 
}

if (RED_P2.x > 0){
    RED_P2.x = Math.min(RED_P2.x, 1);
}
if (RED_P2.x < 0){
    RED_P2.x = Math.max(RED_P2.x, -1);
}
if (RED_P2.y > 0){
    RED_P2.y = Math.min(RED_P2.y, 1);
}
if (RED_P2.y < 0){
    RED_P2.y = Math.max(RED_P2.y, -1);
}




if ( Chained_Keys.i === 1) {
    BLUE_P1.y += BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.k === 1){
    BLUE_P1.y -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.l === 1){
    BLUE_P1.x -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.j === 1){
    BLUE_P1.x += BallCreator.PADDLE_SPEED; 
}

if (BLUE_P1.x > 0){
    BLUE_P1.x = Math.min(BLUE_P1.x, 1);
}
if (BLUE_P1.x < 0){
    BLUE_P1.x = Math.max(BLUE_P1.x, -1);
}
if (BLUE_P1.y > 0){
    BLUE_P1.y = Math.min(BLUE_P1.y, 1);
}
if (BLUE_P1.y < 0){
    BLUE_P1.y = Math.max(BLUE_P1.y, -1);
}


if ( Chained_Keys.ArrowUp === 1) {
    BLUE_P2.y += BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.ArrowDown === 1){
    BLUE_P2.y -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.ArrowRight === 1){
    BLUE_P2.x -= BallCreator.PADDLE_SPEED;
}
if (Chained_Keys.ArrowLeft === 1){
    BLUE_P2.x += BallCreator.PADDLE_SPEED; 
}

if (BLUE_P2.x > 0){
    BLUE_P2.x = Math.min(BLUE_P2.x, 1);
}
if (BLUE_P2.x < 0){
    BLUE_P2.x = Math.max(BLUE_P2.x, -1);
}
if (BLUE_P2.y > 0){
    BLUE_P2.y = Math.min(BLUE_P2.y, 1);
}
if (BLUE_P2.y < 0){
    BLUE_P2.y = Math.max(BLUE_P2.y, -1);
}