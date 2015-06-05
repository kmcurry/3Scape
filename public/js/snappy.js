// consolidating globals here until refactored
var g_copyModel = null;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;

var bridgeworks = null;




// functions are organized by alpha until refactored

function copy()
{
    if (g_selectedModel) {
        g_copyModel = g_selectedModel; // loadModel handles the rest
    }
}

function countParts() {
  var parts = "undefined";
  var partCount = 0;
  parts = bridgeworks.registry.getByType(eAttrType.Ball);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Beam);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Box);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Gear);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Plank);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Pyramid);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Wall);
  partCount += (parts == undefined) ? 0 : parts.length;
  parts = bridgeworks.registry.getByType(eAttrType.Wedge);
  partCount += (parts == undefined) ? 0 : parts.length;
  console.log("Counted " + partCount + " parts");
  return partCount;
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

function loadModel(url, copy)
{
    copy = copy || false;

    if (g_selectedModel) {
        g_selectedModel.getAttribute("highlight").setValueDirect(false);
    }


    loadFile("BwContent/" + url, processModelXML, copy);
}


function new3Scape() {

    post3Scape();

    console.log("Client is creating a new 3Scape.");

    loadgrid50();

    $.ajax({
      url: 'new',
      type: 'POST',
      contentType: 'application/json',
      success: synchLocalScapeRef
    });

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
function processModelXML(copy) {

    var model = this.responseXML.getElementsByTagName("Model")[0] ||
                this.responseXML.getElementsByTagName("Box")[0] ||
                this.responseXML.getElementsByTagName("Ball")[0] ||
                this.responseXML.getElementsByTagName("Beam")[0] ||
                this.responseXML.getElementsByTagName("Plank")[0] ||
                this.responseXML.getElementsByTagName("Wall")[0];

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
                                pointWorld.y - bbox_min.y + 0.1,//normalWorld.y,
                                pointWorld.z - normalWorld.z);
    g_selectedModel.getAttribute("position").setValueDirect(position.x, position.y, position.z);

    $(".menu").removeClass("active");

    console.log("Part added: '" + name + "'");
}


function reset() {

  g_sceneInspector = null;
  g_objectInspector = null;

  g_selectedModel = null;
  g_selectPointModel = null;

}

function post3Scape() {

  if (synchLocalScape()) {

    $.ajax({
      url: 'save',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        scape: serializedScene, // WARNING: GLOBAL VAR SHARED WITH BRIDGEWORKS!
        scapeRef: localStorage.getItem("scapeRef")
      })/*,
      success: function (scapeRef) {
        localStorage.removeItem(scapeRef);
      }*/
    });
  }
}

function start3Scape(scape, scapeRef) {

  bridgeworks = initBw(document.getElementById("BwContainer"));

  if (!bridgeworks) { console.log("halted and caught fire"); return; }

  if (scape && scape != "") { // if the url included a scape
    bridgeworks.updateScene(scape);
    if (scapeRef) {
      localStorage.setItem("scapeRef", scapeRef);
    }
  } else { // ...try the last thing in local storage
    var localScape = localStorage.getItem("3Scape");
    if (localScape) {
      console.log("We've scaped this scape before");
      bridgeworks.updateScene(localScape);
    }
    else { // ...otherwise this is a new 3scape.
      console.log("Starting 3Scape with a shiny new 3Scape!");
      new3Scape();
    }
  }

  window.addEventListener("beforeunload", unload3Scape);

}

function serializeBw(){
  serializedScene = ""; // WARNING: GLOBAL VAR SHARED WITH BRIDGEWORKS!

  var command = "<Serialize target='Root'/>";
  bridgeworks.updateScene(command);
}

function unload3Scape() {
  synchLocalStorage();
  post3Scape();
  localStorage.removeItem("scapeRef");
}

function synchLocalScape(scapeRef) {

  var success = false;

  if (countParts() > 0) {
    console.log("Updating localStorage");
    serializeBw();
    localStorage.setItem("3scape",serializedScene); // WARNING: GLOBAL VAR SHARED WITH BRIDGEWORKS!
    success = true;
  }

  return success;

}

function synchLocalScapeRef(scapeRef) {
  if (scapeRef) {
    localStorage.setItem("scapeRef", scapeRef);
  }
}
