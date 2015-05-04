$(document).ready(function(){
  var button = document.createElement("button");
    button.type = "submit";
    button.value = "gravity";
    document.body.appendChild(button);
    $("button[value='gravity']").addClass("gravity");
    $("button[value='gravity']").text("Gravity Button");
    $("button.gravity").click(function(data){
      var model = bridgeworks.get("Sphere1");
      model.physicsEnabled.setValueDirect(true);
      console.log(model.physicsEnabled.getValueDirect());
    });
});