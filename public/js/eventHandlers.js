window.onkeydown = handleKey;

// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(e)
{
    if (capture)
        bridgeworks.handleEvent(e);
}

function handleMouse(e)
{
    if (!bridgeworks)
        return;

    if (!g_sceneInspector) {
        g_sceneInspector = bridgeworks.registry.find("SceneInspector");
    }

    if (!g_objectInspector) {
        g_objectInspector = bridgeworks.registry.find("ObjectInspector");
    }

    bridgeworks.handleEvent(e);

    switch (e.type) {

        case "mousedown":
            {
                capture = true;
            }
            break;
        case "mouseup":
            {
                capture = false;
            }
            break;
        case "click":
            {
              console.log(bridgeworks.selector.selections.models.length)
              selectObject();

              // if the selected model is not moveable switch modes between camera and objects
              if (!g_selectedModel || g_selectedModel.moveable.getValueDirect() == false) {
                  g_sceneInspector.enabled.setValueDirect(true);
                  g_objectInspector.enabled.setValueDirect(false);
              } else {
                  g_sceneInspector.enabled.setValueDirect(false);
                  g_objectInspector.enabled.setValueDirect(true);

                  // if the shift key is down switch from move to rotate object
                  if (e.shiftKey) {
                    console.log("shifty");
                    bridgeworks.get("Object.Move").listen.setValueDirect(false);
                    bridgeworks.get("Object.Zoom").listen.setValueDirect(false);
                    bridgeworks.get("Object.Rotate").listen.setValueDirect(true);
                  } else if (e.ctrlKey || e.metaKey) {
                    console.log("zoomy");
                    bridgeworks.get("Object.Move").listen.setValueDirect(false);
                    bridgeworks.get("Object.Rotate").listen.setValueDirect(false);
                    bridgeworks.get("Object.Zoom").listen.setValueDirect(true);
                  } else {
                    bridgeworks.get("Object.Rotate").listen.setValueDirect(false);
                    bridgeworks.get("Object.Zoom").listen.setValueDirect(false);
                    bridgeworks.get("Object.Move").listen.setValueDirect(true);
                  }
              }

            }
        break;

        case "dblclick":
          {
            if (g_selectedModel) {
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
            }
          }
        break;
    }
}


function selectObject(){
  // if there is already a selected model...
  if (g_selectedModel)
  {
      g_selectedModel.getAttribute("highlight").setValueDirect(false);
      g_selectedModel = null;
  }
  // verify selector has models
  if (bridgeworks.selector.selections.models.length > 0)
  {
      g_selectedModel = bridgeworks.selector.selections.models[0];
  }

  if (!g_selectedModel) return false;

  g_selectedModelName = g_selectedModel.name.getValueDirect().join("");


  if (g_selectedModel.moveable.getValueDirect()) {
    g_selectedModel.getAttribute("highlight").setValueDirect(true);
  }
  else {
    g_selectedModel = null;
    $("#model-menu").toggleClass('active',false);
  }//turn off context menu on deselect

  return true;

}

function handleKey(e)
{

    bridgeworks.handleEvent(e);

    if (!g_sceneInspector) {
        g_sceneInspector = bridgeworks.registry.find("SceneInspector");
    }

    var code = -1;
    if (e.key !== undefined) code = e.key;
    else if (e.keyIdentifier !== undefined) code = e.keyIdentifier;

    switch (code) {
        case 'C'.charCodeAt(0):
        case 'c':
        case "U+0043":
            {
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    copy();
                }      // c
            }
            break;
        case 'P'.charCodeAt(0):
        case 'p':
            {
                exportSelected();
            }
            break;


        case 'V'.charCodeAt(0):
        case 'v':
        case "U+0056":

            {      // v
                if (e.metaKey || e.ctrlKey) {
                    if (document.activeElement.id != 'url') {
                        e.preventDefault();
                        paste();
                    }
                }
            }
            break;
        case 8:
        case "U+0008":
        case "Backspace":
          {
            cut();
            e.preventDefault();
            e.stopPropogation();
          }
          break;
        case "Right": //right
            objectRight(1);
            break;

        case "Left": //left
            objectLeft();
            break;

        case "Down": //down
            if (e.shiftKey || e.ctrlKey) {
                objectDown(1);
            }
            else {
                objectBackward(1);
            }
            break;
        case "Up": //up
            if (e.shiftKey || e.ctrlKey) {
                objectUp(1);
            }
            else {
                objectForward(1);
            }
            break;
        case 'X'.charCodeAt(0):
        case 'x':
        case "U+0058":

            {      // x
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    cut();
                }
            }
            break;
    }

    return false;
}

function handleScroll (e) {
  console.log("scrolling");
  e.preventDefault();
  e.stopPropagation();
  return false;
}
