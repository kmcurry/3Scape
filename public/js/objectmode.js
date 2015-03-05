function objectLeft()
{
  if(g_objectInspector) {
    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(-10,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectRight(magnitude)
{
  if(g_selectedModel) {
    g_selectedModel.position.setValueDirect(
      g_selectedModel.position.values[0] + magnitude,
      g_selectedModel.position.values[1],
      g_selectedModel.position.values[2]
    );
  }
}

function objectDown(magnitude)
{
  if(g_selectedModel) {
    g_selectedModel.position.setValueDirect(
      g_selectedModel.position.values[0],
      g_selectedModel.position.values[1] - magnitude,
      g_selectedModel.position.values[2]
    );
  }
}

function objectBackward(magnitude)
{
  if(g_selectedModel) {
    g_selectedModel.position.setValueDirect(
      g_selectedModel.position.values[0],
      g_selectedModel.position.values[1],
      g_selectedModel.position.values[2] - magnitude
    );
  }
}

function objectUp(magnitude)
{
  if(g_selectedModel) {
    g_selectedModel.position.setValueDirect(
      g_selectedModel.position.values[0],
      g_selectedModel.position.values[1] + magnitude,
      g_selectedModel.position.values[2]
    );
  }
}

function objectForward(magnitude){
  if(g_selectedModelName) {
    g_selectedModel.position.setValueDirect(
      g_selectedModel.position.values[0],
      g_selectedModel.position.values[1],
      g_selectedModel.position.values[2] + magnitude
    );
  }
}
