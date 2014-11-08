function objectLeft(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0] -= magnitude) + "' y='" + g_selectedModel.position.values[1] + "' z='" + g_selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(g_selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectRight(magnitude)
{
  var cmd;
    console.log(modelName);
  if(modelName != "Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0] += magnitude) + "' y='" + g_selectedModel.position.values[1] + "' z='" + g_selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(g_selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }

}

function objectDown(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0]) + "' y='" + (g_selectedModel.position.values[1] -= magnitude) + "' z='" + g_selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(g_selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectBackward(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0]) + "' y='" + g_selectedModel.position.values[1] + "' z='" + (g_selectedModel.position.values[2] -= magnitude) + "'/>"
      cmd += "\</Set>";
      bridgeworks.updateScene(cmd);
  }
}

function objectUp(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0]) + "' y='" + (g_selectedModel.position.values[1] += magnitude) + "' z='" + g_selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      bridgeworks.updateScene(cmd);
  }
}

function objectForward(magnitude){
  var cmd;
  if(modelName !="Grid") {
      cmd = "\<Set target='" + g_selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (g_selectedModel.position.values[0]) + "' y='" + g_selectedModel.position.values[1] + "' z='" + (g_selectedModel.position.values[2] += magnitude) + "'/>"
      cmd += "\</Set>";
      bridgeworks.updateScene(cmd);
  }
}
