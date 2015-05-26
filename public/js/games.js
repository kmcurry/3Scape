$(window).load(function(){
  function makeJewel(){
    var cmd =  "<Model url='objects/cube.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
        cmd += "<color r='0.45' g='0.025' b='0.34' a='1'/>";
        cmd += "<scale x='5' y='5' z='5' />"; 
        cmd += "<position x='0' y='10' z='0' />";  
        cmd += "<physicalProperties>";
        cmd += "<mass>1</mass>";
        cmd += "</physicalProperties>";
        cmd += "</Model>";
    bridgeworks.updateScene(cmd);
  }
  
  function makeCollider(){
    console.log("start collider");
    var cmd =  "<Model name='collider' url='objects/pyramid.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
        cmd += "<color r='0.00' g='0.00' b='0.00' a='1'/>";
        cmd += "<scale x='5' y='5' z='5' />"; 
        cmd += "<position x='-50' y='10' z='0' />";  
        cmd += "<physicalProperties>";
        cmd += "<mass>1</mass>";
        cmd += "</physicalProperties>";
        cmd += "</Model>";
    bridgeworks.updateScene(cmd);
    console.log("end collider");
  }
  
  
  
  function collide(){
    console.log("start collide");
      cmd = "<Update><AnimalMover name='Roaming_collider' target='collider' linearSpeed='1' angularSpeed='10'/>";
      cmd += "<Set target='collider' detectCollision='" + true + "' detectObstruction='true'>";
      cmd += "</Set>"
      cmd += "</Update>";
    bridgeworks.updateScene(cmd);
    console.log("end collide");
  }
  
  makeJewel();
  
  setTimeout(function(){
    makeCollider();
    collide();
  
  }, 1000);
  
});