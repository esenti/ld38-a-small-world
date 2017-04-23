(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 DEBUG = false;
//  DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 popups = [];
 toBoom = 2;
 toToBoom = 3;
 boom = {};

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

 clamp = function(v, min, max) {
     if (v < min) {
         return min;
     } else if (v > max) {
         return max;
     } else {
         return v;
     }
 };

 collides = function(a, b, as, bs) {
     return a.x + as > b.x && a.x < b.x + bs && a.y + as > b.y && a.y < b.y + bs;
 };

 player = {
   x: 0,
   y: 0,
 }



 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     if (!ogre) {
         return window.requestAnimationFrame(tick);
     }
 };

 update = function(delta) {

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }


     if(keysDown[65]) {
         player.x = 0;
     } else if(keysDown[68]) {
         player.x = 1;
     } else if(keysDown[83]) {
         player.y = 1;
     } else if(keysDown[87]) {
         player.y = 0;
     }

    console.log(keysDown)

    toBoom -= delta;
    if(toBoom <= 0) {
        toBoom = toToBoom;

        boom.x = Math.floor(Math.random() * 2);
        boom.y = Math.floor(Math.random() * 2);
        boom.time = 0.7 * toToBoom;
        boom.boom = 2;
    }

    if(boom.boom == 2) {
       boom.time -= delta;
       if(boom.time <= 0) {
            if(boom.x == player.x && boom.y == player.y) {
                ogre = true;
            } else {
                boom.boom = 1;
                boom.time = 0.4;
            }
       }
    } else if(boom.boom == 1) {
       boom.time -= delta;
       if(boom.time <= 0) {
           boom.boom = 0;
       }
    }

    if(Math.random() < 0.02) {
        toToBoom -= 0.1;
    }

    console.log(toToBoom);

 };

 draw = function(delta) {
     ctx.fillStyle = "#FFFFFF";
     ctx.fillRect(0, 0, c.width, c.height);

     if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Sans";
        ctx.fillText(Math.round(fps), 10, 20);
     }

     ctx.fillStyle = "#000000";
     ctx.fillRect(200 - 20, 200 - 20, 100 + 40, 100 + 40);

     ctx.fillStyle = "#FFFFFF";
     ctx.fillRect(200, 200, 100, 100);


     if(boom.boom == 2) {
         if((boom.time * 1000) % 400 > 200) {
             ctx.fillStyle = "#aaaaaa";
         } else {
             ctx.fillStyle = "#ffffff";
         }
         ctx.fillRect(200 + boom.x * 50, 200 + boom.y * 50, 50, 50);
     } else if(boom.boom == 1 || ogre) {
         ctx.fillStyle = "#ffaaaa";
         ctx.fillRect(200 + boom.x * 50, 200 + boom.y * 50, 50, 50);
     }

     if(ogre) {
         ctx.fillStyle = "#ffaaaa";
         ctx.fillRect(200 + player.x * 50, 200 + player.y * 50, 50, 50);
     }

     ctx.fillStyle = "#000000";
     ctx.fillRect(200 + player.x * 50 + 10, 200 + player.y * 50 + 10, 30, 30);

     if(ogre) {
        ctx.fillStyle = "#888888";
        ctx.font = "120px Sans";
        ctx.fillText("¯\_(ツ)_/¯", 60, 260);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }



//  loadImage("meskam");

//  audios["jeb"] = new Audio('sounds/jeb.ogg');
//  audios["ultimate_jeb"] = new Audio("sounds/ultimate_jeb.ogg");

//  loadMusic("melody1");

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 load();

}).call(this);
