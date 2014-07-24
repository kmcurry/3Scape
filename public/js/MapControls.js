/**
 * Created by tyler_000 on 7/15/2014.
 */
function zoomOut()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    var totalDelta = sceneInspec.panDelta.values[2];
    var distance = sceneInspec.pivotDistance.getValueDirect();
    if(totalDelta > 0)
    {
        if((distance >= 0) && distance < 4000)
            if(distance * 0.3 != sceneInspec.pivotDistance.getValueDirect())
            {
                sceneInspec.panDelta.values[2]=-15 * 0.3;
            }
        sceneInspec.evaluate();
        bridgeworks.updateScene();
        console.log("Current delta: " + sceneInspec.panDelta.values[2]);
        sceneInspec.panDelta.values[0] = 0;
        sceneInspec.panDelta.values[1] = 0;
        sceneInspec.panDelta.values[2] = 0;
    }
    else
    {
        sceneInspec.panDelta.values[2]-=1000;
        sceneInspec.evaluate();
        bridgeworks.updateScene();
        console.log("Current Z delta: " + sceneInspec.panDelta.values[2]);
    }
    sceneInspec.panDelta.values[0] = 0;
    sceneInspec.panDelta.values[1] = 0;
    sceneInspec.panDelta.values[2] = 0;

}

function zoomIn()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    var totalDelta = sceneInspec.panDelta.values[2];
    if(totalDelta < 0)
    {
        if((distance >= 0) && (distance < 4000))
            if(distance * 0.3 != sceneInspec.pivotDistance.getValueDirect())
            {
                sceneInspec.panDelta.values[2]=15 * 0.3;
            }

        sceneInspec.evaluate();
        bridgeworks.updateScene();
        sceneInspec.panDelta.values[0] = 0;
        sceneInspec.panDelta.values[1] = 0;
        sceneInspec.panDelta.values[2] = 0;
    }
    else
    {
        sceneInspec.panDelta.values[2]+=1000;
        sceneInspec.evaluate();
        bridgeworks.updateScene();

    }
    sceneInspec.panDelta.values[0] = 0;
    sceneInspec.panDelta.values[1] = 0;
    sceneInspec.panDelta.values[2] = 0;

}

function rotatePosY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    //console.log(sceneInspec);
    sceneInspec.rotationDelta.values[1]=90;
    console.log("Current Y delta: " + sceneInspec.panDelta.values[1]);
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.values[0] = 0;
    sceneInspec.rotationDelta.values[1] = 0;
    sceneInspec.rotationDelta.values[2] = 0;
}

function rotateNegY()
{
    //Should be moved to a config file
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[1]= -90;
    console.log("Current Z delta: " + sceneInspec.panDelta.values[1]);
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.values[0] = 0;
    sceneInspec.rotationDelta.values[1] = 0;
    sceneInspec.rotationDelta.values[2] = 0;
}

function tiltDown()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]= 10;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.values[0] = 0;
    sceneInspec.rotationDelta.values[1] = 0;
    sceneInspec.rotationDelta.values[2] = 0;
}

function tiltUp()
{
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.rotationDelta.values[0]= -10;
    sceneInspec.evaluate();
    bridgeworks.updateScene();
    sceneInspec.rotationDelta.values[0] = 0;
    sceneInspec.rotationDelta.values[1] = 0;
    sceneInspec.rotationDelta.values[2] = 0;
}