//var gl = new WebGL2RenderingContext(); //enable WebGL 2 partial support

var images = {};
var bpm=120;
var beat = 60/bpm;
var tick= beat/8;
var pattern = 8*beat;
var fftImage = new Image();
var cScaler = 0.0012;
var spiralHeight = 127.979;

Demo.prototype.init = function()
{
  const settings = new Settings();
  settings.demo.sync.rocketFile = 'sync/fallofman.rocket';
  settings.demo.sync.mandatory = true;
  settings.demo.sync.beatsPerMinute = 120;
  settings.demo.sync.rowsPerBeat = 8;

  settings.demo.compatibility.old2dCoordinates = true; // when true 2d coordinates x: 0 - 1920, y: 0 - 1080; when false 2d coordinates are -0.5 - 0.5 range
  settings.demo.compatibility.oldColors = false; // when true colors are in 0-255 range, when false colors are in 0-1 range
  settings.demo.image.texture.wrapS = 'RepeatWrapping';
  settings.demo.image.texture.wrapT = 'RepeatWrapping';
  settings.demo.lights = [
    {
      type: 'Ambient',
      color: { r: 1.0, g: 1.0, b: 1.0 },
      intensity: 5.0,
    },
    {
      type: 'Directional',
      castShadow: true,
      color: { r: 1.0, g: 1.0, b: 1.0 },
      intensity: 1.0,
      position: { x: 0.0, y: 1.0, z: 2.0 },
    }
  ];

  var start = 0;
  var duration = 60*20;

  this.createFBO(0,999,"fbo0");
  this.createFBO(1001,1999,"fbo1");
  this.createFBO(2001,2999,"fbo2");
  this.createFBO(10000,20000,"fboPost");
  
  this.generateImages(32.0);
  this.dollarBG(44,16,0);
  this.dollarBG(60,16,1000);
  this.generateCapitalism(60.0);
  
  this.mengerBG(80,34.5);
  this.farjanScene(73,10);
  this.man();
  this.manEnd(82.5);	
  this.farjanIntersection(80.5);
  this.allseeing(80.5,2,0.0,.6);
  this.blood(98.5,1.2,965,540);
  this.chain1(98.5,50,0.0);
  this.blood(102.5,1.2,965,540);
  this.chain2(102.5,50,0.0);
  this.blood(106.5,1.2,965,540);
  this.chain3(106.5,50,0.0);
  this.blood(110.5,1.2,965,540);	
  this.chain4(110.5,50,0.0);
  this.generateBlood(114.5);
  this.spirals(114.5,32);
  this.allseeingEnd(114.5,30,.75,.4);
  this.blood(127,1.5,1000,480);
  this.blood(127,1.5,1050,560);
  this.blood(127,1.5,850,430);
  for(var k=0;k<2;k++)
  {
    for(let i=0;i<4;i++)
    {
      this.missile(44+i*pattern,beat, 1520*Math.random()+200, 400+Math.random()*500, true);
      this.missile(44+i*pattern+beat*1.5,beat, 1520*Math.random()+200, 400+Math.random()*500, true);
      this.missile(44+i*pattern+beat*3.0,beat, 1520*Math.random()+200, 400+Math.random()*500, true);
    } 
  }

  this.loader.addAnimation([{
         "start": 0, "duration":200
        ,"layer": 52800, "image": ["tex_vignette.png"]
    ,"scale":[{"x":1.5,"y":1.5}]
    ,"position":[{"x":960,"y":540}]
    ,"color":[{"r":1.0, "g":1.0,"b":1.0,"a":0.61}]
  }]);
  
  this.loader.addAnimation([{
         "start": 0, "duration":4
        ,"layer": 2800, "image": ["white.png"]
    ,"scale":[{"x":18.5,"y":18.5}]
    ,"position":[{"x":960,"y":540}]
    ,"color":[{"r":0, "g":0,"b":0,"a":1.0}
    ,{"duration":4,"a":0}]
  }]);
  
  this.loader.addAnimation([{
         "start": 0, "duration":32
        ,"layer": 100, "image": ["white.png"]
    ,"scale":[{"x":18.5,"y":18.5}]
    ,"position":[{"x":960,"y":540}]
    ,"angle":[{"degreesZ":-5.0}]
    ,"shader":{
      "name":"cube_bg.fs",
      "variable":
      [
        {"name":"timeMultiplier","type":"float","value":[1.0]},
        {"name":"invert","type":"float","value":[0.0]}
      ]
    }
  }]);
  this.loader.addAnimation([{
         "start": 32, "duration":32
        ,"layer": 1100, "image": ["white.png"]
    ,"scale":[{"x":18.5,"y":18.5}]
    ,"position":[{"x":960,"y":540}]
    ,"angle":[{"degreesZ":-5.0}]
    ,"shader":{
      "name":"cube_bg.fs",
      "variable":
      [
        {"name":"timeMultiplier","type":"float","value":[4.0]},
        {"name":"invert","type":"float","value":[1.0]}
      ]
    }
  }]);
  

  
  this.loader.addAnimation([{
         "start": 16, "duration":17
        ,"layer": 500, "image": ["tex_eye.png"]
    ,"object":"obj_eyecubes.obj"
    ,"scale":[{"uniform3d":.5}]
    ,"position":[{"x":0,"y":-37,"z":-2}
      ,{"duration":17,"y":15.5}]
    ,"angle": [{"degreesY":()=>15.0*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": 16, "duration":17
        ,"layer": 500, "image": ["tex_eye.png"]
    ,"object":"obj_eyecubes.obj"
    ,"scale":[{"uniform3d":.75}]
    ,"position":[{"x":-5,"y":-60,"z":-12}
      ,{"duration":17,"y":15.5}]
    ,"angle": [{"degreesY":()=>180.0-15*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);


  this.loader.addAnimation([{
         "start": 16, "duration":17
        ,"layer": 500, "image": ["tex_eye.png"]
    ,"object":"obj_eyecubes.obj"
    ,"scale":[{"uniform3d":.75}]
    ,"position":[{"x":5,"y":-60,"z":-12}
      ,{"duration":17,"y":15.5}]
    ,"angle": [{"degreesY":()=>90.0+15*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);	
  
  this.loader.addAnimation ([{
     "start": 0, "duration": 8888
    ,"image": ["fbo0.color.fbo"]
    ,"layer": 10100
    ,"position":[{"x":getScreenWidth()*.5,"y":getScreenHeight()*.5}]
    ,"shader":{
      "fader":0.5, 
      "name":"updownfader.fs",
      "variable":
      [
        {"name":"upfadeval","type":"float","value":[()=>Sync.get('upfade2')]},
        {"name":"downfadeval","type":"float","value":[()=>Sync.get('downfade2')]}
      ]
      }
  }]);
    
    this.loader.addAnimation ([
    {
     "start": 0, "duration": 8888
    ,"image": ["fbo1.color.fbo"]
    ,"layer": 11000
    ,"position":[{"x":getScreenWidth()*.5,"y":getScreenHeight()*.5}]
    ,"shader":{
      "fader":0.5, 
      "name":"updownfader.fs",
      "variable":
      [
        {"name":"upfadeval","type":"float","value":[()=>Sync.get('upfade1')]},
        {"name":"downfadeval","type":"float","value":[()=>Sync.get('downfade1')]}
      ]
      }
    }]);
    
    this.loader.addAnimation ([
    {
     "start": 0, "duration": 8888
    ,"image": ["fbo2.color.fbo"]
    ,"color":[{"a":()=>Sync.get('fbo2alpha')/255}]
    ,"layer": 12000
    ,"scale":[{"uniform3d":1.0}
    ,{"duration":76,"uniform3d":1.0}
    ,{"duration":6.5,"uniform3d":1.75}
    ,{"duration":0,"uniform3d":1.0}]
    ,"position":[{"x":getScreenWidth()*.5,"y":getScreenHeight()*.5}
    ,{"duration":76,"y":getScreenHeight()*.5}
    ,{"duration":6.5,"y":getScreenHeight()*(550/720)}
    ,{"duration":0,"y":getScreenHeight()*.5}]
  }]);
  
  this.loader.addAnimation ([
  {
     "start": 0, "duration": 8888
    ,"image": ["fboPost.color.fbo"]
    ,"layer": 32000
    ,"scale":[{"uniform3d":1.0}]
    ,"position":[{"x":()=>(getScreenWidth()*.5)+(Math.random()*Sync.get('explosion'))-0.5*Sync.get('explosion'),"y":()=>(getScreenHeight()*.5)+(Math.random()*Sync.get('explosion'))-0.5*Sync.get('explosion'),}]
    ,"shader":{
      "fader":0.5, 
      "name":"hackglow.fs",
      "variable":
      [
        {"name":"multiplier","type":"float","value":[()=>Sync.get('glowmultiplier')]}
      ]
      }
  }]);
  
}


Demo.prototype.spirals = function (startTime, duration)
{

  this.loader.addAnimation ([{
     "start": startTime, "duration": duration
    ,"image": ["tex_scanline.png"]
    ,"scale":[{"uniform3d":5.5}]
    ,"layer": 101
    ,"color":[{"r":0,"g":0,"b":0,"a":0.29}]

  }]);
  
  this.loader.addAnimation ([{
     "start": startTime, "duration": duration
    ,"image": ["tex_skulls.png"]
    ,"scale":[{"uniform3d":2.5}]
    ,"layer": 100
    ,"shader":{
      "name":"starfield.fs",
      "variable":
      [

      ]
    }
  }]);
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":3.0}]
      ,"position":[{"x":0,"y":()=>-100+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-43}]	
    ,"angle": [{"degreesY":()=>180+25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":3.0}]
      ,"position":[{"x":0,"y":()=>-100+-255.958+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-43}]	
    ,"angle": [{"degreesY":()=>180+25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":3.0}]
      ,"position":[{"x":0,"y":()=>-100+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-53}]	
    ,"angle": [{"degreesY":()=>25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":3.0}]
      ,"position":[{"x":0,"y":()=>-100+-255.958+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-53}]	
    ,"angle": [{"degreesY":()=>25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":2.0}]
      ,"position":[{"x":55,"y":()=>-100+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-118}]	
    ,"angle": [{"degreesY":()=>-25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":2.0}]
      ,"position":[{"x":55,"y":()=>-100+-255.958+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-118}]	
    ,"angle": [{"degreesY":()=>-25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);

    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":2.0}]
      ,"position":[{"x":-55,"y":()=>-100+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-118}]	
    ,"angle": [{"degreesY":()=>25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_spiral.png"]
    ,"object":"obj_spiral.obj"
    ,"scale":[{"uniform3d":2.0}]
      ,"position":[{"x":-55,"y":()=>-100+-255.958+255.958*(0.125*getSceneTimeFromStart()%1.0),"z":-118}]	
    ,"angle": [{"degreesY":()=>25*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"uvscroll.fs",
      "variable":
      [
        {"name":"time","type":"float","value":[()=>getSceneTimeFromStart()]}
      ]
    }
  }]);
  
}

Demo.prototype.createFBO = function (startLayer, endLayer, name)
{
     this.loader.addAnimation ([
  {
    "start": 0, "duration": 99999
    ,"layer": startLayer
    ,"fbo":{"name":name,"action":"begin","storeDepth":true}
  }
  ]);
  
  this.loader.addAnimation ([
  {
    "start": 0, "duration": 99999
    ,"layer": endLayer,"fbo":{"name":name,"action":"unbind"}
  }
  ]);
  
}

Demo.prototype.missile = function (startTime, duration, posX, posY, explo)
{
   
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 12100,
    "image": ["tex_missile.png"]
    ,"scale":[{"uniform3d":8.25}
    ,{"duration":duration, "uniform3d":1.25}]
    ,"position":[{"x":posX,"y":-120}
    ,{"duration":duration, "y":posY}]
    ,"color":[{"r":1.0,"g":0,"b":0,"a":1.0}]
  }]);
  if(explo)
  {
    this.explosion(startTime+duration,2.0,posX,posY);
  }
}

Demo.prototype.explosion = function(startTime, duration, positionX, positionY)
{
  var randomScaler=722.0;
  for(let ie=0;ie<25;ie++)
  {
    this.loader.addAnimation([
        {
        "start": startTime, "duration": duration
        ,"layer": 12100
        ,"image": ["tex_explosion.png"]
            ,"angle":[{"degreesZ":Math.random()*360}]
        ,"position": [{"x":positionX,"y":positionY,}
        ,{"duration":duration,"x":positionX-randomScaler+Math.random()*randomScaler*2.0,"y":positionY-randomScaler+Math.random()*randomScaler*2.0}]
        ,"scale":[{"uniform3d":1.8}
        ,{"duration":duration, "uniform3d":0.0}]
        ,"color":[{"r":1.0,"g":0,"b":0,"a":1.0}]
    }]);
  }
}

Demo.prototype.generateBlood = function(startTime)
{
  var bloodSyncs = [8,20,32]
  for(let k=0;k<3;k++)
  {
    for(let i=0;i<bloodSyncs.length;i++)
    {
      this.blood(startTime+k*pattern+bloodSyncs[i]*tick,2.0,1000,480);		
    }
  }
}

Demo.prototype.blood = function(startTime, duration, positionX, positionY)
{

  var randomScaler=722.0;
  for(let ie=0;ie<35;ie++)
  {
    this.loader.addAnimation([
        {
        "start": startTime, "duration": duration
        ,"layer": 12100
        ,"image": ["tex_blood.png"]
        ,"angle":[{"degreesZ":Math.random()*360}]
        ,"position": [{"x":positionX,"y":positionY,}
        ,{"duration":duration,"x":positionX-randomScaler+Math.random()*randomScaler*2.0,"y":positionY-randomScaler*.75+Math.random()*randomScaler*1.5}]	
        ,"scale":[{"uniform3d":0.75}
        ,{"duration":duration, "uniform3d":0.0}]
        ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    }]);
  }
}

Demo.prototype.dollarBG = function(startTime, duration, layer)
{
    this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": layer+500, "image": ["tex_dollar.png"]

    ,"scale":[{"uniform3d":()=>1.75+Sync.get('dollarBGScale')}]
    ,"position":[{"x":960,"y":540,"z":0}]

    ,"shader":{
      "name":"glitch.fs",
      "variable":
      [
        
        {"name":"amt","type":"float","value":[()=>Sync.get('insanity')]},
        {"name":"scrollspeed","type":"float","value":[1.0]},
      ]
    }
  }]);
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": layer+300, "image": ["tex_dollar.png"]

    ,"scale":[{"uniform3d":2.75}]
    ,"position":[{"x":960,"y":540,"z":0}]

    ,"shader":{
      "name":"glitch.fs",
      "variable":
      [
        
        {"name":"amt","type":"float","value":[()=>Sync.get('insanity')]},
        {"name":"scrollspeed","type":"float","value":[1.0]},
      ]
    }
  }]);
  
}

Demo.prototype.mengerBG = function(startTime, duration)
{
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":duration
        ,"layer": 100, "image": ["white.png"]
    ,"scale":[{"x":18.5,"y":18.5}]
    ,"position":[{"x":960,"y":540}]
    ,"angle":[{"degreesZ":-5.0}]
    ,"shader":{
      "name":"menger_bg.fs",
      "variable":
      [
        {"name":"timeMultiplier","type":"float","value":[1.0]},
        {"name":"invert","type":"float","value":[0.0]},
        {"name":"rotation","type":"float","value":[()=>Sync.get('mengerrotate')]},
        {"name":"rotation2","type":"float","value":[()=>Sync.get('mengerrotate2')]},
        {"name":"rotation3","type":"float","value":[()=>Sync.get('mengerrotate3')]},
        {"name":"speed","type":"float","value":[()=>Sync.get('mengerspeed')]},
        {"name":"MAX_STEPS","type":"float","value":[()=>Sync.get('mengersteps')]},
        {"name":"mengerdivisor","type":"float","value":[()=>Sync.get('mengerdivisor')]}
      ]
    }
  }]);
}

Demo.prototype.farjanScene = function(startTime, duration)
{
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":3.0
        ,"layer": 98, "image": ["white.png"]  //FIXME 098 -> 98???
    
    ,"scale":[{"x":20.0,"y":20.0}]
    ,"position":[{"x":960,"y":540}]

    ,"shader":{
      "name":"clouds.fs",
      "variable":
      [
        {"name":"timeMultiplier","type":"float","value":[1.0]},
        {"name":"invert","type":"float","value":[0.0]},
        {"name":"speed","value":[0.0]},
        {"name":"speedY","value":[0.3]},
        {"name":"video","value":[0.0]},
        {"name":"value1","value":[1.0]},
        {"name":"value2","value":[0.5]},
        {"name":"value3","value":[2.0]},
        {"name":"value4","value":[2.0]},
        {"name":"contrast","value":[0.025]},
        {"name":"alpha","value":[1.0]},
        {"name":"color","value":[1,1,1,1]},
      ]
    }
  }]);

  this.loader.addAnimation([
    {
         "start": startTime+3.0, "duration":duration-5.5
        ,"layer": 2098, "image": ["white.png"]
  
    ,"scale":[{"x":20.0,"y":20.0}]
    ,"position":[{"x":960,"y":540}]
    ,"shader":{
      "name":"clouds.fs",
      "variable":
      [
        {"name":"timeMultiplier","type":"float","value":[1.0]},
        {"name":"invert","type":"float","value":[0.0]},
        {"name":"speed","value":[0.0]},
        {"name":"speedY","value":[0.3]},
        {"name":"video","value":[0.0]},
        {"name":"value1","value":[1.0]},
        {"name":"value2","value":[0.5]},
        {"name":"value3","value":[2.0]},
        {"name":"value4","value":[2.0]},
        {"name":"contrast","value":[0.025]},
        {"name":"alpha","value":[1.0]},
        {"name":"color","value":[1,1,1,1]},
      ]
    }
  }]);
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":duration-2.5
        ,"layer": 2100, "image": ["tex_wave.png"]
    ,"scale":[{"x":4.5,"y":4.5}]
    ,"position":[{"x":960,"y":-420}
    ,{"duration":4.75, "y":-120}]
    ,"color":[{"r":0,"g":1.0,"b":1.0,"a":1.0}]
    ,"shader":{
      "name":"wavescroll.fs",
    }
  }]);
  
  this.loader.addAnimation([
    {
         "start": startTime+3, "duration":duration-5.5
        ,"layer": 2099, "image": ["tex_boat.png"]
    ,"scale":[{"x":1.0,"y":1.0}]
    ,"angle":[{"degreesZ":()=>5.0*Math.sin(2*getSceneTimeFromStart())}]
    ,"position":[{"x":-175,"y":()=>160+25.0*Math.sin(4*getSceneTimeFromStart())}
    ,{"duration":4.65, "x":960,"y":()=>230+25.0*Math.sin(4*getSceneTimeFromStart())}]
    ,"color":[{"r":1.0,"g":0,"b":0,"a":1.0}]

  }]);
}

Demo.prototype.man = function()
{
  
  this.loader.addAnimation([{
         "start": 0, "duration":80.5
        ,"layer": 2300, "image": ["tex_man.png"]
    ,"scale":[{"uniform3d":0.75}
    ,{"duration":75, "uniform3d":0.75}
    ,{"duration":1, "uniform3d":0.15}]
    ,"position":[{"x":960,"y":()=>540+8*Math.sin(5*getSceneTimeFromStart()), "z":1}
    ,{"duration":75, "y":()=>540+3*Math.sin(1.5+5*getSceneTimeFromStart())}
    ,{"duration":1, "y":()=>831+3*Math.sin(1.5+5*getSceneTimeFromStart())}
    ,{"duration":4.75, "y":()=>240}]
    ,"angle":[{"degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":75, "degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":1, "degreesZ":()=>5.0*Math.sin(2*getSceneTimeFromStart())}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}
    ,{"duration":32,"r":1.0,"g":1.0,"b":1.0}
    ,{"duration":0,"r":0,"g":0,"b":0}]
    
  }]);

  this.loader.addAnimation([{
         "start": 0, "duration":80.5
        ,"layer": 2250, "image": ["tex_man.png"]
    ,"scale":[{"uniform3d":0.75}
    ,{"duration":75, "uniform3d":0.75}
    ,{"duration":1, "uniform3d":0.25}]
    ,"position":[{"x":960,"y":()=>531+3*Math.sin(1.5+5*getSceneTimeFromStart()), "z":1}
    ,{"duration":75, "y":()=>531+3*Math.sin(1.5+5*getSceneTimeFromStart())}
    ,{"duration":1, "y":()=>822+3*Math.sin(1.5+5*getSceneTimeFromStart())}]
    ,"color":[{"r":0,"g":0,"b":0,"a":1.0}
    ,{"duration":32,"r":0,"g":0,"b":0}
    ,{"duration":0,"r":1.0,"g":1.0,"b":1.0}
    ,{"duration":43,"a":1.0}
    ,{"duration":1,"a":0}]
    ,"angle":[{"degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":75, "degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":1, "degreesZ":()=>5.0*Math.sin(2*getSceneTimeFromStart())}]

  }]);
}
  
Demo.prototype.allseeing = function(startTime, duration, yPos, scale)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_allseeing.png"]
    ,"object":"obj_allseeing.obj"
    ,"position":[{"x":0,"y":yPos,"z":0}]
    ,"scale":[{"uniform3d":scale}]
    ,"angle": [{"degreesY":()=>-20*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
}

Demo.prototype.allseeingEnd = function(startTime, duration, yPos, scale)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_allseeing.png"]
    ,"object":"obj_allseeing.obj"
    ,"position":[{"x":0,"y":()=>.73+0.05*Math.sin(3*getSceneTimeFromStart()),"z":0}]
    ,"scale":[{"uniform3d":scale}]
    ,"angle": [{"degreesY":()=>-20*getSceneTimeFromStart(),"degreesZ":0,"degreesX":0}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
  
  this.loader.addAnimation([
    {
         "start": startTime+13, "duration":32
        ,"layer": 2800, "image": ["white.png"]
    ,"scale":[{"x":18.5,"y":18.5}]
    ,"position":[{"x":960,"y":540}]
    ,"color":[{"r":1.0, "g":0,"b":0,"a":0}
    ,{"duration":5,"a":1.0}]
  }]);
  
  this.createText(startTime+19.5,22.8,"FALL OF MAN",5.0,250);
  this.createText(startTime+21.5,22.8,"A tragedy in three parts",3.0,0);
  this.createText(startTime+23.5,22.8,"JUMALAUTA 2024",5.0,-330);
  

}

Demo.prototype.chain1 = function(startTime, duration,yPos)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_chain.png"]
    ,"object":"obj_chain.obj"
    ,"position":[{"chainScaler":cScaler,"x":(animation)=>0.1+Sync.get('endX')*animation.chainScaler,"y":(animation)=>0.0+Sync.get('endY')*animation.chainScaler,"z":1}]
    ,"scale":[{"uniform3d":0.050}]
    ,"angle": [{"degreesX":45.0,"degreesY":()=>45*Sync.get('chainangle'),"degreesZ":()=>45*getSceneTimeFromStart()}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
}

Demo.prototype.chain2 = function(startTime, duration,yPos)
{
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_chain.png"]
    ,"object":"obj_chain.obj"
    ,"position":[{"chainScaler":cScaler,"x":(animation)=>0.1+Sync.get('endX')*animation.chainScaler,"y":(animation)=>0.0+Sync.get('endY')*animation.chainScaler,"z":1}]
    ,"scale":[{"uniform3d":0.050}]
    ,"angle": [{"degreesX":-45,"degreesY":()=>-45*Sync.get('chainangle'),"degreesZ":()=>45*getSceneTimeFromStart()}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
}

Demo.prototype.chain3 = function(startTime, duration,yPos)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_chain.png"]
    ,"object":"obj_chain.obj"
    ,"position":[{"chainScaler":cScaler,"x":(animation)=>0.1+Sync.get('endX')*animation.chainScaler,"y":(animation)=>0.0+Sync.get('endY')*animation.chainScaler,"z":1}]
    ,"scale":[{"uniform3d":0.050}]
    ,"angle": [{"degreesX":45.0,"degreesY":()=>270+45*Sync.get('chainangle'),"degreesZ":()=>-45*getSceneTimeFromStart()}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
}

Demo.prototype.chain4 = function(startTime, duration,yPos)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":duration
        ,"layer": 200, "image": ["tex_chain.png"]
    ,"object":"obj_chain.obj"
    ,"position":[{"chainScaler":cScaler,"x":(animation)=>0.1+Sync.get('endX')*animation.chainScaler,"y":(animation)=>0.0+Sync.get('endY')*animation.chainScaler,"z":1}]
    ,"scale":[{"uniform3d":0.050}]
    ,"angle": [{"degreesX":-45,"degreesY":()=>90-45*Sync.get('chainangle'),"degreesZ":()=>45*getSceneTimeFromStart()}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]	
  }]);
}

