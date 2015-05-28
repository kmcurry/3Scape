$(window).load(function(){
  function startGame(){
    var allColliders = [];

    function makeJewel(){
      var cmd =  "<Model name='jewel' url='objects/cube.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
          cmd += "<color r='0.45' g='0.025' b='0.34' a='1'/>";
          cmd += "<scale x='5' y='5' z='5' />"; 
          cmd += "<position x='0' y='10' z='0' />";  
          cmd += "<physicalProperties>";
          cmd += "<mass>0.5</mass>";
          cmd += "</physicalProperties>";
          cmd += "</Model>";
      bridgeworks.updateScene(cmd);
    }

    function collide(nameCount){
      console.log("start collide");
        cmd = "<Update><AnimalMover name='Roaming_collider" + nameCount + "' target='collider" + nameCount + "' linearSpeed='1' angularSpeed='15'/>";
        cmd += "<Set target='collider" + nameCount + "' detectCollision='" + true + "' detectObstruction='true'>";
        cmd += "</Set>"
        cmd += "</Update>";
      bridgeworks.updateScene(cmd);
      console.log("end collide");
    }


    function makeCollider(nameCount, xPos, zPos){
      var colliderName = "collider" + nameCount;
      var cmd =  "<Model name='" + colliderName + "' url='objects/pyramid.lwo' moveable='true' opacity='1' selectable='false' physicsEnabled='true' detectCollision='true'>";
          cmd += "<color r='0.00' g='0.00' b='0.00' a='1'/>";
          cmd += "<scale x='5' y='7' z='5' />"; 
          cmd += "<position x='" + xPos + "' y='12' z='" + zPos + "' />";  
          cmd += "<physicalProperties>";
          cmd += "<mass>5</mass>";
          cmd += "</physicalProperties>";
          cmd += "</Model>";
      bridgeworks.updateScene(cmd);
        collide(count);
      console.log(nameCount);
      allColliders.push(colliderName);
      console.log(allColliders);
    }

    function randomNumber(){
      var num = Math.floor(Math.random()*75) + 1; // this will get a number between 1 and 99;
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
  //    console.log(num);
      return num;
    };

    makeJewel();
    var count = 0;
    var placeColliders = setInterval(function(){
      var randomX = randomNumber(),
          randomZ = randomNumber();
      console.log(randomX + " " + randomZ);
      count = count + 1;
      makeCollider(count, randomX, randomZ);
    }, 7000);


    function checkY(partY){
      var partToCheck = bridgeworks.get(partY),
          positionXYZ = partToCheck.position.getValueDirect(),
          positionY = positionXYZ.y;
      return positionY;
    };

    setInterval(function(){
      for (i=0; i < allColliders.length; i++){
        if ( checkY(allColliders[i]) < 0 ){
          var c = "\<Remove target='" + allColliders[i] + "'/>"
          bridgeworks.updateScene(c);
          allColliders.splice(i, 1);
        }
      };
      if ( checkY("jewel") < 0 ){
          $(".loseMessage").addClass("lose");
          clearInterval(handel);
        }
    }, 7000);
  };
  startGame();
    $(".loseMessage button, .winnerMessage button").click(function(){
      bridgeworks.contentDir = '/BwContent';
      bridgeworks.onLoadModified();
      bridgeworks.updateScene('AdventureTime.xml');
      $(".loseMessage").removeClass("lose");
      $(".winnerMessage").removeClass("winner");
      startGame();
    });

});