// consolidating globals here until refactored
var copiedUrl = "";
var R;
var G;
var B;
var Size;
var rotY;
var rotX;
var rotZ;
var copiedSelectedText;
var copiedElement = 0;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;
var g_selectedModelName = "";

var g_modelCount = 1;

// functions are organized by alpha until refactored

function copy()
{
  if (g_selectedModel) {

    copiedUrl = g_selectedModel.url.getValueDirect().join("");
    R = g_selectedModel.color.values[0];
    G = g_selectedModel.color.values[1];
    B = g_selectedModel.color.values[2];
    Size = g_selectedModel.scale.getValueDirect().x;
    rotX = g_selectedModel.rotation.getValueDirect().x;
    rotY = g_selectedModel.rotation.getValueDirect().y;
    rotZ = g_selectedModel.rotation.getValueDirect().z;
    copiedElement = 1;
  }
  else if (selectedThing)
  {
    copiedSelectedText = selectedText;
    console.log(copiedSelectedText);
    copiedElement = 2;
  }
}

function cut()
{
  if (g_selectedModel) {
    copy();
    var name = g_selectedModel.name.getValueDirect().join("");
    var c = "\<Remove target='" + name + "'/>"
    bridgeworks.updateScene(c);
    console.log(name);

    var panel = document.getElementById("object-panel");
    var link = document.getElementById("row" + name);
    panel.removeChild(link);
  }
  else {
    var c = "\<Remove target='" + selectedThing + "'/>"
    bridgeworks.updateScene(c);
  }
}

function exportSelected() {

  if (g_selectedModel) {

    var name = g_selectedModel.name.getValueDirect().join("");
    var c = "\<Export target='" + name + "' url='" + name + ".stl'/>"
    bridgeworks.updateScene(c);

  }

}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(e) {
      var text = reader.result;
      console.log(text);
      bridgeworks.onLoadModified();
      bridgeworks.updateScene(text);
    }

    reader.readAsText(f);
  }
}


function load(u)
{
  var url = u == null ? $('#url').val() : u;
  var ext = getFileExtension(url);
  var name = url;


  console.debug(name);
  switch(ext) {
    case "lwo":
      loadModel(url);
      break;
    case "mot":
      loadMotion(url);
      break;
    case "xml":
      //bridgeworks.updateScene(url);
      loadModel(url);
      break;
    }
}


function loadModel(url)
{
  var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
  name = g_modelCount.toString()+". "+name;
  g_modelCount++;


  var xml = loadXMLFile("BwContent/" + url);

  var model = xml.getElementsByTagName("Model")[0];

  var n = model.attributes["name"];
  n.value = name;


  var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

  var pos = xml.getElementsByTagName("position")[0];
  pos.attributes["x"].value = pointWorld.x.toString();
  pos.attributes["y"].value = pointWorld.y.toString();
  pos.attributes["z"].value = pointWorld.z.toString();


  var xstr = (new XMLSerializer()).serializeToString(xml);
  console.debug(xstr);
  bridgeworks.updateScene(xstr);

  // set this here now so that controllers work on the loaded model
  g_selectedModel = bridgeworks.registry.find(name);
  g_selectedModelName = name;


  var physics = bridgeworks.get("PhysicsSimulator");
  if (physics && g_selectedModel) {
    physics.bodies.push_back(g_selectedModel.getAttribute("name"));
    console.log("# Bodies = " + physics.bodies.size.getValueDirect());
  }

}


//Locates the target given the name and also sets current object to be the object located
function locate(name) {
  var cmd = "\<Locate target='" + name + "'/>";
  g_selectedModel = bridgeworks.registry.find(name);
  bridgeworks.updateScene(cmd);
}

function new3Scape() {
  reset();
  bridgeworks.contentDir='/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('grid-100.xml');
}

function paste()
{

  if(copiedElement == 2) // if a label ??
  {
    var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

    var name = xml.getElementsByTagName("Model")[0].attributes[0];
    name.value = g_labelName;

    var pos = xml.getElementsByTagName("position")[0];
    pos.attributes["x"].value = pointWorld.x.toString();
    pos.attributes["y"].value = pointWorld.y.toString();
    pos.attributes["z"].value = pointWorld.z.toString();


    name = xml.getElementsByTagName("Group")[0].attributes[0];
    name.value = "Group_" + g_labelName;


    var xstr = (new XMLSerializer()).serializeToString(xml);
    console.debug(xstr);
    bridgeworks.updateScene(xstr);

  }
  else if(copiedElement == 1) { // if a model

    if (g_selectedModel) g_selectedModel.getAttribute("highlight").setValueDirect(false);

    // this will update g_selectedModel
    load(copiedUrl);

    g_selectedModel.getAttribute("highlight").setValueDirect(true);

    //console.log("Pasting: " + g_selectedModel.name.getValueDirect());

    g_selectedModel.scale.setValueDirect(Size, Size, Size);
    g_selectedModel.rotation.setValueDirect(rotX, rotY, rotZ);
    //g_selectedModel.color.setValueDirect(R, G, B); // ?? Y not? - KMC

    name = g_selectedModel.name.getValueDirect().join("");
    var cmd = "\<Set target='" + name + "'>" + "\<color r= '" + R + "' " + "g= '" + G + "' " + "b= '" + B + "'/>" + "</Set>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
  }
}

function reset() {

  g_currSlide = 0;
  g_isPlaying = 0;
  g_labelCount = 0;
  g_numSlides = 0;
  g_slidesPlayed = 0;
  g_modelCount = 1;
  g_motionCount = 1;
  g_sceneInspector = null;
  g_objectInspector = null;

  $('#object-panel').empty();
  $('#animate-panel').empty();
  $('#slide-list').empty();

  g_selectedModel = null;
  g_selectedModelName = "";

  // serializedScene is a global shared by Bridgeworks!
  // Need to fix this.
  serializedScene = "";
}


function toggleMoveable(name) {
  if (!name) {
    name = g_selectedModel.name.getValueDirect().join("");
  }
  var m = !(g_selectedModel.moveable.getValueDirect());

  var cmd = "\<Set target='" + name + "' moveable='" + m + "'/>";
  console.log(cmd);
  bridgeworks.updateScene(cmd);

  g_selectedModel.getAttribute("highlight").setValueDirect(m);
}

function trashModel(name)
{
  var c = "\<Remove target='" + name + "'/>";
  console.log(c);
  bridgeworks.updateScene(c);

  var panel = document.getElementById("object-panel");
  var link = document.getElementById("row" + name);
  panel.removeChild(link);
}
