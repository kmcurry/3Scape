$(window).load(function(){

  console.log("Initializing 3Scape Physics Lesson");

  var sphere = "",
      wall = "";
  
  function addCSS(cssFile){
    $('head').append($('<link rel="stylesheet" type="text/css" />')
         .attr('href', cssFile));
  };

  function addInertiaButtons(){
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
    $("button.reset").text("Reset Parts");
    $("input#addMass").addClass("add-mass inertia-slider");
  };
  
  function addInclinedPlanesButtons(){
    var gravButton = document.createElement("button"),
        resetButton = document.createElement("button");
    gravButton.type = "submit";
    gravButton.value = "gravity";
    resetButton.type = "submit";
    resetButton.value = "reset";
    document.body.appendChild(gravButton);
    document.body.appendChild(resetButton);
    $("button[value='gravity']").addClass("gravity wedges-btn");
    $("button.gravity").text("Gravity On");
    $("button[value='reset']").addClass("reset wedges-btn");
    $("button.reset").text("Reset Spheres");
  };

  function addInertiaLabel(){
    var labelDiv = document.createElement("div");
    labelDiv.setAttribute('class', 'labelDiv');
    document.body.appendChild(labelDiv);
    $("div.labelDiv").html("<h3>Inertia Experiment</h3><p>A heavy sphere is hovering above an inclined plane that's in front of a wall. You can make the wall lighter or heavier with the <i>MASS</i> switch.<h4><u>Question</u></h4></p><p>When the sphere drops, <b>what will happen to the wall</b>? What will happen to the wall if you increase its mass and then drop the sphere?</p><p>Push the <i>GRAVITY ON</i> button to find out!</p>");
  };
  
  function addInclinedPlanesLabel(){
    var labelDiv = document.createElement("div");
    labelDiv.setAttribute('class', 'labelDiv');
    document.body.appendChild(labelDiv);
    $("div.labelDiv").html("<h3>Inclined Planes Experiment</h3><p>3 spheres of the same size are hovering above 3 inclined planes of different heights.</p><p>When the spheres drop, <b>which one will roll the farthest</b>?</p><p>Push the <i>GRAVITY ON</i> button to find out!</p>");
  };
  

  function sphere3PhysicsOff(){
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    setTimeout(function(){
      sphere1.physicsEnabled.setValueDirect(false);
    }, 10000);
    setTimeout(function(){
      sphere2.physicsEnabled.setValueDirect(false);
    }, 15000);
    setTimeout(function(){
      sphere3.physicsEnabled.setValueDirect(false);
    }, 20000);
  };

  
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
  
  if(bridgeworks.get("Wedge1")){
    var cssPath = "css/inclinedplanes.css";
    addCSS(cssPath);
    addInclinedPlanesButtons();
    addInclinedPlanesLabel();
    setTimeout(function(){
      $(".labelDiv").addClass("showLabel");
    }, 13000);
    $("button.gravity").click(function(){
      $(".labelDiv").addClass("hideLabel");
      sphere1 = bridgeworks.get("Sphere1"),
      sphere2 = bridgeworks.get("Sphere2"),
      sphere3 = bridgeworks.get("Sphere3");
      sphere1.physicsEnabled.setValueDirect(true);
      sphere2.physicsEnabled.setValueDirect(true);
      sphere3.physicsEnabled.setValueDirect(true);
      sphere3PhysicsOff();
    });
    $("button.reset").click(function(){
      sphere1.physicsEnabled.setValueDirect(false);
      sphere2.physicsEnabled.setValueDirect(false);
      sphere3.physicsEnabled.setValueDirect(false);
      sphere1.position.setValueDirect(-10,8,102);
      sphere2.position.setValueDirect(0,8,102);
      sphere3.position.setValueDirect(10,8,102);
    });
  }
  else{
    var cssPath = "css/inertia.css";
    addCSS(cssPath);
    addInertiaButtons()
    addInertiaLabel();
    setTimeout(function(){
      $(".labelDiv").addClass("showLabel");
    }, 13000);
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
    $("input#addMass").on('change', function(){
      toggleMass();
    });
  }
});
