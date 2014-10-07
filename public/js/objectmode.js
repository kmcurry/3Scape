function objectLeft(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0] -= magnitude) + "' y='" + selected.position.values[1] + "' z='" + selected.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectRight(magnitude)
{
  var cmd;
    console.log(modelName);
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0] += magnitude) + "' y='" + selected.position.values[1] + "' z='" + selected.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }

}

function objectDown(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0]) + "' y='" + (selected.position.values[1] -= magnitude) + "' z='" + selected.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectBackward(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0]) + "' y='" + selected.position.values[1] + "' z='" + (selected.position.values[2] -= magnitude) + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectUp(magnitude)
{
  var cmd;
  if(modelName != "Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0]) + "' y='" + (selected.position.values[1] += magnitude) + "' z='" + selected.position.values[2] + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}

function objectForward(magnitude){
  var cmd;
  if(modelName !="Grid") {
      cmd = "\<Set target='" + selected.name.getValueDirect().join("") + "'>";
      cmd += "\<position x='" + (selected.position.values[0]) + "' y='" + selected.position.values[1] + "' z='" + (selected.position.values[2] += magnitude) + "'/>"
      cmd += "\</Set>";
      console.log(selected.position.getValueDirect());
      bridgeworks.updateScene(cmd);
  }
}
