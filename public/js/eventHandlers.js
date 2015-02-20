// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(event)
{
    if (capture)
        bridgeworks.handleEvent(event);
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
              if (g_selectedModel)
              {
                  g_selectedModel.getAttribute("highlight").setValueDirect(false);
                  g_selectedModel = null;
              }

              if (bridgeworks.selector.selections.models.length > 0)
              {
                  g_selectedModel = bridgeworks.selector.selections.models[0];
              }

              if (g_selectedModel) {

                  g_selectedModelName = g_selectedModel.name.getValueDirect().join("");

                  if (g_selectedModelName != 'Grid') {

                      if (g_selectedModel.moveable.getValueDirect()) {
                        g_selectedModel.getAttribute("highlight").setValueDirect(true);
                      }

                  }
              }
              else {

                  console.log("NO MODEL SELECTED");
                  g_selectedModel = null;

              }

              // if the selected model is not moveable switch modes between camera and objects
              if (!g_selectedModel || g_selectedModel.moveable.getValueDirect() == false) {
                  g_sceneInspector.enabled.setValueDirect(true);
                  g_objectInspector.enabled.setValueDirect(false);
              } else {
                  g_sceneInspector.enabled.setValueDirect(false);
                  g_objectInspector.enabled.setValueDirect(true);
              }

              capture = false;
            }
        break;

        case "dblclick":
          {
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
        break;
    }

    bridgeworks.handleEvent(e);


}

function handleKey(e)
{

    bridgeworks.handleEvent(e);

    if (!g_sceneInspector) {
        g_sceneInspector = bridgeworks.registry.find("SceneInspector");
    }


    switch (e.keyCode) {
        case 'C'.charCodeAt(0):
            {
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    copy();
                }      // c
            }
            break;
        case 'P'.charCodeAt(0):
            {
                exportSelected();
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
            else {
                objectBackward(1);
            }
            break;
        case 38: //up
            if (e.shiftKey || e.ctrlKey) {
                objectUp(1);
            }
            else {
                objectForward(1);
            }
            break;
        case 'X'.charCodeAt(0):
            {      // x
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    cut();
                }
            }
            break;
    }
}
