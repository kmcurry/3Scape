// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(event)
{
    if (capture) bridgeworks.handleEvent(event);
}

function handleEvent(e)
{
    if (!bridgeworks) return;

    if (!g_sceneInspector) {
      g_sceneInspector = bridgeworks.registry.find("SceneInspector");
    }

    if (!g_objectInspector) {
      g_objectInspector = bridgeworks.registry.find("ObjectInspector");
    }

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
            zoomActivate();

        }
          break;
      case "click": {
          //Dishing out the event client x and y cordinates of the mouse for testing purposes
          window.clearInterval(zoomUpdate);
          g_selectedModel.getAttribute("highlight").setValueDirect(false);
          g_selectedModel = bridgeworks.selector.selections.models[0];
          if(g_selectedModel) {

              g_selectedModel.getAttribute("highlight").setValueDirect(true);

              g_selectedModelName = g_selectedModel.name.getValueDirect().join("");
              console.log(g_selectedModelName);
              selectedThing = null; // ??? - KMC


              setColorPicker();

              myObject = document.getElementById(g_selectedModelName);
              $('.object').removeClass('current-object');
              $(myObject).addClass('current-object');

              scaleValues = (g_selectedModel.scale.getValueDirect());
              x = scaleValues['x'] * 100
              $('#scales').slider('setValue', x);

              // if the selected model is not moveable switch modes between camera and objects
              if (g_selectedModel.moveable.getValueDirect() == false) {
                g_sceneInspector.enabled.setValueDirect(true);
                g_objectInspector.enabled.setValueDirect(false);
              } else {
                g_sceneInspector.enabled.setValueDirect(false);
                g_objectInspector.enabled.setValueDirect(true);
              }


          }
          else {
            // this is so confusing
              selectedThing = bridgeworks.selector.selectedName.getValueDirect().join("");
              selectedId = bridgeworks.selector.getAttribute("Selected").id;
              selectedText = bridgeworks.selector.getAttribute("Selected").text.getValueDirect().join("");
          }

          capture = false;
      }
      break;

      case "dblclick":
      {
          if(selectedThing) // ??? KMC
          {
              openLabelEdit();
          }
          else {
              var name = g_selectedModel.name.getValueDirect().join("");
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
              bridgeworks.updateScene(cmd);

              setColorPicker();
          }
      }
      break;
    }

}

function handleKey(e)
{
  if (!g_sceneInspector) {
    g_sceneInspector = bridgeworks.registry.find("SceneInspector");
  }

  if(editorOpen == 0) {
      switch (e.keyCode) {
          case 'C'.charCodeAt(0):
          {
              if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  copy();
              }      // c
          }
              break;
          case 'D'.charCodeAt(0):
          {
              g_sceneInspector.panDelta.setValueDirect(0,0,10);
          }
              break;
          case 'E'.charCodeAt(0):
          {
              g_sceneInspector.panDelta.setValueDirect(0,0,-10);
          }
          case 'S'.charCodeAt(0):
          {
              g_sceneInspector.panDelta.setValueDirect(10,0,0);
          }
          case 'F'.charCodeAt(0):
          {
              g_sceneInspector.panDelta.setValueDirect(-10,0,0);
          }
              break;
          case 32: // Space bar
            {
              addSlide();
            }
          case 46: // Delete Key
            if (selectedThing) {
              var slice = selectedThing.slice(6,8);
                  console.log(slice);
              var cmd = "\<Remove target='"+selectedThing+"'/>";
              bridgeworks.updateScene(cmd);
              var cmd2 = "\<Remove target='"+slice+"'/>"
              var div = document.getElementById(selectedId);
              bridgeworks.updateScene(cmd2);
              div.parentNode.removeChild(div);
            }
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
              objectLeft(1);
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
                  if(selectedThing){
                      var slice = selectedThing.slice(6.8);
                      console.log(slice);
                      var cmd = "\<Remove target='"+selectedThing+"'/>";
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
        distance = g_sceneInspector.pivotDistance.getValueDirect()
        if ((distance >= 0) && (distance < 4000)) {
            if (distance * 0.05 != g_sceneInspector.panSensitivity.values[0]) {
                g_sceneInspector.panSensitivity.values[0] = distance * 0.05;
                g_sceneInspector.panSensitivity.values[1] = distance * 0.05;
                g_sceneInspector.panSensitivity.values[2] = distance * 0.05;
            }
        }
        else {
            g_sceneInspector.panSensitivity.values[0] = 1200;
            g_sceneInspector.panSensitivity.values[1] = 1200;
            g_sceneInspector.panSensitivity.values[2] = 1200;
        }
    }, 200);
}