Demo.prototype.generateImages = function(startTime)
{
  var imageSyncs = [0,4,8,10,14,16,20,24]
  var imageNames = ["tex_ak.png", "tex_choppa.png", "tex_mp5.png", "tex_tank.png", "tex_grenade.png", "tex_launcher.png", "tex_carrier.png", "tex_bomb.png"]
  var imageScales = [1.3,         1.25,              0.85,           1.0,            0.6,               1.0,                1.25,               0.9]
  var prevRandom=100;
  for(let k=0;k<6;k++)
  {
    for(let i=0;i<imageSyncs.length;i++)
    {
      var randomImage = Math.floor(Math.random()*imageNames.length);
      
      if(randomImage==prevRandom)
      {
        randomImage++;
      }
      if(randomImage>=imageNames.length)
      {
        randomImage=0;
      }
      
      this.image(startTime+k*pattern*.5+imageSyncs[i]*tick, imageNames[randomImage], 1700,imageScales[randomImage],10.5);
      
      prevRandom=randomImage;
          
    }
  }
}

Demo.prototype.generateCapitalism = function(startTime)
{
  var imageSyncs2 = [0,8,16,24,32,40,48,56];
  var imageSyncs3 = [0,8,16,24,32,40,48,56];
  var imageNames = ["tex_tv.png", "tex_washingmachine.png", "tex_computer.png", "tex_phone.png", "tex_car.png", "tex_hamburger.png", "tex_hifi.png"];
  var imageScales = [0.81,         0.65,                      0.85,               0.9,             1.1,           0.8,                1.25]	
  var prevRandom=100;
  for(var k=0;k<3;k++)
  {
    for(let i=0;i<imageSyncs2.length;i++)
    {			
      var randomImage = Math.floor(Math.random()*imageNames.length);
      
      if(randomImage==prevRandom)
      {
        randomImage++;
      }
      if(randomImage>=imageNames.length)
      {
        randomImage=0;
      }
        
      this.imageCapitalism(startTime+k*pattern+imageSyncs2[i]*tick, imageNames[randomImage],1700, imageScales[randomImage], 45);
      
      prevRandom=randomImage;
    }
  }
  
  for(let i=0;i<imageSyncs3.length;i++)
  {
      var randomImage = Math.floor(Math.random()*imageNames.length);
      
      if(randomImage==prevRandom)
      {
        randomImage++;
      }
      if(randomImage>=imageNames.length)
      {
        randomImage=0;
      }

    this.imageCapitalism(startTime+k*pattern+imageSyncs3[i]*tick, imageNames[randomImage],1700, imageScales[randomImage],45);
    
      prevRandom=randomImage;
  }
    
}

