function objectLeft(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0] -= magnitude) + "' y='" + selectedModel.position.values[1] + "' z='" + selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectRight(magnitude)
{
  var cmd;
    console.log(modelName);
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0] += magnitude) + "' y='" + selectedModel.position.values[1] + "' z='" + selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }

}

function objectDown(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + (selectedModel.position.values[1] -= magnitude) + "' z='" + selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectBackward(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + selectedModel.position.values[1] + "' z='" + (selectedModel.position.values[2] -= magnitude) + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectUp(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + (selectedModel.position.values[1] += magnitude) + "' z='" + selectedModel.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectForward(magnitude){
  var cmd;
  if(modelName !="Grid") {
      cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + selectedModel.position.values[1] + "' z='" + (selectedModel.position.values[2] += magnitude) + "'/>"
      cmd += "\</Set>";
      console.log(selectedModel.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}
