/**
 * Created by tyler_000 on 7/15/2014.
 */
function zoomOut()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    var totalDelta = sceneInspec.panDelta.values[2];
    if(totalDelta > 0)
    {
        sceneInspec.panDelta.values[2]=-15;
        sceneInspec.evaluate();
        bridgeworks.updateScene();
    }
    else
    {
        sceneInspec.panDelta.values[2]-=15;
        sceneInspec.evaluate();
        bridgeworks.updateScene();
        sceneInspec.panDelta.values[0] = 0;
        sceneInspec.panDelta.values[1] = 0;
        sceneInspec.panDelta.values[2] = 0;
    }

}

function zoomIn()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    var totalDelta = sceneInspec.panDelta.values[2];
    if(totalDelta < 0)
    {
        sceneInspec.panDelta.values[2]=15;
        sceneInspec.evaluate();
        bridgeworks.updateScene();
    }
    else
    {
        sceneInspec.panDelta.values[2]+=15;
        sceneInspec.evaluate();
        bridgeworks.updateScene();
        sceneInspec.panDelta.values[0] = 0;
        sceneInspec.panDelta.values[1] = 0;
        sceneInspec.panDelta.values[2] = 0;
    }

}

function rotatePosY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    //console.log(sceneInspec);
    sceneInspec.rotationDelta.values[1]+=90;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
}

function rotateNegY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[1]-=90;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
}

function tiltUp()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]+= 30;
    if(sceneInspec.rotationDelta.values[0]+= 30 >= 90)
        sceneInspec.rotationDelta.values[0] = 90;
    sceneInspec.evaluate();
    bridgeworks.updateScale();
}

function tiltDown()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]-= 30;
    if(sceneInspec.rotationDelta.values[0]+= -30 >= -90)
        sceneInspec.rotationDelta.values[0] = -90;
    sceneInspec.evaluate();
    bridgeworks.updateScale();
}