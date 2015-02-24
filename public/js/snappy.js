// consolidating globals here until refactored
var g_copyModel = null;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;
var g_selectedModelName = "";

var g_modelCount = 1;
var g_interval = null;


// functions are organized by alpha until refactored

function applyColor(hex)
{
  var name = g_selectedModel.name.getValueDirect().join("");
  var r = parseInt(hex.substring(0, 2), 16)/256;
  var g = parseInt(hex.substring(2, 4), 16)/256;
  var b = parseInt(hex.substring(4, 6), 16)/256;
  var cmd = "\<Set target='"+name+"'>" + "\<color r= '" +r+ "' " + "g= '"+g+"' " + "b= '" +b+ "' a='1'" + "/>" +"\</Set>";
  bridgeworks.updateScene(cmd);
}

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


  loadFile("BwContent/" + url, processModelXML, name);
}

function processModelXML(name) {

  var model = this.responseXML.getElementsByTagName("Model")[0];

  var n = model.attributes["name"];
  n.value = name;


  var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

  var pos = model.getElementsByTagName("position")[0];
  pos.attributes["x"].value = pointWorld.x.toString();
  pos.attributes["y"].value = pointWorld.y.toString();
  pos.attributes["z"].value = pointWorld.z.toString();


  var xstr = (new XMLSerializer()).serializeToString(model);
  bridgeworks.updateScene(xstr);

  // set this here now so that controllers work on the loaded model
  g_selectedModel = bridgeworks.registry.find(name);
  g_selectedModelName = name;

  g_selectedModel.getAttribute("highlight").setValueDirect(true);


  var physics = bridgeworks.get("PhysicsSimulator");
  if (physics && g_selectedModel) {
    physics.bodies.push_back(g_selectedModel.getAttribute("name"));
  }

  $(".menu").removeClass("active");

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

    var s = g_copyModel.scale.getValueDirect();
    g_selectedModel.scale.setValueDirect(s.x, s.y, s.z);

    var r = g_copyModel.scale.getValueDirect();
    g_selectedModel.scale.setValueDirect(r.x, r.y, r.z);

    var c = g_copyModel.color.getValueDirect();
    g_selectedModel.color.setValueDirect(c.r, c.g, c.b, c.a);

    // TODO: g_copyModel.copyModel();
  }
}
