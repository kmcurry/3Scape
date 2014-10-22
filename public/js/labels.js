var g_labelName = null;
var g_countStr = "";
var g_labelCount = 0;

function addLabel()
{
    var nicE = new nicEditors.findEditor('title');
    var title = nicE.getContent();
    if (title != "") {
        var update = "\<Set target='Label_" + g_labelName + "' text='" + title + "' show='true'/>";
        console.debug(update);
        bridgeworks.updateScene(update);
        var cmd = "\<Remove target='"+g_labelName+"'/>";
        bridgeworks.updateScene(cmd);
        // This flag is checked on dialog close. If true on close
        // then there are some things to undo.
        // If we made it this far then there is nothing to undo.
        adding = false;
        editorOpen = 0;
    }
    $( "#dialog" ).dialog("close");
}
function addBalloon()
{
  var nicE = new nicEditors.findEditor('title');
  var title = nicE.getContent();
  if (title != "") {
      var update = "\<Set target='Label_" + g_labelName + "/balloonTipLabelStyle/htmlLabelStyle'>";
      update += "\<html><![CDATA["+ title +"]]></html>";
      update += "</Set>";
      console.debug(update);
      bridgeworks.updateScene(update);
      var cmd = "\<Set target='Label_" + g_labelName + "' show='true'/>";
      bridgeworks.updateScene(cmd);
      // This flag is checked on dialog close. If true on close
      // then there are some things to undo.
      // If we made it this far then there is nothing to undo.
      adding = false;
      editorOpen = 0;
      edit = 0;
  }
  $( "#dialog" ).dialog("close");
}

function editLabel(labelName)
{
  var nicE = new nicEditors.findEditor('title');
  if(selectedThing) {
      var title = nicE.getContent();
  }
  console.log("editLabel: "+labelName);
  var update = "\<Set target='" + labelName + "' text='" + title + "' show='true'/>";
  console.debug(update);
  bridgeworks.updateScene(update);
  console.log(g_labelName);
  edit = 0;
  $( "#dialog" ).dialog("close");
}

function createLabel()
{

  adding = true;
  editorOpen = 1;

  var pointWorld = bridgeworks.selector.pointObject.getValueDirect();

  g_countStr = g_labelCount.toString();
  g_labelCount = g_labelCount + 1;
  var graphMgr = bridgeworks.registry.find("GraphMgr");
  graphMgr.getNextLabelIndex();
  console.log(graphMgr.labelIndex);

  g_labelName = "L-" + g_countStr;

  var xml = loadXMLFile("BwContent/label.xml");

  var name = xml.getElementsByTagName("Model")[0].attributes[0];
  name.value = g_labelName;

  var pos = xml.getElementsByTagName("position")[0];
  pos.attributes["x"].value = pointWorld.x.toString();
  pos.attributes["y"].value = pointWorld.y.toString();
  pos.attributes["z"].value = pointWorld.z.toString();

  var label = xml.getElementsByTagName("Label")[0];
  label.attributes["name"].value = "Label_" + name.value;
  if(selectedModel)
  {
      label.attributes["parent"].value = modelName;
      console.log(modelName)
  }
  else {
      label.attributes["parent"].value = name.value;
      console.log("No Model");
  }

  var labPos = xml.getElementsByTagName("position")[1];
  var posX = pointWorld.x - selectedModel.position.values[0];
  var posY = pointWorld.y - selectedModel.position.values[1];
  var posZ = pointWorld.z - selectedModel.position.values[2];
  labPos.attributes["x"].value = posX.toString();
  labPos.attributes["y"].value = posY.toString();
  labPos.attributes["z"].value = posZ.toString();

  name = xml.getElementsByTagName("Group")[0].attributes[0];
  name.value = "Group_" + g_labelName;


  var xstr = (new XMLSerializer()).serializeToString(xml);
  console.debug(xstr);
  bridgeworks.updateScene(xstr);
  if(g_labelCount > 2) {
      var nicE = new nicEditors.findEditor('title').setContent("");
  }
  $( "#dialog" ).dialog("open");
}
function createBalloon()
{
  edit = 2;
  var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

  g_labelCount = g_labelCount + 1;
  g_countStr = g_labelCount.toString();

  g_labelName = "L-" + g_countStr;

  var xml = loadXMLFile("BwContent/BalloonTipLabel.xml");

  var name = xml.getElementsByTagName("Model")[0].attributes[0];
  name.value = g_labelName;

  var pos = xml.getElementsByTagName("position")[0];
  pos.attributes["x"].value = pointWorld.x.toString();
  pos.attributes["y"].value = pointWorld.y.toString();
  pos.attributes["z"].value = pointWorld.z.toString();

  var label = xml.getElementsByTagName("BalloonTipLabel")[0];
  label.attributes["name"].value = "Label_" + name.value;
  if(selectedModel)
  {
      label.attributes["parent"].value = modelName;
      console.log(modelName)
  }
  else {
      label.attributes["parent"].value = name.value;
      console.log("No Model");
  }

  pos.attributes["x"].value = pointWorld.x.toString();
  pos.attributes["y"].value = pointWorld.y.toString();
  pos.attributes["z"].value = pointWorld.z.toString();

  name = xml.getElementsByTagName("Group")[0].attributes[0];
  name.value = "Group_" + g_labelName;


  var xstr = (new XMLSerializer()).serializeToString(xml);
  console.debug(xstr);
  bridgeworks.updateScene(xstr);

  var cmd = "\<Remove target='"+g_labelName+"'/>";
  bridgeworks.updateScene(cmd);

  if(g_labelCount > 2) {
      var nicE = new nicEditors.findEditor('title').setContent("");
  }
  $( "#dialog" ).dialog("open");
}

function openLabelEdit()
{
    if(textBoxMade == 0)
    {
        new nicEditor({
            iconsPath : 'nicEditorIcons.gif'
        }).panelInstance('title');
        adding = true;
    }
    edit = 1;
    new nicEditors.findEditor('title').setContent(selectedText);
    $( "#dialog" ).dialog("open");
}