Demo.prototype.image = function(startTime, imageName, layer, scale, angleRandom)
{
  var posX=300+(1920-600)*Math.random();
  var invertX = 1;
  if(posX<(1920/2))
  {
    invertX=-1;
  }
  this.loader.addAnimation([
    {
         "start": startTime, "duration":1.0
        ,"layer": layer, "image": ["" + imageName]
    ,"angle":[{"degreesZ":Math.random()*angleRandom*2-angleRandom}]
    ,"position":[{"x":posX,"y":-256}
    ,{"duration":1.0, "y":1280+256}]
    ,"scale":[{"x":1.5*invertX*scale,"y":1.5*scale}]
    ,"color":[{"r":0,"g":0,"b":0,"a":1.0}]
  }]);
}

Demo.prototype.imageCapitalism = function(startTime, imageName, layer, scale)
{
  var posX=300+(1920-600)*Math.random();
  var invertX = 1;
  if(posX<(1920/2))
  {
    invertX=-1;
  }
  var randoScale = .9+Math.random()*.1;
  var randoAngle = Math.random()*40*2-40;
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":1.0
        ,"layer": layer, "image": ["" + imageName]
    ,"angle":[{"rAngle":randoAngle, "degreesZ":(animation)=>animation.rAngle+12.0*Math.sin(2*getSceneTimeFromStart())}]
    ,"position":[{"x":posX,"y":-256}
    ,{"duration":1.0, "y":1280+256}]
    ,"scale":[{"x":1.5*invertX*scale*randoScale,"y":1.5*scale*randoScale}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
  }]);
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":1.0
        ,"layer": layer-1, "image": ["" + imageName]
    ,"angle":[{"rAngle":randoAngle, "degreesZ":(animation)=>animation.rAngle+12.0*Math.sin(2*getSceneTimeFromStart())}]
    ,"position":[{"x":posX,"y":-256}
    ,{"duration":1.0, "y":1280+256}]
    ,"scale":[{"x":1.1*1.5*invertX*scale*randoScale,"y":1.1*1.5*scale*randoScale}]
    ,"color":[{"r":0,"g":0,"b":0,"a":1.0}]
  }]);
  
}

