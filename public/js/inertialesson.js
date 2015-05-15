$(document).ready(function(){

  console.log("Initializing 3Scape Lesson: Weight and Inertia.");

  var sphere = "";

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
    $("div.labelDiv").html("<h3>Inertia Experiment</h3><p>A heavy sphere is hovering above an inclined plane that's in front of a light weight wall.</p><p>When the sphere drops, <b>what will happen to the wall</b>?</p><p>Push the <i>GRAVITY ON</i> button to find out!</p>");
  };

  addLabel();

  setTimeout(function(){
    $(".labelDiv").addClass("showLabel");
  }, 13000);

  function spherePhysicsOff(){
    sphere = bridgeworks.get("Sphere"),
      sphere.physicsEnabled.setValueDirect(false);
  };


  $("button.gravity").click(function(){
    console.log("clicked gravity button");
    $(".labelDiv").addClass("hideLabel");
    sphere = bridgeworks.get("Sphere");
    sphere.physicsEnabled.setValueDirect(true);
    spherePhysicsOff();
  });

  $("button.reset").click(function(){
    sphere.physicsEnabled.setValueDirect(false);
    sphere.position.setValueDirect(-10,8,102);
  });
});
