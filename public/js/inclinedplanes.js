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