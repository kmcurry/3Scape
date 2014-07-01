/**
 * Created by tyler_000 on 6/23/2014.
 */

function zoomIn()
 {
     //Should be moved to a config file
     var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
     sceneInspec.panDelta.values[2]+=30;
     sceneInspec.evaluate();
     bridgeworks.updateScene();
 }

function zoomOut()
 {
     //Should be moved to a config file
     var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
     sceneInspec.panDelta.values[2]-=15;
     sceneInspec.evaluate();
     bridgeworks.updateScene();
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

function pan()
{
    var x = 1;
    var y = 1;
    var sceneInspec = bridgeworks.getRegistry().find("SceneInspector");
    sceneInspec.panDelta.values[1]+= 10 * x ;
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