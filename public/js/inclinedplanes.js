$(document).ready(function(){
  var sphere1 = bridgeworks.get("Sphere1"),
      sphere2 = bridgeworks.get("Sphere2"),
      sphere3= bridgeworks.get("Sphere3"),
      dropButton = document.createElement("button");
  dropButton.type = "submit";
  dropButton.value = "gravity";
  document.body.appendChild(dropButton);
  $("button[value='gravity']").addClass("gravity");
  $("button[value='gravity']").text("Gravity Button");
  $("button.gravity").click(function(){
    sphere1.physicsEnabled.setValueDirect(true);
    sphere2.physicsEnabled.setValueDirect(true);
    sphere3.physicsEnabled.setValueDirect(true);
    console.log("end of button function");
  });
  
  var resetButton = document.createElement("button");
    resetButton.type = "submit";
    resetButton.value = "reset";
    document.body.appendChild(resetButton);
    $("button[value='reset']").addClass("gravity reset");
    $("button[value='reset']").text("Reset Spheres");
    $("button.reset").click(function(){
      sphere1.position.setValueDirect();
      sphere2.position.setValueDirect();
      sphere3.position.setValueDirect();
      console.log("end of button function");
    });
});