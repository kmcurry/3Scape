$(document).ready(function(){
  
  var sphere1 = "",
      sphere2 = "",
      sphere3 = "";
  
  function addButtons(){
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
  addButtons();
  
  function addLabel(){
    var labelDiv = document.createElement("div");
    labelDiv.setAttribute('class', 'labelDiv');
    document.body.appendChild(labelDiv);
    $("div.labelDiv").html("<h3>Inclined Planes Experiment</h3><p>3 spheres of the same size are hovering above 3 inclined planes.</p><p>The first inclined plane is shallow, the second is a little steeper, and the third is the steepest.</p><p>When the spheres drop, <b>which one will roll the farthest</b>?</p><p>Push the <i>Gravity On</i> button to find out!</p>");
  };
  
  addLabel();
  
  setTimeout(function(){
    $(".labelDiv").addClass("showLabel"); 
  }, 10000);
  
  
  
  $("button.gravity").click(function(){
    $(".labelDiv").addClass("hideLabel");
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(true);
    sphere2.physicsEnabled.setValueDirect(true);
    sphere3.physicsEnabled.setValueDirect(true);
  });
  
  $("button.reset").click(function(){
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(false);
    sphere2.physicsEnabled.setValueDirect(false);
    sphere3.physicsEnabled.setValueDirect(false);
    sphere1.position.setValueDirect(-10,7,102);
    sphere2.position.setValueDirect(0,7,102);
    sphere3.position.setValueDirect(10,7,102);
  });
});


