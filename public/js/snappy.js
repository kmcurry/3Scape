// consolidating globals here until refactored
var g_copyModel = null;


var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;

var g_modelCount = 1;



// functions are organized by alpha until refactored

function applyColor(hex)
{
    if (g_selectedModel) {
        var r = parseInt(hex.substring(0, 2), 16) / 256;
        var g = parseInt(hex.substring(2, 4), 16) / 256;
        var b = parseInt(hex.substring(4, 6), 16) / 256;
        var color = g_selectedModel.color.getValueDirect();
        g_selectedModel.color.setValueDirect(r, g, b, color.a);
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

function new3Scape() {
    reset();
    bridgeworks.contentDir = '/BwContent';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('grid-50.xml');
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


    //var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

    //var pos = model.getElementsByTagName("position")[0];
    //pos.attributes["x"].value = pointWorld.x.toString();
    //pos.attributes["y"].value = pointWorld.y.toString();
    //pos.attributes["z"].value = pointWorld.z.toString();


    var xstr = (new XMLSerializer()).serializeToString(model);
    bridgeworks.updateScene(xstr);

    // set this here now so that controllers work on the loaded model
    g_selectedModel = bridgeworks.registry.find(name);

    g_selectedModel.getAttribute("highlight").setValueDirect(true);

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

    var physics = bridgeworks.get("PhysicsSimulator");
    if (physics && g_selectedModel) {
        physics.bodies.push_back(g_selectedModel.getAttribute("name"));
    }

    $(".menu").removeClass("active");
}


function reset() {

    g_modelCount = 1;

    g_sceneInspector = null;
    g_objectInspector = null;

    g_selectedModel = null;

    $("#model-menu").toggleClass('active', false);

}

function roam(name) {
    if (!name) {
        name = g_selectedModel.name.getValueDirect().join("");
    }

    if (g_selectedModel.moveable.getValueDirect()) {

        var cmd = "\<AnimalMover name='" + name + "_roam' target='" + name + "' linearSpeed='1' angularSpeed='20'/>";
        console.log(cmd);
        bridgeworks.updateScene(cmd);
    }
}

function setModelScale(value) {

    if (g_selectedModel) {
        g_selectedModel.scale.setValueDirect(value, value, value);
    }
}

function spinZ() {
    if (!g_selectedModel)
        return false;

    var name = g_selectedModel.name.getValueDirect().join("");

    var xml = "<AutoInterpolate target='" + name + "'>";
    xml += "<rotation x='0' y='0' z='360'/>";
    xml += "</AutoInterpolate>";

    console.log(xml);

    bridgeworks.updateScene(xml);

    return true;
}
