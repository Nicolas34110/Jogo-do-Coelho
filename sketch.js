const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con, fruit_con2, fruit_con3;
var bgImg, fruitImg, bunnyImg;
var bunny;
var button, button2, button3;
var blink, eat;
var sad;
var bkSound, cutSound, sadSound, eatingSound, airSound;
var blower;
var muteBt;

function preload(){
  bgImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  bunnyImg = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  bkSound = loadSound("sound1.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  eatingSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");

  blink.playing=true;
  eat.playing=true;
  eat.looping=false;
  sad.playing=true;
  sad.looping-false;
}
function setup() 
{
  //createCanvas(500,700);
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
   if(isMobile){
     canW = displayWidth; canH = displayHeight;
     createCanvas(displayWidth+80, displayHeight);
     } else{
       canW = windowWidth; canH = windowHeight;
       createCanvas(windowWidth, windowHeight); }
  engine = Engine.create();
  world = engine.world;
 
  blink.frameDelay=20;
  eat.frameDelay=20;
  sad.frameDelay=20;

  bkSound.play();
    bkSound.setVolume(0.5);
  
  ground=new Ground(200,canH,600,20);
  rope=new Rope(8,{x:40,y:30});
  rope2=new Rope(7,{x:370,y:40});
  rope3=new Rope(4,{x:400,y:225});

  var fruit_options={
    density:0.001
  }
  fruit=Bodies.circle(300,300,20,fruit_options);
  Matter.Composite.add(rope.body,fruit);

  fruit_con=new Link(rope,fruit);
  fruit_con2=new Link(rope2,fruit);
  fruit_con3=new Link(rope3,fruit);

  bunny = createSprite(170,canH-80,100,100);
    bunny.addImage(bunnyImg);
    bunny.addAnimation("blinking",blink);
    bunny.addAnimation("eating",eat);
    bunny.changeAnimation("blinking");
    bunny.addAnimation("crying",sad);
    bunny.scale = 0.2;

  button=createImg("cut_btn.png");
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2=createImg("cut_btn.png");
  button2.position(330,35);
  button2.size(60,60);
  button2.mouseClicked(drop2);

  button3=createImg("cut_btn.png");
  button3.position(360,200);
  button3.size(60,60);
  button3.mouseClicked(drop3);

  blower=createImg("balloon.png");
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airBlow);

  muteBt=createImg("mute.png");
  muteBt.position(450,20);
  muteBt.size(50,50);
  muteBt.mouseClicked(mute);

  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() 
{
  background(51);
  image(bgImg,width/2, height/2, displayWidth+80, displayHeight);
  Engine.update(engine);
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();

  // ellipse(fruit.position.x,fruit.position.y,30,30);
  //image(fruitImg,fruit.position.x,fruit.position.y,60,60);

  push();
  imageMode(CENTER);

  if(fruit!= null){
    image(fruitImg,fruit.position.x,fruit.position.y,60,60);
  }
  pop();
  
  drawSprites();
  if(collide(fruit,bunny)==true){
    bunny.changeAnimation("eating");
    eatingSound.play();
  }  
  if(collide(fruit,ground.body)==true){
    bunny.changeAnimation("crying");
  }
  if(fruit != null && fruit.position.y>=650){
    bunny.changeAnimation("crying");
    bkSound.stop();
    sadSound.play();
    fruit=null;
  }
}

function drop(){
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutSound.play();
}

function drop2(){
  cutSound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2=null;
}

function drop3(){
  cutSound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3=null;
}
function collide(body,sprite){
  if(body!= null){
    var d= dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=80){
      World.remove(engine.world,fruit);
      fruit=null;
      return true;
    }else{
      return false;
    }
  }
}
function airBlow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  airSound.play();
}
function mute(){
  if(bkSound.isPlaying()){
    bkSound.stop();
  }else{
    bkSound.play();
  }

}
