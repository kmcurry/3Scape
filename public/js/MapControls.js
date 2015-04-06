/**
 * Created by tyler_000 on 7/15/2014.
 */

var MAGIC_SENSITIVITY = 1.25;
var MIN_PIVOT = 20;

function zoomOut()
{
  if (!g_sceneInspector) {
    g_sceneInspector = bridgeworks.getRegistry().find("SceneInspector");
  }

  var pivot = g_sceneInspector.pivotDistance.getValueDirect();

  pivot = pivot >= MIN_PIVOT ? pivot : MIN_PIVOT;

  var distance = -1 * pivot / MAGIC_SENSITIVITY;

  g_sceneInspector.enabled.setValueDirect(true);

  g_sceneInspector.panDelta.setValueDirect(0,0,distance);

  g_sceneInspector.enabled.setValueDirect(false);

}

function zoomIn()
{
  if (!g_sceneInspector) {
    g_sceneInspector = bridgeworks.getRegistry().find("SceneInspector");
  }

  var pivot = g_sceneInspector.pivotDistance.getValueDirect();

  pivot = pivot >= MIN_PIVOT ? pivot : MIN_PIVOT;

  var distance = 1 * pivot / MAGIC_SENSITIVITY;

  g_sceneInspector.enabled.setValueDirect(true);

  g_sceneInspector.panDelta.setValueDirect(0,0,distance);

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
