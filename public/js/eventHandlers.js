// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(event)
{
    if (capture) bridgeworks.handleEvent(event);
}

function handleEvent(e)
{
    bridgeworks.handleEvent(e);
    switch(e.type) {
        case "mousedown":
        {
            capture = true;

        }
            break;
        case "mouseup":
        {
            capture = false;
            sceneInspector = bridgeworks.registry.find("SceneInspector");
            zoomActivate();

        }
          break;
      case "click": {
          //Dishing out the event client x and y cordinates of the mouse for testing purposes
          window.clearInterval(zoomUpdate);
          selectedModel = bridgeworks.selector.selections.models[0];
          if(selectedModel) {
              modelName = selectedModel.name.getValueDirect().join("");
              var name = selectedModel.name.getValueDirect().join(""); // what's going on here?
              selected = null;

              setObject(name);
              setColorPicker();

              myObject = document.getElementById(name);
              $('.object').removeClass('current-object');
              $(myObject).addClass('current-object');

              scaleValues = (selectedModel.scale.getValueDirect());
              x = scaleValues['x'] * 100
              $('#scales').slider('setValue', x);
              /*
              var r = selectedModel.rotation.getValueDirect();
              $("#rotxs").slider("setValue", r.x);
              $("#rotys").slider("setValue", r.y);
              $("#rotzs").slider("setValue", r.z);
              */

          }
          else {
              selected = bridgeworks.selector.selectedName.getValueDirect().join("");
              selectedId = bridgeworks.selector.getAttribute("Selected").id;
              selectedText = bridgeworks.selector.getAttribute("Selected").text.getValueDirect().join("");
          }

          capture = false;
      }
      break;

      case "dblclick":
      {
          if(selected)
          {
              openLabelEdit();
          }
          else {
              var name = selectedModel.name.getValueDirect().join("");
              var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
              var cmd = "";
              if (e.metaKey || e.ctrlKey) {
                  cmd = "\<AutoInterpolate target='" + name + "'>";
                  cmd += "\<position x='" + pointWorld.x + "' y='" + pointWorld.y + "' z='" + pointWorld.z + "'/>"
                  cmd += "\</AutoInterpolate>";
              }
              else {
                  cmd = "\<Locate target='" + name + "'/>";
              }
              console.log(name);
              bridgeworks.updateScene(cmd);
              setObject(name);
              setColorPicker();
          }
      }
      break;
    }

}

function handleKey(e)
{
  if(editorOpen == 0) {
      switch (e.keyCode) {
          case 'C'.charCodeAt(0):
          {
              if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  copy();
                  copy(); // why is this called 2X?? - KMC
              }      // c
          }
              break;
          case 187: //Equal Sign
//                        var command = "\<Serialize target='Root'/>";
//                        bridgeworks.updateScene(command);
//                            saveThis(serializedScene,"Scene");


//                        var canvasId = "Canvas";
//                        var xml = "<ScreenCapture canvasId='" + canvasId + "'/>"
//                        console.debug(xml);
//                        bridgeworks.updateScene(xml);
              break;

          case 46: //Delete Key
              var slice = selected.slice(6,8);
                  console.log(slice);
              var cmd = "\<Remove target='"+selected+"'/>";
              bridgeworks.updateScene(cmd);
              var cmd2 = "\<Remove target='"+slice+"'/>"
              var div = document.getElementById(selectedId);
              bridgeworks.updateScene(cmd2);
              div.parentNode.removeChild(div);
          break;

          case 'V'.charCodeAt(0):
          {      // v
              if (e.metaKey || e.ctrlKey) {
                  if (document.activeElement.id != 'url') {
                      e.preventDefault();
                      paste();
                  }
              }
          }
              break;
          case 39: //right
            objectRight(1);
            break;

          case 37: //left
            if (e.shiftKey) {
              copyLeft(1);
            } else {
              objectLeft(1);
            }
            break;

          case 40: //down
            if (e.shiftKey || e.ctrlKey) {
              objectDown(1);
            }
            else{
              objectBackward(1);
            }
            break;
          case 38: //up
            if (e.shiftKey || e.ctrlKey) {
              objectUp(1);
            }
            else{
              objectForward(1);
            }
            break;
          case 'X'.charCodeAt(0):
          {      // x
              if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  if(selected){
                      var slice = selected.slice(6.8);
                      console.log(slice);
                      var cmd = "\<Remove target='"+selected+"'/>";
                      bridgeworks.updateScene(cmd);
                      var cmd2 = "\<Remove target='"+slice+"'/>"
                      var div = document.getElementById(selectedId);
                      bridgeworks.updateScene(cmd2);
                      div.parentNode.removeChild(div);
                      copy();
                  }
                  cut();
              }
          }
              break;

      }
  }
}

// some kind of magic number helper for adjusting sensitivity based on pivot distance
function zoomActivate() {
    zoomUpdate = window.setInterval(function () {
        distance = sceneInspector.pivotDistance.getValueDirect()
        if ((distance >= 0) && (distance < 4000)) {
            if (distance * 0.05 != sceneInspector.panSensitivity.values[0]) {
                sceneInspector.panSensitivity.values[0] = distance * 0.05;
                sceneInspector.panSensitivity.values[1] = distance * 0.05;
                sceneInspector.panSensitivity.values[2] = distance * 0.05;
                console.log(sceneInspector.panSensitivity.values[0]);
            }
        }
        else {
            sceneInspector.panSensitivity.values[0] = 1200;
            sceneInspector.panSensitivity.values[1] = 1200;
            sceneInspector.panSensitivity.values[2] = 1200;
            console.log(sceneInspector.panSensitivity.values[0]);
            console.log(distance);
        }
    }, 200);
}
