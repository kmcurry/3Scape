$(window).load(function(){
  var blueCubesCount = 50,
      blueCubesSize = 1,
      blueCubesStart = 0,
      blueCubesEnd = 50,
      positionX = "",
      positionY = "",
      positionZ = "";
      var newStart="";
      
  function makeCube(num, size, cubeR, cubeG, cubeB, cubeA, position){
    var cmd =  "<Model url='objects/cube.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
        cmd += "<color r='" + cubeR + "' g='" + cubeG + "' b='" + cubeB + "' a='" + cubeA + "'/>";
        cmd += "<scale x='" + size + "' y='" + size + "' z='" + size + "' />"; 
        cmd += "<position x='" + positionX + "' y='" + positionY + "' z='" + positionZ + "' />";  
        cmd += "<physicalProperties>";
        cmd += "<mass>0</mass>";
        cmd += "</physicalProperties>";
        cmd += "</Model>";
    bridgeworks.updateScene(cmd);
  }
  
  function cubePosition(count, size, start, end){
    
    for (i = 0; i < count; i++) { 
      

      if (positionX < end){
          positionX = newStart;
          positionY = size + 10;
          positionZ = start;
          newStart = start + size;
        console.log(cubePosition[i]);
      }
      else{
          positionX = newStart;
          positionY = size + 10;
          positionZ = size;
         newStart = start+size;
      }
    }
  };
  
  for(i=0; i< blueCubesCount; i++){
  makeCube(50, 5, 0.2, 0.5, 0.2, 1, cubePosition(blueCubesCount, blueCubesSize, blueCubesStart, blueCubesEnd));
  }
  
});