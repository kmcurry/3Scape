// consolidating globals here until refactored
var g_copiedUrl = "";
var g_copyModel = null;
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
var g_interval = null;


// functions are organized by alpha until refactored

function copy()
{
  // nothing to do
}

function cut()
{
  if (g_selectedModel) {
    copy();
    var name = g_selectedModel.name.getValueDirect().join("");
    var c = "\<Remove target='" + name + "'/>"
    bridgeworks.updateScene(c);
    console.log(name);

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

var onHoldFunction = function(id, method, time) {
  $(id).on({
    mousedown : function () {
      method(); // Still works on a single click
      g_interval = window.setInterval(function(){
        method();
      }, time); //Repeats every (time) miliseconds
    },
    mouseup : function () {
      window.clearInterval(g_interval);
    }
  });
}

function paste()
{
  if (g_selectedModel) {
    console.log("pasting...");

    g_selectedModel.getAttribute("highlight").setValueDirect(false);

    var url = g_selectedModel.url.getValueDirect().join("");
    var modelName = url.substring(url.indexOf('/')+1, url.indexOf('.'));
    console.log(modelName);

    // this will update g_selectedModel
    loadModel(modelName + ".xml");

    //g_selectedModel.scale.setValueDirect(Size, Size, Size);
    //g_selectedModel.rotation.setValueDirect(rotX, rotY, rotZ);
    //g_selectedModel.color.setValueDirect(R, G, B); // ?? Y not? - KMC

    // TODO: g_selectedModel.copyModel();
  }
}
