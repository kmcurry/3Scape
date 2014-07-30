function addRecord(){
  var nicE = new nicEditors.findEditor('title');
  var title = nicE.getContent();
  //var title = $( "#title" ).val();
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
  $("#dialog").dialog("close");
};

function addBalloon(){
  var nicE = new nicEditors.findEditor('title');
  var title = nicE.getContent();
  //var title = $( "#title" ).val();
  if (title != "") {
    var update = "\<Set target='Label_" + g_labelName + "/balloonTipLabelStyle/htmlLabelStyle'>";
    update += "\<html><![CDATA["+ title +"]]></html>";
    //update += "\<html>"+ title + "</html>";
    update += "</Set>";
    console.debug(update);
    bridgeworks.updateScene(update);
    var cmd = "\<Set target='Label_" + g_labelName + "' show='true'/>";
    bridgeworks.updateScene(cmd);
    // var cmd = "\<Remove target='"+g_labelName+"'/>";
    // bridgeworks.updateScene(cmd);
    // This flag is checked on dialog close. If true on close
    // then there are some things to undo.
    // If we made it this far then there is nothing to undo.
    adding = false;
    editorOpen = 0;
    edit = 0;
  }
  $("#dialog").dialog("close");
};

function editRecord(labelName){
  var nicE = new nicEditors.findEditor('title');
  var title = nicE.getContent();
  console.log("EDITRECORD: "+labelName);
  var update = "\<Set target='" + labelName + "' text='" + title + "' show='true'/>";
  console.debug(update);
  bridgeworks.updateScene(update);
  console.log(g_labelName);
  edit = 0;
  $("#dialog").dialog("close");
};

function createRecord(){
  adding = true;
  editorOpen = 1;
  var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
  g_labelCount = g_labelCount + 1;
  g_countStr = g_labelCount.toString();
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
  if(selectedModel){
    label.attributes["parent"].value = modelName;
    console.log(modelName)
  }else {
    label.attributes["parent"].value = name.value;
    console.log("No Model");
  }
  name = xml.getElementsByTagName("Group")[0].attributes[0];
  name.value = "Group_" + g_labelName;
  var xstr = (new XMLSerializer()).serializeToString(xml);
  console.debug(xstr);
  bridgeworks.updateScene(xstr);
  if(g_labelCount > 1) {
    var nicE = new nicEditors.findEditor('title').setContent("");
  }
  $("#dialog").dialog("open");
  //addRecord();
};

function createBalloon(){
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
  if(selectedModel){
    label.attributes["parent"].value = modelName;
    console.log(modelName)
  }else {
    label.attributes["parent"].value = name.value;
    console.log("No Model");
  }
  name = xml.getElementsByTagName("Group")[0].attributes[0];
  name.value = "Group_" + g_labelName;
  var xstr = (new XMLSerializer()).serializeToString(xml);
  console.debug(xstr);
  bridgeworks.updateScene(xstr);
  var cmd = "\<Remove target='"+g_labelName+"'/>";
  bridgeworks.updateScene(cmd);
  if(g_labelCount > 1) {
      var nicE = new nicEditors.findEditor('title').setContent("");
  }
  $("#dialog").dialog("open");
};

function openLabelEdit(){
  edit = 1;
  new nicEditors.findEditor('title').setContent(selectedText);
  $("#dialog").dialog("open");
}

$('html').bind('keypress', function(e){
  if(e.keyCode == 13)
  {
    if ($("#dialog").dialog( "isOpen" )===true && edit == 0) {
      addRecord();
      console.log("Not editting");
    }
    else if($("#dialog").dialog( "isOpen")===true && edit ==1){
      editRecord(selected);
    }
    else if($("#dialog").dialog( "isOpen")===true && edit ==2)
    {
      addBalloon();
    }
    return false;
   }
});

$("#submitLabel").click(function(){
  if(edit == 0)
  {
    addRecord();
  }
  else if(edit==1)
  {
    editRecord(selected);
  }
  else if(edit==2)
  {
    addBalloon();
  }
});
$("#dialog").dialog({
  autoOpen: false,
  modal: true
});            
$("#dialog").dialog({ show: { effect: "blind", duration: 200 } });            
$("#dialog").dialog({ hide: { effect: "blind", duration: 200 } });
$( "#dialog").dialog({open: function(event,ui) {
  nicText = new nicEditor({
    iconsPath : 'nicEditorIcons.gif'
  }).panelInstance('title');
  }
});

$("#dialog").dialog({
  close: function( event, ui ) {
    if (adding) {
      // if in the middle of adding and closed w/o submitting
      bridgeworks.updateScene("\<Remove target='" + "Group_L-" + g_countStr + "'/>");
      var cmd = "\<Remove target='"+g_labelName+"'/>";
      bridgeworks.updateScene(cmd);
    }
    adding = false;
    editorOpen = 0;
  }
});