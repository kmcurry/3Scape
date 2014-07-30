$('#map-controls').mouseenter(function(){
  var sceneActive = sceneInspector.enabled.getValueDirect();           
  console.log(sceneActive);
  if(!sceneActive){
    sceneInspector.enabled.setValueDirect(true);
    // objectInspector.enabled.setValueDirect(false);
  }
}).mouseleave(function(){
  var objectActive = objectInspector.enabled.getValueDirect();
  if(objectActive){
    sceneInspector.enabled.setValueDirect(false);
  }
})

//Helper method to create button-hold functions. Pass element id, desired function (leave out parentheses), and time between repeats in miliseconds.
var onHoldFunction = function(id, method, time) {
  var interval;
  $(id).on({
    mousedown : function () {
      method(); // Still works on a single click                
      interval = window.setInterval(function(){                
        method();
      }, time); //Repeats every (time) miliseconds               
    },
    mouseup : function () {
      window.clearInterval(interval);
    }
  });                
};
//Map
onHoldFunction('#rotate-counter', rotateNegY, 20);
onHoldFunction('#rotate-clockwise', rotatePosY, 20);
onHoldFunction('#tilt-up', tiltUp, 20);
onHoldFunction('#tilt-down', tiltDown, 20);
onHoldFunction('#zoom-in', zoomIn, 20);
onHoldFunction('#zoom-out', zoomOut, 20);

//Object, uses Anonymous function to pass parameter to callback
onHoldFunction('#object-up', function(){objectUp(0.5);}, 20);
onHoldFunction('#object-down', function(){objectDown(0.5);}, 20); 
onHoldFunction('#object-forward', function(){objectForward(0.5);}, 20); 
onHoldFunction('#object-backward', function(){objectBackward(0.5);}, 20); 
onHoldFunction('#object-left', function(){objectLeft(0.5);}, 20); 
onHoldFunction('#object-right', function(){objectRight(0.5);}, 20); 