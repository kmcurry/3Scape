$(document).ready(function(){

  console.log("Initializing 3Scape Lesson: Inclined Planes.");

  var sphere1 = "",
      sphere2 = "",
      sphere3 = "";

  function addButtons(){
    var gravButton = document.createElement("button"),
        resetButton = document.createElement("button"),
        addMassButton = document.createElement("button");
    gravButton.type = "submit";
    gravButton.value = "gravity";
    resetButton.type = "submit";
    resetButton.value = "reset";
    addMassButton.type = "submit";
    addMassButton.value = "addMass";
    document.body.appendChild(gravButton);
    document.body.appendChild(resetButton);
    document.body.appendChild(addMassButton);
    $("button[value='gravity']").addClass("gravity inertia-btn");
    $("button.gravity").text("Gravity On");
    $("button[value='reset']").addClass("reset inertia-btn");
    $("button.reset").text("Reset Spheres");
    $("button[value='addMass']").addClass("add-mass inertia-btn");
    $("button.add-mass").text("Make Wall Heavier");
  };
  addButtons();

  function addLabel(){
    var labelDiv = document.createElement("div");
    labelDiv.setAttribute('class', 'labelDiv');
    document.body.appendChild(labelDiv);
    $("div.labelDiv").html("<h3>Inclined Planes Experiment</h3><p>3 spheres of the same size are hovering above 3 inclined planes of different heights.</p><p>When the spheres drop, <b>which one will roll the farthest</b>?</p><p>Push the <i>GRAVITY ON</i> button to find out!</p>");
  };

  addLabel();

  setTimeout(function(){
    $(".labelDiv").addClass("showLabel");
  }, 13000);

  function spherePhysicsOff(){
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


  $("button.gravity").click(function(){
    $(".labelDiv").addClass("hideLabel");
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(true);
    sphere2.physicsEnabled.setValueDirect(true);
    sphere3.physicsEnabled.setValueDirect(true);
    spherePhysicsOff();
  });

  $("button.reset").click(function(){
    sphere1.physicsEnabled.setValueDirect(false);
    sphere2.physicsEnabled.setValueDirect(false);
    sphere3.physicsEnabled.setValueDirect(false);
    sphere1.position.setValueDirect(-10,8,102);
    sphere2.position.setValueDirect(0,8,102);
    sphere3.position.setValueDirect(10,8,102);
  });
});
