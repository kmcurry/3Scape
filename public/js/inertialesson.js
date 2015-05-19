$(window).load(function(){

  console.log("Initializing 3Scape Lesson: Weight and Inertia.");

  var sphere = "",
      wall = "";

  function addButtons(){
    var gravButton = document.createElement("button"),
        resetButton = document.createElement("button"),
        slider = document.createElement("input"),
        sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", "addMass");
    sliderLabel.innerHTML = "mass";
    sliderLabel.id = "sliderLabel";
    gravButton.type = "submit";
    gravButton.value = "gravity";
    resetButton.type = "submit";
    resetButton.value = "reset";
    slider.type = "range";
    slider.id = "addMass";
    slider.name = "addMass";
    slider.min = 0;
    slider.max = 1;
    slider.value = 0;
    slider.step = 1;
    document.body.appendChild(gravButton);
    document.body.appendChild(resetButton);
    document.body.appendChild(slider);
    document.body.appendChild(sliderLabel);
    $("button[value='gravity']").addClass("gravity inertia-btn");
    $("button.gravity").text("Gravity On");
    $("button[value='reset']").addClass("reset inertia-btn");
    $("button.reset").text("Reset Sphere");
    $("input#addMass").addClass("add-mass inertia-slider");
  };
  addButtons();

  function addLabel(){
    var labelDiv = document.createElement("div");
    labelDiv.setAttribute('class', 'labelDiv');
    document.body.appendChild(labelDiv);
    $("div.labelDiv").html("<h3>Inertia Experiment</h3><p>A heavy sphere is hovering above an inclined plane that's in front of a wall. You can make the wall lighter or heavier with the <i>MASS</i> switch.<h4><u>Question</u></h4></p><p>When the sphere drops, <b>what will happen to the wall</b>? What will happen to the wall if you increase its mass and then drop the sphere?</p><p>Push the <i>GRAVITY ON</i> button to find out!</p>");
  };

  addLabel();

  setTimeout(function(){
    $(".labelDiv").addClass("showLabel");
  }, 13000);

  function spherePhysicsOff(){
      sphere = bridgeworks.get("Sphere");
      sphere.physicsEnabled.setValueDirect(false);
  };


  $("button.gravity").click(function(){
    console.log("clicked gravity button");
    $(".labelDiv").addClass("hideLabel");
    sphere = bridgeworks.get("Sphere");
    sphere.physicsEnabled.setValueDirect(true);
    
  });

  $("button.reset").click(function(){
    sphere = bridgeworks.get("Sphere");
    wall = bridgeworks.get("Wall");
    sphere.physicsEnabled.setValueDirect(false);
    sphere.position.setValueDirect(0,12,104);
    wall.position.setValueDirect(0,0.5,30);
    wall.rotation.setValueDirect(0, 0, 0);
  });
  
  function toggleMass(){
    var sliderVal = $("#addMass").val();
    console.log(sliderVal);
    if (sliderVal == 0){
      var cmd =  "<Set target='Wall'>";
          cmd += "<physicalProperties>";
          cmd += "<mass>1</mass>";
          cmd += "</physicalProperties>";
          cmd += "</Set>";
      bridgeworks.updateScene(cmd);
    }
    else{
      var cmd =  "<Set target='Wall'>";
          cmd += "<physicalProperties>";
          cmd += "<mass>1000</mass>";
          cmd += "</physicalProperties>";
          cmd += "</Set>";
      bridgeworks.updateScene(cmd);
    }
    
  };
  
  $("input#addMass").on('change', function(){
    toggleMass();
  });
});
