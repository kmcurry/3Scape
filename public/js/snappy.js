// consolidating globals here until refactored
var g_copyModel = null;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;

var g_modelCount = 1;

var bridgeworks = null;



// functions are organized by alpha until refactored

function autoSave(){

  if (true) {
    serializedScene = "";

    var command = "<Serialize target='Root'/>";
    bridgeworks.updateScene(command);
    localStorage.setItem("autoSave",serializedScene);
  }
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

        $('#model-menu').toggleClass('active', false);
    }
}

function getWorkInProgress() {
  return localStorage.getItem("autoSave");
}

function loadModel(url, copy)
{
    copy = copy || false;

    if (g_selectedModel) {
        g_selectedModel.getAttribute("highlight").setValueDirect(false);
    }

    var name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    name = g_modelCount.toString() + ". " + name;
    g_modelCount++;


    loadFile("BwContent/" + url, processModelXML, name, copy);
}


function new3Scape() {
    save3Scape();
    reset();
    bridgeworks.contentDir = '/BwContent';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('grid-50.xml');

    // QTP: post to server right away or wait until an autosave event?
    /*
    $.ajax({
      url: 'new',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({scape:localStorage.getItem('autoSave')}),
      success: updateLocalStorage
    });
    window.location.pathname = "/";
    */
}

function updateLocalStorage(scapeId) {
  console.log("Updating local storage for scape: " + scapeId);
  localStorage.setItem("scapeId", scapeId);
}

var onHoldInterval = null;
var onHoldFunction = function(id, method, time) {
    $(id).on({
        mousedown: function() {
            method(); // Still works on a single click
            onHoldInterval = window.setInterval(function() {
                method();
            }, time); //Repeats every (time) miliseconds
        },
        mouseup: function() {
            window.clearInterval(onHoldInterval);
        }
    });
}

function save3Scape() {

  autoSave();

  $.ajax({
    url: 'save',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      scapeId: localStorage.getItem('scapeId'),
      scape: localStorage.getItem('autoSave')
      })
  });
}

function start3Scape(scape, scapeId) {
  bridgeworks = init(document.getElementById("BwContainer"));

  if (scape && scape != "") {
    console.log("setting storage for: " + scapeId);
    localStorage.setItem('scapeId', scapeId);
    bridgeworks.updateScene(scape);
  } else {
    var localScape = getWorkInProgress();
    if (localScape && localScape != ""){
      console.log("Loading from local storage. Scape id is: " + localStorage.getItem("scapeId"));
      bridgeworks.updateScene(localScape);
    }
    else {
      new3Scape();
    }
  }

  var saveInterval = setInterval(autoSave, 30000);

  window.addEventListener("beforeunload", save3Scape);

}


function paste()
{
    if (g_copyModel) {

        var url = g_copyModel.url.getValueDirect().join("");
        var modelName = url.substring(url.indexOf('/') + 1, url.indexOf('.'));

        // this will update g_selectedModel
        loadModel(modelName + ".xml", true);
    }
}

// callback for loadFile
function processModelXML(name, copy) {

    var model = this.responseXML.getElementsByTagName("Model")[0];

    var n = model.attributes["name"];
    n.value = name;


    var xstr = (new XMLSerializer()).serializeToString(model);
    bridgeworks.updateScene(xstr);

    // set this here now so that controllers work on the loaded model
    g_selectedModel = bridgeworks.registry.find(name);

    g_selectedModel.getAttribute("highlight").setValueDirect(true);
    g_selectedModel.getAttribute("detectObstruction").setValueDirect(true);

    if (copy) {
        // TODO: g_copyModel.copyModel();
        console.log("copying...");

        var s = g_copyModel.scale.getValueDirect();
        var r = g_copyModel.rotation.getValueDirect();
        var c = g_copyModel.color.getValueDirect();

        if (g_copyModel.surfacesNode.getChildCount() > 0)
        {
            c = g_copyModel.surfacesNode.getChild(g_copyModel.surfacesNode.getChildCount() - 1).color.getValueDirect();
        }

        g_selectedModel.scale.setValueDirect(s.x, s.y, s.z);
        g_selectedModel.color.setValueDirect(c.r, c.g, c.b, c.a);
        g_selectedModel.rotation.setValueDirect(r.x, r.y, r.z);
    }

    // position model according to click point, click normal, and model's scaled bbox
    var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
    var normalWorld = bridgeworks.selector.normalWorld.getValueDirect();
    var scale = g_selectedModel.getAttribute("scale").getValueDirect();
    var bbox_min = g_selectedModel.getAttribute("bbox").getAttribute("min").getValueDirect();
    bbox_min.x *= scale.x;
    bbox_min.y *= scale.y;
    bbox_min.z *= scale.z;
    // formulate offset vector
    normalWorld = new Vector3D(normalWorld.x, normalWorld.y, normalWorld.z);
    normalWorld.multiplyVector(bbox_min);
    // formulate position (always shift by bbox_min.y in Y-axis)
    var position = new Vector3D(pointWorld.x - normalWorld.x,
                                pointWorld.y - bbox_min.y,//normalWorld.y,
                                pointWorld.z - normalWorld.z);
    g_selectedModel.getAttribute("position").setValueDirect(position.x, position.y, position.z);

    $(".menu").removeClass("active");
}


function reset() {

    g_modelCount = 1;

    g_sceneInspector = null;
    g_objectInspector = null;

    g_selectedModel = null;
    g_selectPointModel = null;


}
