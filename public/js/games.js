$(window).load(function(){
  var blueCubesCount = 100,
      blueCubesSize = 1,
      blueCubesStart = {x:"0", y:"10", z:"0"},
      blueCubesEnd = {x:"50", y:"10", z:"50"},
      cubePosition = {x:"", y:"", z:""},
      positionArray = [],
      c = 0,
      color = {r:"0.55", g:"0.025", b:"0.50", a:"1"},  
      newStart="";
      
  function makeCube(num, size, color, position){
    var cmd =  "<Model name ='cube'" + c + "url='objects/cube.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
        cmd += "<color r='" + color.r + "' g='" + color.g + "' b='" + color.b + "' a='" + color.a + "'/>";
        cmd += "<scale x='" + size + "' y='" + size + "' z='" + size + "' />"; 
        cmd += "<position x='" + cubePosition.x + "' y='" + cubePosition.y + "' z='" + cubePosition.z + "' />";  
        cmd += "<physicalProperties>";
        cmd += "<mass>0</mass>";
        cmd += "</physicalProperties>";
        cmd += "</Model>";
        c = c++;
    bridgeworks.updateScene(cmd);
  }
  
  function cubeParams(count, size, start, end){
   
    for (i = 0; i < count; i++) { 
       console.log("start of loop= "+ start.x);
      if (cubePosition.x < end.x){
        cubePosition.x = start.x;
        cubePosition.y= start.y;
        cubePosition.z = start.z;
      }
      start.x = parseInt(start.x) + size;
      console.log("end of loop= "+ start.x);
      positionArray.push(cubePosition);
    }
  };

  cubeParams(blueCubesCount, blueCubesSize, blueCubesStart, blueCubesEnd);
  console.log(positionArray);
  makeCube(blueCubesCount, blueCubesSize, color, positionArray[i]);
});