// consolidating globals here until refactored
var g_copyModel = null;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;
var g_selectedModelName = "";

var g_modelCount = 1;
var g_interval = null;


// functions are organized by alpha until refactored

function copy()
{
  if (g_selectedModel) {
    g_copyModel = g_selectedModel;
  }
}

function cut()
{
  if (g_selectedModel) {
    copy();
    var name = g_selectedModel.name.getValueDirect().join("");
    var c = "\<Remove target='" + name + "'/>"
    bridgeworks.updateScene(c);
  }
}

function loadModel(url)
{

  if (g_selectedModel) {
    g_selectedModel.getAttribute("highlight").setValueDirect(false);
  }

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
  bridgeworks.updateScene(xstr);

  // set this here now so that controllers work on the loaded model
  g_selectedModel = bridgeworks.registry.find(name);
  g_selectedModelName = name;

  g_selectedModel.getAttribute("highlight").setValueDirect(true);


  var physics = bridgeworks.get("PhysicsSimulator");
  if (physics && g_selectedModel) {
    physics.bodies.push_back(g_selectedModel.getAttribute("name"));
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
  if (g_copyModel) {

    var url = g_copyModel.url.getValueDirect().join("");
    var modelName = url.substring(url.indexOf('/')+1, url.indexOf('.'));

    // this will update g_selectedModel
    loadModel(modelName + ".xml");

    //g_copyModel.scale.setValueDirect(Size, Size, Size);
    //g_copyModel.rotation.setValueDirect(rotX, rotY, rotZ);
    //g_copyModel.color.setValueDirect(R, G, B); // ?? Y not? - KMC

    // TODO: g_copyModel.copyModel();
  }
}
