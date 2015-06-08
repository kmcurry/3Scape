
var g_capture = false;

function addKeyEvents()
{
    if (window.addEventListener)
    {
        window.addEventListener("keyup",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }
    else
    {
        window.attachEvent("keyup",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }

    if (window.addEventListener)
    {
        window.addEventListener("keydown",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }
    else
    {
        window.attachEvent("keydown",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }

}

// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(e)
{
  if (g_capture) {
    var evt=window.event || e //equalize event object
    evt.preventDefault();
    evt.stopImmediatePropagation();

    bridgeworks.handleEvent(e);
  }
}

function handleMouse(e)
{
  if (bridgeworks == "undefined" || bridgeworks == null)
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
              g_capture = true;
            }
            break;
        case "mouseup":
            {
              g_capture = false;
            }
            break;
        case "click":
            {
              selectPoint();
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
                    bridgeworks.get("Object.Move").listen.setValueDirect(false);
                    bridgeworks.get("Object.Zoom").listen.setValueDirect(false);
                    bridgeworks.get("Object.Rotate").listen.setValueDirect(true);
                  } else if (e.ctrlKey || e.metaKey) {
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

  if (g_selectedModel.moveable.getValueDirect()) {
    updateActionControls(g_selectedModel);
    g_selectedModel.getAttribute("highlight").setValueDirect(true);
  }
  else {
    g_selectedModel = null;
  }//turn off context menu on deselect

  return true;

}

var g_selectPointModel = null;
function selectPoint() {
  if (!g_selectPointModel) g_selectPointModel = bridgeworks.get("SelectPoint");

  if (g_selectPointModel) {
    g_selectPointModel.opacity.setValueDirect(1);
    var pw = bridgeworks.selector.pointWorld.getValueDirect();
    g_selectPointModel.position.setValueDirect(pw.x, pw.y, pw.z);
    bridgeworks.updateScene("<AutoInterpolate duration='5' target='SelectPoint' opacity='0'/>");
  }
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

    console.log(code);

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
        case 'D'.charCodeAt(0):
        case 'd':
        case "U+0044":
            {
                g_sceneInspector.viewRelativeTranslationDelta.setValueDirect(-10,0,0);
            }
            break;
        case 'A'.charCodeAt(0):
        case 'a':
        case "U+0041":
            {
                g_sceneInspector.viewRelativeTranslationDelta.setValueDirect(10,0,0);
            }
            break;
        case 'S'.charCodeAt(0):
        case 's':
        case "U+0053":
            {
                g_sceneInspector.viewRelativeTranslationDelta.setValueDirect(0,0,-10);
            }
            break;
        case 'W'.charCodeAt(0):
        case 'w':
        case "U+0057":
            {
                g_sceneInspector.viewRelativeTranslationDelta.setValueDirect(0,0,10);
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
            e.stopPropagation();
          }
          break;
        case "Right": //right
          if (e.shiftKey) {
            rotateRight();
          } else {
            objectRight(1);
          }
            break;

        case "Left": //left
          if (e.shiftKey) {
            rotateLeft();
          } else {
              objectLeft();
            }
            break;

        case "Down": //down
          if (e.shiftKey) {
            rotateDown();
          }
            else if (e.metaKey || e.ctrlKey) {
              objectBackward(1);
            }
            else {
              objectDown(1);
            }
            break;
        case "Up": //up
          if (e.shiftKey) {
            rotateUp();
          }
          else if (e.metaKey || e.ctrlKey) {
            objectForward(1);
            }
            else {
              objectUp(1);
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

var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

if (document.attachEvent) //if IE (and Opera depending on user setting)
    document.attachEvent("on"+mousewheelevt, handleWheel)
else if (document.addEventListener) //WC3 browsers
    document.addEventListener(mousewheelevt, handleWheel, false)

function handleWheel(e) {


    var evt=window.event || e //equalize event object
    evt.preventDefault();
    evt.stopImmediatePropagation();



    var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta

    if (evt.shiftKey) {
      if (delta < 0) objectForward();
      else objectBackward();

    } else if (e.metaKey || e.ctrlKey) {
      scalePart(delta/1000);
    } else {
      if (delta > 0) zoomOut();
      else zoomIn();
    }
}
