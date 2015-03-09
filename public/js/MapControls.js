/**
 * Created by tyler_000 on 7/15/2014.
 */
function zoomOut()
{
  if (!g_sceneInspector) {
    g_sceneInspector = bridgeworks.getRegistry().find("SceneInspector");
  }

  g_sceneInspector.enabled.setValueDirect(true);

  g_sceneInspector.panDelta.setValueDirect(0,0,-20);

  g_sceneInspector.enabled.setValueDirect(false);

}

function zoomIn()
{
  if (!g_sceneInspector) {
    g_sceneInspector = bridgeworks.getRegistry().find("SceneInspector");
  }

  g_sceneInspector.enabled.setValueDirect(true);

  g_sceneInspector.panDelta.setValueDirect(0,0,20);

  g_sceneInspector.enabled.setValueDirect(false);

}

function rotatePosY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    //console.log(sceneInspec);
    sceneInspec.rotationDelta.values[1]=5;
    console.log("Current Y delta: " + sceneInspec.panDelta.values[1]);
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.setValueDirect(0,0,0);
}

function rotateNegY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[1]= -5;
    console.log("Current Z delta: " + sceneInspec.panDelta.values[1]);
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.setValueDirect(0,0,0);
}

function tiltDown()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]= 2;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.setValueDirect(0,0,0);
}

function tiltUp()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]= -2;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.setValueDirect(0,0,0);
}
