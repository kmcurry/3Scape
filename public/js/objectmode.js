function objectLeft()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(30,0,0);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectRight()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(-30,0,0);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectDown()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,-10,0);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectBackward()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,-10);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectUp()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,10,0);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectForward(){
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,10);
    g_objectInspector.translationDelta.setValueDirect(0,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function rotateDown() {
  if (g_selectedModel) {
    var sRot = g_selectedModel.rotation.getValueDirect();
    g_selectedModel.rotation.setValueDirect(sRot.x-10, sRot.y, sRot.z);
  }
}

function rotateLeft() {
  if (g_selectedModel) {
    var sRot = g_selectedModel.rotation.getValueDirect();
    g_selectedModel.rotation.setValueDirect(sRot.x, sRot.y+10, sRot.z);
  }
}


function rotateRight() {
  if (g_selectedModel) {
    var sRot = g_selectedModel.rotation.getValueDirect();
    g_selectedModel.rotation.setValueDirect(sRot.x, sRot.y-10, sRot.z);
  }
}

function rotateUp() {
  if (g_selectedModel) {
    var sRot = g_selectedModel.rotation.getValueDirect();
    g_selectedModel.rotation.setValueDirect(sRot.x+10, sRot.y, sRot.z);
  }
}

function addRemoveRoam(collides) {
  if (g_selectedModel && g_selectedModel.moveable.getValueDirect()) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "";
    if (bridgeworks.get('Roaming_' + name)) {
      cmd = "<Update>";
      cmd += "<Remove target='Roaming_" + name + "'/>";
      cmd += "<Set target='" + name + "'>";
      cmd += "<color r='"+ g_selectedModel.previousColor.r +"' g='"+ g_selectedModel.previousColor.g +"' b='"+ g_selectedModel.previousColor.b + "' a='"+ g_selectedModel.previousColor.a + "'/>"
      cmd += "</Set>";
      cmd += "</Update>";
    } else {
      // handle optional param
      var detectCollision = true;
      var detectObstruction = collides ? false : true;
      cmd = "<Update><AnimalMover name='Roaming_" + name + "' target='" + name
      + "' linearSpeed='1' angularSpeed='10'/>";
      cmd += "<Set target='" + name + "' detectCollision='" + true + "' detectObstruction='" + detectObstruction + "'>";
      if (detectObstruction) {
        cmd += "<color r='0' g='1' b='0' a='1'/>"
      } else {
        cmd += "<color r='1' g='0' b='0' a='1'/>"
      }
      cmd += "</Set>"
      cmd += "</Update>";

      g_selectedModel.previousColor = g_selectedModel.color.getValueDirect();
    }
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function setRoamSpeed(speed) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Roaming_" + name + "' linearSpeed='" + speed + "'/>";

    bridgeworks.updateScene(cmd);
  }
}

function addRemoveFader() {
  if (g_selectedModel && g_selectedModel.moveable.getValueDirect()) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "";
    if (bridgeworks.get('Fader_' + name + '_AutoInterpolator')) {
      cmd = "<Update><Remove target='Fader_" + name + "_AutoInterpolator'/><Set target='" + name + "' opacity='1'/></Update>";
    } else {
      cmd = "<AutoInterpolate name='Fader_" + name + "' postBehavior='3' target='" + name + "' opacity='0'/>";
    }

    bridgeworks.updateScene(cmd);
  }
}

function setFaderDuration(duration) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Fader_" + name + "_AutoInterpolator' duration='" + duration + "'/>";

    bridgeworks.updateScene(cmd);
  }
}

function addRemoveGrower() {
  if (g_selectedModel && g_selectedModel.moveable.getValueDirect()) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "";
    if (bridgeworks.get('Grower_' + name + '_AutoInterpolator')) {
      cmd = "<Update><Remove target='Grower_" + name + "_AutoInterpolator'/><Set target='" + name + "' opacity='1'/></Update>";
    } else {
      cmd = "<AutoInterpolate name='Grower_" + name + "' postBehavior='3' target='" + name + "'><scale x='3' y='3' z='3'/></AutoInterpolate>";
    }

    bridgeworks.updateScene(cmd);
  }
}

function setGrowerDuration(duration) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Grower_" + name + "' duration='" + duration + "'/>";

    bridgeworks.updateScene(cmd);
  }
}

function addRemovePhysics() {
  if (g_selectedModel) {
    console.log("got physics?");

    var hasPhysics = g_selectedModel.physicsEnabled.getValueDirect();

    g_selectedModel.physicsEnabled.setValueDirect(!hasPhysics);
  }
}

function addRemoveSpinner() {
  if (g_selectedModel && g_selectedModel.moveable.getValueDirect()) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "";
    if (bridgeworks.get('Spinner_' + name)) {
      cmd = "<Remove target='Spinner_" + name + "'/>";
    } else {
      var pw = bridgeworks.selector.pointWorld.getValueDirect();

      cmd = "<Spinner name='Spinner_" + name + "' angularVelocity='10' target='" + name + "'>";
      cmd += "<axisEndpoint ";
      cmd += "x='" + pw.x + "' ";
      cmd += "y='" + pw.y + "' ";
      cmd += "z='" + pw.z + "'/>";
      cmd += "</Spinner>";
    }

    bridgeworks.updateScene(cmd);
  }
}

function setSpinnerVelocity(velocity) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Spinner" + name + "' angularVelocity='" + velocity + "'/>";

    bridgeworks.updateScene(cmd);
  }
}


function scalePart(delta) {


    if (g_selectedModel) {
      var scale = g_selectedModel.scale.getValueDirect();
      if (delta > 0 || scale.x > .2) {
        scale.x += delta;
        scale.y += delta;
        scale.z += delta;
        g_selectedModel.scale.setValueDirect(scale.x, scale.y, scale.z);
      }
    }
}

function setMass(mass) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='" + name + "'>";
    cmd += "<physicalProperties><mass>" + mass + "</mass></physicalProperties>";
    cmd += "</Set>";

    bridgeworks.updateScene(cmd);
  }
}

function showHideSelected() {
  if (g_selectedModel) {
    var show = g_selectedModel.show.getValueDirect();
    g_selectedModel.show.setValueDirect(!show);
  }
}
