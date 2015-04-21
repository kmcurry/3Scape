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
    g_selectedModel.rotation.setValueDirect(sRot.x, sRot.y-10, sRot.z);
  }
}


function rotateRight() {
  if (g_selectedModel) {
    var sRot = g_selectedModel.rotation.getValueDirect();
    g_selectedModel.rotation.setValueDirect(sRot.x, sRot.y+10, sRot.z);
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
      cmd = "<Remove target='Roaming_" + name + "'/>";
    } else {
      var detectCollisions = true;
      if (collides != null && collides != 'undefined') {
          detectCollisions = collides
      }
      cmd = "<AnimalMover name='Roaming_" + name + "' target='" + name
      + "' linearSpeed='1' angularSpeed='10' detectCollisions='" + detectCollisions + "'/>";
    }
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function setRoamSpeed(speed) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Roaming_" + name + "' linearSpeed='" + speed + "'/>";
    console.log(cmd);
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
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function setFaderDuration(duration) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Fader_" + name + "_AutoInterpolator' duration='" + duration + "'/>";
    console.log(cmd);
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
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function setGrowerDuration(duration) {
  if (g_selectedModel) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "<Set target='Grower_" + name + "' duration='" + duration + "'/>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function setModelScale(value) {

    if (g_selectedModel) {
        g_selectedModel.scale.setValueDirect(value, value, value);
    }
}

function scalePart(delta) {

  console.log(delta);
    if (g_selectedModel) {
      var scale = g_selectedModel.scale.getValueDirect();
      if (scale.x > .1) {
        scale.x += delta;
        scale.y += delta;
        scale.z += delta;
        g_selectedModel.scale.setValueDirect(scale.x, scale.y, scale.z);
      }
    }
}

function showHideSelected() {
  if (g_selectedModel) {
    var show = g_selectedModel.show.getValueDirect();
    g_selectedModel.show.setValueDirect(!show);
  }
}
