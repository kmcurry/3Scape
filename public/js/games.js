$(window).load(function(){
  
  // ----------- MAKE TIMER --------------
  var handle;
	var clock = $('#clock');
	var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
	var digits = {};
	var positions = [
		'm1', 'm2', ':', 's1', 's2'
	];
	var digit_holder = clock.find('.digits');

	$.each(positions, function(){

		if(this == ':'){
			digit_holder.append('<div class="dots">');
		}
		else{
      
			var pos = $('<div>');

			for(var i=1; i<8; i++){
        console.log("for loop works");
				pos.append('<span class="d' + i + '">');
			}
			digits[this] = pos;
			digit_holder.append(pos);
		}
	});
  
  //Check time - if 2 minutes stop timer and display Win message
  

	// Run a timer every second and update the clock

  function runTimer(){
    var now = moment().startOf('hour');
    function update_time(){
      var formatted = now.format("mmss");
      digits.m1.attr('class', digit_to_name[formatted[0]]);
      digits.m2.attr('class', digit_to_name[formatted[1]]);
      digits.s1.attr('class', digit_to_name[formatted[2]]);
      digits.s2.attr('class', digit_to_name[formatted[3]]);
      now = now.add(1, 's');
//      checkTime();
    };
    handle = setInterval(update_time, 1000);
  };
  
//  $(".startGame button").click(function(){
//    $(".startGame").removeClass("winner");
//    runTimer();
//  });
//  
//  $(".loseMessage button, .winnerMessage button").click(function(){
//    clearInterval(handle);
//    runTimer();
//  });
  
  
  // ------------ START GAME ----------------
  
  function startGame(){
    var allColliders = [];
    var count = 0;

    function makeJewel(xPos, zPos){
      var cmd =  "<Model name='jewel' url='objects/jewel.lwo' moveable='true' opacity='1' selectable='true' physicsEnabled='true' detectCollision='true'>";
          cmd += "<color r='0.50' g='0.025' b='0.35' a='1'/>";
          cmd += "<scale x='10' y='10' z='10' />";
          cmd += "<rotation x='0' y='150.0' z='0' />";
          cmd += "<position x='" + xPos + "' y='10' z='" + zPos + "' />";  
          cmd += "<physicalProperties>";
          cmd += "<mass>0.5</mass>";
          cmd += "<friction>0.0</friction>";
          cmd += "</physicalProperties>";
          cmd += "</Model>";
      bridgeworks.updateScene(cmd);
    }
    
    // Get the generated pyramid and make it a collider
    function collide(nameCount){
        cmd = "<Update><AnimalMover name='Roaming_collider" + nameCount + "' target='collider" + nameCount + "' linearSpeed='3' angularSpeed='20'/>";
        cmd += "<Set target='collider" + nameCount + "' detectCollision='" + true + "' detectObstruction='true'>";
        cmd += "</Set>"
        cmd += "</Update>";
      bridgeworks.updateScene(cmd);
    }

    //Make a pyramid with a unique name - push it into the allColliders array
    function makeCollider(nameCount, xPos, zPos){
      var colliderName = "collider" + nameCount;
      var cmd =  "<Model name='" + colliderName + "' url='objects/pyramid.lwo' moveable='true' opacity='1' selectable='false' physicsEnabled='true' detectCollision='true'>";
          cmd += "<color r='0.1' g='0.1' b='0.1' a='1'/>";
          cmd += "<scale x='8' y='8' z='8' />"; 
          cmd += "<position x='" + xPos + "' y='10' z='" + zPos + "' />";  
          cmd += "<physicalProperties>";
          cmd += "<mass>5</mass>";
          cmd += "</physicalProperties>";
          cmd += "</Model>";
      bridgeworks.updateScene(cmd);
      collide(count);
      allColliders.push(colliderName);
    }
    
    //Generate a random number - used in random positioning of jewel and colliders
    function randomNumber(){
      var num = Math.floor(Math.random()*75) + 1; 
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
      return num;
    };

    //Place the jewel at at random position, place one collider at a random position approx every 7 seconds
    makeJewel(randomNumber(), randomNumber());
    
    var placeColliders = setInterval(function(){
      var randomX = randomNumber(),
          randomZ = randomNumber();
      count = count + 1;
      makeCollider(count, randomX, randomZ);
    }, 7000);

    //Check the given parts Y position
    function checkY(partY){
      var partToCheck = bridgeworks.get(partY),
          positionXYZ = partToCheck.position.getValueDirect(),
          positionY = positionXYZ.y;
      return positionY;
    };
    
    //Use CheckY to see if colliders or the jewel have gone over the edge
    var checkColliders = setInterval(function(){
      for (i=0; i < allColliders.length; i++){
        if ( checkY(allColliders[i]) < 0 ){
          var c = "\<Remove target='" + allColliders[i] + "'/>"
          bridgeworks.updateScene(c);
          allColliders.splice(i, 1);
        }
      };
      
      //Lose Game
      if ( checkY("jewel") < 0 ){
          $(".loseMessage").addClass("lose");
          stopColliders();
          clearInterval(handle);
        }
    }, 7000);
    
    //Stop placing colliders
    function stopColliders(){
      window.clearInterval(placeColliders);
    };
    
    var checkTime = setInterval (function checkTime(){
      if ( $(".digits div:nth-child(2)").hasClass("two")){
        console.log("two minutes!");
        winGame();
      };
    }, 1000);
    
    function winGame(){
      $(".digits").addClass("winner");
      $(".winnerMessage").addClass("winner");
      clearInterval(handle);
      clearInterval(placeColliders);
      clearInterval(checkColliders);
      clearInterval(checkTime);
    }
    
  }; //END START GAME
  
  
  $(".startGame button").click(function(){
    $(".startGame").removeClass("winner");
    startGame();
    runTimer();
  });

  $(".loseMessage button, .winnerMessage button").click(function(){
    console.log("lose button clicked");
    bridgeworks.contentDir = '/BwContent';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('AdventureTime.xml');
    $(".loseMessage").removeClass("lose");
    $(".winnerMessage").removeClass("winner");
    runTimer();
    startGame();
    
  });

});