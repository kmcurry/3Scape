$(document).ready(function(){
  var button = document.createElement("button");
  button.type = "submit";
  button.value = "gravity";
  document.body.appendChild(button);
  $("button[value='gravity']").addClass("gravity");
  $("button[value='gravity']").text("Gravity Button");
  $("button.gravity").click(function(){
      var sphere1 = bridgeworks.get("Sphere1"),
      sphere2 = bridgeworks.get("Sphere2"),
      sphere3= bridgeworks.get("Sphere3");
    sphere1.physicsEnabled.setValueDirect(true);
    sphere2.physicsEnabled.setValueDirect(true);
    sphere3.physicsEnabled.setValueDirect(true);
    console.log("end of button function");
  });
});


//  var resetButton = document.createElement("button");
//    resetButton.type = "submit";
//    resetButton.value = "reset";
//    document.body.appendChild(resetButton);
//    $("button[value='reset']").addClass("gravity reset");
//    $("button[value='reset']").text("Reset Spheres");
//    $("button.reset").click(function(){
//      sphere1.position.setValueDirect();
//      sphere2.position.setValueDirect();
//      sphere3.position.setValueDirect();
//      console.log("end of button function");
//    });