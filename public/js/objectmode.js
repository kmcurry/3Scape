function objectLeft()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(10,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectRight()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(-10,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectDown()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,-10,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectBackward()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,-10);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectUp()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,10,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectForward(){
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,10);

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

function addRemoveRoam() {
  if (g_selectedModel && g_selectedModel.moveable.getValueDirect()) {
    var name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "";
    if (bridgeworks.get('Roaming_' + name)) {
      cmd = "<Remove target='Roaming_" + name + "'/>";
    } else {
      cmd = "<AnimalMover name='Roaming_" + name + "' target='" + name + "' linearSpeed='1' angularSpeed='10'/>";
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

function setModelScale(value) {

    if (g_selectedModel) {
        g_selectedModel.scale.setValueDirect(value, value, value);
    }
}

function showHideSelected() {
  if (g_selectedModel) {
    var show = g_selectedModel.show.getValueDirect();
    g_selectedModel.show.setValueDirect(!show);
  }
}
