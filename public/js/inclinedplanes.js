$(document).ready(function(){
  
//  var sphere1 = bridgeworks.get("Sphere1"),
//      sphere2 = bridgeworks.get("Sphere2"),
//      sphere3 = bridgeworks.get("Sphere3");
  
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
    $("button.gravity").text("Gravity Button");
    $("button[value='reset']").addClass("reset wedges-btn");
    $("button.reset").text("Reset Button");
};
  addButtons();
  
  $("button.gravity").click(function(){
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(true);
    sphere2.physicsEnabled.setValueDirect(true);
    sphere3.physicsEnabled.setValueDirect(true);
    console.log("end of button function");
  });
  
  $("button.reset").click(function(){
    sphere1 = bridgeworks.get("Sphere1"),
    sphere2 = bridgeworks.get("Sphere2"),
    sphere3 = bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(false);
    sphere2.physicsEnabled.setValueDirect(false);
    sphere3.physicsEnabled.setValueDirect(false);
    sphere1.position.setValueDirect(-10,5,103);
    sphere2.position.setValueDirect(0,5,102);
    sphere3.position.setValueDirect(10,5,102);
    console.log("end of button function");
  });
});