Demo.prototype.manEnd = function(startTime)
{
  
  this.loader.addAnimation([{
         "start": startTime, "duration":44.5
        ,"layer": 2300, "image": ["tex_man.png"]
    ,"scale":[{"uniform3d":0.75}]
    ,"angle":[{"degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":26.0, "degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":1.0, "degreesZ":()=>Sync.get('manEndRot')}]
    ,"position":[{"x":()=>Sync.get('endX')+960,"y":()=>Sync.get('endY')+540, "z":1}]
    ,"color":[{"r":()=>Sync.get('manEndCol')/255,"g":()=>Sync.get('manEndCol')/255,"b":()=>Sync.get('manEndCol')/255,"a":1.0}]
  }]);

  this.loader.addAnimation([{
         "start": startTime, "duration":44.5
        ,"layer": 2250, "image": ["tex_man.png"]
    ,"scale":[{"uniform3d":0.75}
    ,{"duration":75, "uniform3d":0.75}
    ,{"duration":1, "uniform3d":0.25}]
    ,"position":[{"x":()=>Sync.get('endX')+960,"y":()=>Sync.get('endY')+531+3*Math.sin(1.5+5*getSceneTimeFromStart()), "z":1}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
    ,"angle":[{"degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":26.0, "degreesZ":()=>2.0*Math.sin(6*getSceneTimeFromStart())}
    ,{"duration":1.0, "degreesZ":()=>Sync.get('manEndRot')}]
  }]);
}
Demo.prototype.farjanIntersection = function(startTime)
{
  this.loader.addAnimation([
    {
         "start": startTime, "duration":2.0
        ,"layer": 2300, "image": ["tex_man_outline.png"]
    ,"position":[{"x":960,"y":370}]
    ,"angle":[{"degreesZ":()=>Sync.get('mangle')}]
    ,"scale":[{"uniform3d":.8}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
  }]);
  
  this.loader.addAnimation([
    {
         "start": startTime, "duration":2.0
        ,"layer": 2300, "image": ["tex_boat_outline.png"]
    ,"position":[{"x":960,"y":370}]
    ,"angle":[{"degreesZ":()=>Sync.get('farjangle')}]
    ,"scale":[{"uniform3d":1.8}]
    ,"color":[{"r":1.0,"g":1.0,"b":1.0,"a":1.0}]
  }]);
  
    this.loader.addAnimation([
    {
         "start": startTime, "duration":2.0
        ,"layer": 2098, "image": ["white.png"]
    ,"scale":[{"x":20.0,"y":30.0}]
    ,"position":[{"x":960,"y":340}]
    ,"shader":{
      "name":"starfield.fs",
      "variable":
      [

      ]
    }
  }]);
}

Demo.prototype.createText = function (startTime, duration, textString, scale,yPos)
{
       this.loader.addAnimation([{
    "start": startTime, "duration": duration ,"layer": 2850,			
    "text":
    {
      "string":textString
      ,"name":"font.ttf"
    }
    ,"scale":[{"uniform3d":scale}]
    ,"position":[{"x":960,"y":540+yPos,"z":1}		]
    ,"angle":[{"degreesZ":0}]
    ,"color":[{"r":0,"g":0,"b":0}]
  }]);
}
