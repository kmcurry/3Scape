function objectLeft()
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(10,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectRight(magnitude)
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(-10,0,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectDown(magnitude)
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,-10,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectBackward(magnitude)
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,-10);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectUp(magnitude)
{
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,10,0);

    g_objectInspector.enabled.setValueDirect(false);
  }
}

function objectForward(magnitude){
  if(g_objectInspector && g_selectedModel) {
    g_objectInspector.runSelectionOccurred();

    g_objectInspector.enabled.setValueDirect(true);

    g_objectInspector.translationDelta.setValueDirect(0,0,10);

    g_objectInspector.enabled.setValueDirect(false);
  }
}
