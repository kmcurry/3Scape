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

function loadFish() {
    reset();
    bridgeworks.contentDir = '/BwContent/Fish/';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('scene.xml');
}

function loadTerrain() {
    reset();
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('Terrain.xml');
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

var onHoldFunction = function(id, method, time) {
    $(id).on({
        mousedown: function() {
            method(); // Still works on a single click
            g_interval = window.setInterval(function() {
                method();
            }, time); //Repeats every (time) miliseconds
        },
        mouseup: function() {
            window.clearInterval(g_interval);
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
    g_selectedModelName = name;

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

    // position model according to click point, click normal, and model's bbox
    var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
    var normalWorld = bridgeworks.selector.normalWorld.getValueDirect();
    var bbox_min = g_selectedModel.getAttribute("bbox").getAttribute("min").getValueDirect();
    var bbox_max = g_selectedModel.getAttribute("bbox").getAttribute("max").getValueDirect();
    var bbox_mid = new Vector3D((bbox_min.x + bbox_max.x) / 2,
                                (bbox_min.y + bbox_max.y) / 2,
                                (bbox_min.z + bbox_max.z) / 2);
    // find distance from center of bbox to edge of bbox along negative click normal
    var distance = FLT_MAX;
    var bbox_center_to_edge = new Line(bbox_mid, new Vector3D(normalWorld.x * -1, normalWorld.y * -1, normalWorld.z * -1));
    var bbox_planes = [];
    bbox_planes.push(new Plane(new Vector3D(bbox_max.x, bbox_mid.y, bbox_mid.z), new Vector3D( 1,  0,  0)));
    bbox_planes.push(new Plane(new Vector3D(bbox_min.x, bbox_mid.y, bbox_mid.z), new Vector3D(-1,  0,  0)));
    bbox_planes.push(new Plane(new Vector3D(bbox_mid.x, bbox_max.y, bbox_mid.z), new Vector3D( 0,  1,  0)));
    bbox_planes.push(new Plane(new Vector3D(bbox_mid.x, bbox_min.y, bbox_mid.z), new Vector3D( 0, -1,  0)));
    bbox_planes.push(new Plane(new Vector3D(bbox_mid.x, bbox_mid.y, bbox_max.z), new Vector3D( 0,  0,  1)));
    bbox_planes.push(new Plane(new Vector3D(bbox_mid.x, bbox_mid.y, bbox_min.z), new Vector3D( 0,  0, -1)));
    for (var i = 0; i < bbox_planes.length; i++)
    {
        var intersection = lineIntersectsPlane(bbox_center_to_edge, bbox_planes[i]);
        if (intersection.result)
        {
            distance = Math.min(distance, distanceBetween(bbox_mid, bbox_planes[i].point));
        }
    }
    // formulate position
    // scale click normal by distance from center of bbox to edge of bbox along negative click normal
    var position = new Vector3D(pointWorld.x - bbox_mid.x + (normalWorld.x * distance),
                                pointWorld.y - bbox_mid.y + (normalWorld.y * distance),
                                pointWorld.z - bbox_mid.z + (normalWorld.z * distance));
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
