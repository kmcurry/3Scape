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

var g_currSlide = 0;
var g_numSlides = 0;
var g_slidesPlayed = 0;
var g_isPlaying = 0;
var g_playSlider = null;
var g_timer = null;
var g_interval = null;

var g_sceneInspector = null;
var g_objectInspector = null;
var g_selectedModel = null;
var g_selectedModelName = "";

var g_modelCount = 1;
var g_motionCount = 1;

// functions are organized by alpha until refactored





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

function load2dvs3d() {
  reset();
  bridgeworks.contentDir='/BwContent/2Dvs3D/';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Pyramid.xml');
}

function loadbrakes() {
  reset();
  bridgeworks.contentDir='BwContent/Motorcycle';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('BrakeAssemblyLWS.xml');
}

function loadegypt() {
  reset();
  bridgeworks.contentDir='BwContent/Egypt';
  // don't call onloadModified b/c XML doesn't reset Bw
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Egypt.xml');
  g_numSlides = 10;
  g_currSlide = 1;
  //loadSlides(10);
}

function loadentymology() {
  reset();
  bridgeworks.contentDir='/BwContent/Entymology/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('formica_rufa.xml');
}

function loadhi5() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('HighFive.xml');
}

function loadhighfive() {
  loadhi5();
}

function loadlight() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Lights.xml');
}

function loadphysics() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Physics.xml');
}

function loadtwostroke() {
  reset();
  bridgeworks.contentDir='/BwContent/Engine/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Stihl.xml');
  loadSlides(1);
}

function loadundersea() {
  reset();
  bridgeworks.contentDir='/BwContent/Underwater/';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Underwater.xml');
}

var loaded = 0;
function listLibrary()
{
    var href = document.location.href;
    var url = href.substring(0, href.lastIndexOf('/')) + "/BwContent/";
    if(loaded == 0)
    {
        //Seperating the libs out and changing which panel they are loaded into.
        var panel = document.getElementById("panel-lib-shapeObjects");
        loadDirectoryObject(url,"objects/Cube.lwo",panel,"Cube");
        loadDirectoryObject(url,"objects/Grid.lwo",panel,"Grid");
        loadDirectoryObject(url,"objects/Sphere.lwo",panel,"Sphere");
        loadDirectoryObject(url,"objects/Tube.lwo",panel,"Tube");
        loadDirectoryObject(url,"objects/Wall.lwo",panel,"Wall");
        loadDirectoryObject(url,"Geography/objects/cone.lwo",panel,"Cone");
        loadDirectoryObject(url,"objects/Push Pin.lwo",panel,"Push_Pin");
        loadDirectoryObject(url,"objects/Wood.lwo",panel,"Wood");
        loadDirectoryObject(url,"objects/Gear.lwo",panel,"Gear");
        loadDirectoryObject(url,"objects/9VBattery.lwo",panel,"9VBattery");
        loadDirectoryObject(url,"objects/sword.lwo",panel,"Sword");
        loadDirectoryObject(url,"objects/Satellite.lwo",panel,"Satellite");
        loadDirectoryObject(url,"objects/table.lwo",panel,"Table");
        loadDirectoryObject(url,"objects/thor_hammer.lwo",panel,"Thor Hammmer");
        loadDirectoryObject(url,"objects/captain_hat.lwo",panel,"Captain Hat");
        loadDirectoryObject(url,"objects/Twig.lwo",panel,"Twig");

        panel = document.getElementById("panel-lib-animalObjects");
        loadDirectoryObject(url,"Animals/objects/Cow.lwo",panel,"Cow");
        loadDirectoryObject(url,"Animals/objects/trex.lwo",panel,"Trex");
        loadDirectoryObject(url,"Animals/objects/Ant.lwo",panel,"Ant");
        loadDirectoryObject(url,"objects/rhino.lwo",panel,"Rhino");
        loadDirectoryObject(url,"objects/elephant.lwo",panel,"Elephant");
        loadDirectoryObject(url,"objects/dolphin.lwo",panel,"Dolphin");
        loadDirectoryObject(url,"objects/dragon.lwo",panel,"Dragon");
        loadDirectoryObject(url,"objects/Creature.lwo",panel,"Creature");
        loadDirectoryObject(url,"objects/ammonite.lwo",panel,"Ammonite");

        panel = document.getElementById("panel-lib-peopleObjects");
		    loadDirectoryObject(url,"Characters/objects/bobble-body.lwo",panel,"Bobble Head Body");
        loadDirectoryObject(url,"Characters/objects/DanPatrick.lwo",panel,"Ham Patrick");
		    //loadDirectoryObject(url,"People/objects/B rifleman.lwo",panel,"Rifleman");
        loadDirectoryObject(url,"People/objects/Civilian.lwo",panel,"Civilian");
        loadDirectoryObject(url,"People/objects/RECON.lwo",panel,"RECON");
        //loadDirectoryObject(url,"People/objects/SOF_gun.lwo",panel,"SOF_gun");
        //loadDirectoryObject(url,"People/objects/Saw_Gunner.lwo",panel,"Saw_Gunner");
        //loadDirectoryObject(url,"People/objects/SOF.lwo",panel,"SOF");
        loadDirectoryObject(url,"People/objects/Soldier_look.lwo",panel,"Soldier_look");

        panel = document.getElementById("panel-lib-anatomyObjects");
        loadDirectoryObject(url,"Heart/objects/Heart_back.lwo",panel,"Heart_back");
        loadDirectoryObject(url,"Heart/objects/Heart_front.lwo",panel,"Heart_front");
        loadDirectoryObject(url,"Arm/objects/Arm.lwo",panel,"Arm");
        loadDirectoryObject(url,"Arm/objects/Bn_femur.lwo",panel,"Bn_femur");
        loadDirectoryObject(url,"Arm/objects/bones.lwo",panel,"bones");
        loadDirectoryObject(url,"Arm/objects/Hand.lwo",panel,"Hand");
        loadDirectoryObject(url,"Arm/objects/hand-skin.lwo",panel,"hand-skin");
        loadDirectoryObject(url,"Arm/objects/Humerus-Ulna.lwo",panel,"Humerus-Ulna");



        panel = document.getElementById("panel-lib-buildingObjects");
        loadDirectoryObject(url,"Barnville/objects/Barn.lwo",panel,"Barn");
        loadDirectoryObject(url,"Buildings/objects/Building.lwo",panel,"Building1");
        loadDirectoryObject(url,"Buildings/objects/building1.lwo",panel,"Building2");
        loadDirectoryObject(url,"Barnville/objects/Church.lwo",panel,"Church");
        loadDirectoryObject(url,"objects/medstreet.lwo",panel,"Village");
        loadDirectoryObject(url,"Buildings/objects/City_buildings.lwo",panel,"City_buildings");
        loadDirectoryObject(url,"Buildings/objects/shed.lwo",panel,"Shed");
        loadDirectoryObject(url,"Buildings/objects/shed2.lwo",panel,"Shed2");
        loadDirectoryObject(url,"Buildings/objects/shed3.lwo",panel,"Shed3");
        loadDirectoryObject(url,"Barnville/objects/Stone_Wall.lwo",panel,"Stone Wall");
        loadDirectoryObject(url,"Barnville/objects/Well.lwo",panel,"Well");
        loadDirectoryObject(url,"objects/Flag.lwo",panel,"Flag");
        loadDirectoryObject(url,"Buildings/objects/RadioTower.lwo",panel,"Radio Tower");
        loadDirectoryObject(url,"Buildings/objects/CheckPoint.lwo",panel,"Checkpoint");
        loadDirectoryObject(url,"objects/helmsdeep.lwo",panel,"Helms Deep");
        loadDirectoryObject(url,"objects/pontez.lwo",panel,"Bridge");

        panel = document.getElementById("panel-lib-landVehicleObjects");
        loadDirectoryObject(url,"Vehicles/objects/C2V.lwo",panel,"C2V");
        loadDirectoryObject(url,"Vehicles/objects/Fishing Boat.lwo",panel,"Fishing Boat");
        loadDirectoryObject(url,"Vehicles/objects/Humvee_Medical.lwo",panel,"Humvee_Medical");
        loadDirectoryObject(url,"Vehicles/objects/M1A1.lwo",panel,"M1A1");
        loadDirectoryObject(url,"Geography/objects/Camaro.lwo",panel,"Camaro");
        loadDirectoryObject(url,"Geography/objects/SemiTruck.lwo",panel,"SemiTruck");
        loadDirectoryObject(url,"Geography/objects/Truck3.lwo",panel,"Truck3");
        loadDirectoryObject(url,"objects/carriage.lwo",panel,"Carriage");
        loadDirectoryObject(url,"objects/HQ_Movie cycle.lwo",panel,"Tron Cycle");

        panel = document.getElementById("panel-lib-airVehicleObjects");
        loadDirectoryObject(url,"Vehicles/objects/AP_A10R.lwo",panel,"A10 Warthog");
        loadDirectoryObject(url,"Vehicles/objects/BW_ac-130.lwo",panel,"AC130");
        loadDirectoryObject(url,"Vehicles/objects/BW_ACprop.lwo",panel,"AC130 prop");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL1.lwo",panel,"Apache-1");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL2.lwo",panel,"Apache-2");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL3.lwo",panel,"Apache-3");
        loadDirectoryObject(url,"Vehicles/objects/DC-10.lwo",panel,"DC-10");
        loadDirectoryObject(url,"Vehicles/objects/AP_F15R.lwo",panel,"F15");
        loadDirectoryObject(url,"Vehicles/objects/F16.lwo",panel,"F16");
        loadDirectoryObject(url,"Geography/objects/AP_F18R.lwo",panel,"F18 Hornet");
        loadDirectoryObject(url,"Vehicles/objects/BlackHawk.lwo",panel,"BlackHawk");
        loadDirectoryObject(url,"Vehicles/objects/JStars.lwo",panel,"JStars");
        loadDirectoryObject(url,"Vehicles/objects/Predator.lwo",panel,"Predator");
        loadDirectoryObject(url,"Vehicles/objects/RC12.lwo",panel,"RC12");
        loadDirectoryObject(url,"Vehicles/objects/U2.lwo",panel,"U2");
        loadDirectoryObject(url,"objects/Grunt2.lwo",panel,"Grunt");


        panel = document.getElementById("panel-lib-egyptObjects");
        loadDirectoryObject(url,"Egypt/objects/Artifact_01.lwo",panel,"Artifact_01");
        loadDirectoryObject(url,"Egypt/objects/Artifact_02.lwo",panel,"Artifact_02");
        loadDirectoryObject(url,"Egypt/objects/Artifact_03.lwo",panel,"Artifact_03");
        loadDirectoryObject(url,"Egypt/objects/EGYPT.lwo",panel,"EGYPT");
        loadDirectoryObject(url,"Egypt/objects/GreatPyramid.lwo",panel,"GreatPyramid");
        loadDirectoryObject(url,"Egypt/objects/GreatSphinx.lwo",panel,"GreatSphinx");
        loadDirectoryObject(url,"Egypt/objects/KhafrePyramid.lwo",panel,"KhafrePyramid");
        loadDirectoryObject(url,"Egypt/objects/MenkaurePyramid.lwo",panel,"MenkaurePyramid");
        loadDirectoryObject(url,"Egypt/objects/Site_SkyDome.lwo",panel,"Site_SkyDome");

        panel = document.getElementById("panel-lib-robotObjects");
        loadDirectoryObject(url,"Robots/objects/MULE_ARV_1.lwo",panel,"MULE_ARV_1");
        loadDirectoryObject(url,"Robots/objects/MULE_CM_1.lwo",panel,"MULE_CM_1");
        loadDirectoryObject(url,"Robots/objects/MULE_T_HIGH.lwo",panel,"MULE_T_HIGH");
        loadDirectoryObject(url,"objects/RB-Megatron TF3.lwo",panel,"Megatron");
        loadDirectoryObject(url,"objects/RB-OptimusBoss.lwo",panel,"Optimus Prime");
        loadDirectoryObject(url,"objects/RB-BumbleBee.lwo",panel,"Bumblebee");

        panel = document.getElementById("panel-lib-geoObjects");
        loadDirectoryObject(url,"objects/Terrain.lwo",panel,"Terrain");
        loadDirectoryObject(url,"Vehicles/objects/Landing-Pad.lwo",panel,"Landing-Pad");
        loadDirectoryObject(url,"Vehicles/objects/AirfieldFlat.lwo",panel,"AirfieldFlat");
        loadDirectoryObject(url,"Geography/objects/Dam.lwo",panel,"Dam");
        loadDirectoryObject(url,"Geography/objects/road.lwo",panel,"road");
        loadDirectoryObject(url,"objects/Water.lwo",panel,"Water");
        loadDirectoryObject(url,"objects/Sky2.lwo",panel,"Sky2");

        panel = document.getElementById("panel-motions");
        loadDirectoryObject(url,"motions/fly-loop.mot",panel,"Fly-loop");
        loadDirectoryObject(url,"motions/fly-loop-roll.mot",panel,"Fly-loop-roll");
        loadDirectoryObject(url,"motions/oscillate-dissolve.mot",panel,"Oscillate Dissolve");
        loadDirectoryObject(url,"motions/oscillate-scale.mot",panel,"Oscillate Scale");
        loadDirectoryObject(url,"motions/spin-y.mot",panel,"Spin");
    }

}
function loadDirectoryObject(url,href,panel,name){
    var A = document.createElement('a');
    A.setAttribute("onclick", "load('" + url + href + "'),modalHide();");
    A.setAttribute("id", name);
    A.innerHTML = name;
    panel.appendChild(A);
    var br = document.createElement("br");
    panel.appendChild(br);
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
        bridgeworks.updateScene(url);
        break;
    }
}


function loadModel(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    name = g_modelCount.toString()+". "+name;
    g_modelCount++;


    var objectPanel = document.getElementById("object-panel");
    var row = document.createElement('div');
    row.setAttribute("class", "row");
    row.setAttribute("id", "row" + name);
    //row.setAttribute("class", "row" + name);
    var nameColumn = document.createElement('div');
    // var colorColumn = document.createElement('div');
    var moveColumn = document.createElement('div');
    moveColumn.setAttribute("style", "padding:0px;");
    var findColumn = document.createElement('div');
    findColumn.setAttribute("style", "padding:0px;");
    var trashColumn = document.createElement('div');
    trashColumn.setAttribute("style", "padding:0px;");
    var playColumn = document.createElement('div');
    playColumn.setAttribute("style", "padding:0px;");
    var ffColumn = document.createElement('div');
    ffColumn.setAttribute("style", "padding:0px;");
    var stopColumn = document.createElement('div');
    stopColumn.setAttribute("style", "padding:0px;");

    var a = document.createElement('a');
    a.innerHTML = name.substring(3);
    a.setAttribute("id", name);
    a.setAttribute("onclick", "selectModel('"+name+"');"); // Instead of calling setAttribute
    a.setAttribute("title", "Select Object");
    a.setAttribute("class", "object")
    a.style.cursor="pointer";
    a.style.cursor="hand";

    var id = name.replace(' ', '_');

    var moveBtn = document.createElement('span');
    moveBtn.setAttribute("id", "moveable" + id);
    moveBtn.setAttribute("class", 'shape icon-move');
    moveBtn.setAttribute("style", "margin-top:3px;");
    moveBtn.setAttribute("title", 'Toggle Moveable');
    moveBtn.setAttribute("onClick", "toggleMoveable('" + name + "');");

    moveBtn.addEventListener("click", function() {
      if ($(this).hasClass("toggle-on")) {
        $(this).removeClass("toggle-on");
      } else {
        $(this).addClass("toggle-on");
      }
    });

    var findBtn = document.createElement('span');
    findBtn.setAttribute("id", "find" + name);
    findBtn.setAttribute("class", 'shape fa fa-search');
    findBtn.setAttribute("style", "margin-top:3px;");
    findBtn.setAttribute("title", 'Jump to Object');
    findBtn.setAttribute("onClick", "locate('" + name + "');");

    var trashBtn = document.createElement('span');
    trashBtn.setAttribute("id", "trash" + name);
    trashBtn.setAttribute("class", 'shape fa fa-trash-o');
    trashBtn.setAttribute("style", "margin-top:3px;");
    trashBtn.setAttribute("title", 'Remove');
    trashBtn.setAttribute("onClick", "trashModel('" + name + "');");

    var playBtn = document.createElement('span');
    playBtn.setAttribute("id", "play-roam" + name);
    playBtn.setAttribute("class", 'shape icon-play');
    playBtn.setAttribute("style", "margin-top:3px;");
    playBtn.setAttribute("Title", 'Roam');
    playBtn.setAttribute("onClick", "roam('" + name + "');");

    var ffBtn = document.createElement('span');
    ffBtn.setAttribute("id", "fast-roam" + name);
    ffBtn.setAttribute("class", 'shape icon-fast-forward');
    ffBtn.setAttribute("style", "margin-top:3px;");
    ffBtn.setAttribute("Title", 'Roam Faster');
    ffBtn.setAttribute("onClick", "roamFaster('" + name + "');");

    var stopBtn = document.createElement('span');
    stopBtn.setAttribute("id", "stop-roam" + name);
    stopBtn.setAttribute("class", 'shape icon-stop');
    stopBtn.setAttribute("style", "margin-top:3px;");
    stopBtn.setAttribute("Title", 'Stop');
    stopBtn.setAttribute("onClick", "stopRoaming('" + name + "');");

    nameColumn.setAttribute("class", "col-sm-5");
    // colorColumn.setAttribute("class", "col-md-5");
    moveColumn.setAttribute("class", "col-sm-1");
    findColumn.setAttribute("class", "col-sm-1");
    trashColumn.setAttribute("class", "col-sm-1");
    playColumn.setAttribute("class", "col-sm-1");
    ffColumn.setAttribute("class", "col-sm-1");
    stopColumn.setAttribute("class", "col-sm-1");

    nameColumn.appendChild(a);
    moveColumn.appendChild(moveBtn);
    findColumn.appendChild(findBtn);
    // colorColumn.appendChild(c);
    trashColumn.appendChild(trashBtn);
    playColumn.appendChild(playBtn);
    ffColumn.appendChild(ffBtn);
    stopColumn.appendChild(stopBtn);

    row.appendChild(nameColumn);
    // row.appendChild(colorColumn)
    row.appendChild(moveColumn);
    row.appendChild(playColumn);
    row.appendChild(ffColumn);
    row.appendChild(stopColumn);
    row.appendChild(findColumn);
    row.appendChild(trashColumn);

    objectPanel.appendChild(row);

    var xml = loadXMLFile("BwContent/model.xml");

    var model = xml.getElementsByTagName("Model")[0];

    var n = model.attributes["name"];
    n.value = name;

    var u = model.attributes["url"];
    u.value = url;

    var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();

    var pos = xml.getElementsByTagName("position")[0];
    pos.attributes["x"].value = pointWorld.x.toString();
    pos.attributes["y"].value = pointWorld.y.toString();
    pos.attributes["z"].value = pointWorld.z.toString();


    var xstr = (new XMLSerializer()).serializeToString(xml);
    //console.debug(xstr);
    bridgeworks.updateScene(xstr);

    // set this here now so that controllers work on the loaded model
    g_selectedModel = bridgeworks.registry.find(name);
    g_selectedModelName = name;

    myObject = document.getElementById(name);
    $('.object').removeClass('current-object');
    $(myObject).addClass('current-object');

    scaleValues = (g_selectedModel.scale.getValueDirect());
    x = scaleValues['x'] * 100
    $('#scales').slider('setValue', x);

    var r = g_selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);


    if($('#sidebar-button').hasClass("closed")){
        $('#sidebar-button').removeClass('btn-danger').addClass('btn-info');
    }

    var physics = bridgeworks.get("PhysicsSimulator");
    if (physics && g_selectedModel) {
      physics.bodies.push_back(g_selectedModel.getAttribute("name"));
      console.log("# Bodies = " + physics.bodies.size.getValueDirect());
    }

}

function loadMotion(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    name = g_motionCount.toString()+". "+name;
    g_motionCount++;

    var animationPanel = document.getElementById("animate-panel");
    var row = document.createElement('div');
    row.setAttribute("id", "row" + name)
    var nameColumn = document.createElement('div');
    var trashColumn = document.createElement('div');
    var p = document.createElement('p');
    p.setAttribute("id", name);
    t = document.createElement('span');
    t.setAttribute("id", "trash" + name)
    t.setAttribute("class", 'shape fa fa-trash-o');
    t.setAttribute("style", "margin-top:3px;");
    t.setAttribute("Title", 'Remove');
    t.setAttribute("onClick", "trashAnimation('" + name + "');");
    nameColumn.setAttribute("class", "col-md-9");
    trashColumn.setAttribute("class", "col-md-3");
    p.innerHTML = name; // <a>INNER_TEXT</a>
    nameColumn.appendChild(p);
    trashColumn.appendChild(t);
    row.appendChild(nameColumn);
    row.appendChild(trashColumn);
    animationPanel.appendChild(row); // Append the link to the div


    var xml = loadXMLFile("BwContent/motion.xml");

    var kfi = xml.getElementsByTagName("KeyframeInterpolator")[0];

    var n = kfi.attributes["name"];
    n.value = name;

    var u = kfi.attributes["url"];
    u.value = url;

    var t = kfi.attributes["target"];
    t.value = g_selectedModel.name.getValueDirect().join("");

    var xstr = (new XMLSerializer()).serializeToString(xml);
    console.debug(xstr);
    bridgeworks.updateScene(xstr);
}


//Locates the target given the name and also sets current object to be the object located
function locate(name){
    var cmd = "\<Locate target='" + name + "'/>";
    g_selectedModel = bridgeworks.registry.find(name); //Sets the g_selectedModel to whatever the name is of the model you click in the list.
    setColorPicker();
    console.log(cmd);
    bridgeworks.updateScene(cmd);

    myObject = document.getElementById(name);
    $('.object').removeClass('current-object');
    $(myObject).addClass('current-object');

    scaleValues = (g_selectedModel.scale.getValueDirect());
    x = scaleValues['x'] * 100
    $('#scales').slider('setValue', x);

    var r = g_selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);

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

        g_labelCount++;


        g_labelName = "L-" + g_labelCount.toString();

        var xml = loadXMLFile("BwContent/label.xml");

        var name = xml.getElementsByTagName("Model")[0].attributes[0];
        name.value = g_labelName;

        var pos = xml.getElementsByTagName("position")[0];
        pos.attributes["x"].value = pointWorld.x.toString();
        pos.attributes["y"].value = pointWorld.y.toString();
        pos.attributes["z"].value = pointWorld.z.toString();

        var label = xml.getElementsByTagName("Label")[0];
        label.attributes["name"].value = "Label_" + name.value;
        if(g_selectedModel)
        {
            label.attributes["parent"].value = g_selectedModelName;
            console.log(g_selectedModelName)
        }
        else {
            label.attributes["parent"].value = name.value;
            console.log("No Model");
        }

        name = xml.getElementsByTagName("Group")[0].attributes[0];
        name.value = "Group_" + g_labelName;


        var xstr = (new XMLSerializer()).serializeToString(xml);
        console.debug(xstr);
        bridgeworks.updateScene(xstr);

        var update = "\<Set target='Label_" + g_labelName + "' text='" + copiedSelectedText + "' show='true'/>";
        console.debug(update);
        bridgeworks.updateScene(update);

        var cmd = "\<Remove target='"+g_labelName+"'/>";
        bridgeworks.updateScene(cmd);
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

function roam(name) {
    if (!name) {
      name = g_selectedModel.name.getValueDirect().join("");
    }
    if (name === "Grid") return;

    var cmd = "\<AnimalMover name='"+ name + "_roam' target='" + name + "' linearSpeed='.5' angularSpeed='20'/>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
}

function roamFaster(name) {
    if (!name) {
      name = g_selectedModel.name.getValueDirect().join("");
    }
    if (name === "Grid") return;

    var cmd = "\<Set target='" + name + "_roam' linearSpeed='3'/>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
}

function stopRoaming(name) {
    if (!name) {
      name = g_selectedModel.name.getValueDirect().join("");
    }
    if (name === "Grid") return;

    var cmd = "\<Remove target='" + name + "_roam'/>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
}

function setColorPicker()
{
    var g;
    var r;
    var b;
    r = g_selectedModel.color.values[0];
    g = g_selectedModel.color.values[1];
    b = g_selectedModel.color.values[2];
    document.getElementById('myColor').color.fromRGB(r, g, b);
}

function selectModel(name)
{
    var xml = "\<Set target='" + name + "'/>";
    g_selectedModel = bridgeworks.registry.find(name);
    console.log(xml);
    setColorPicker();
    bridgeworks.updateScene(xml);

    myObject = document.getElementById(name);
    $('.object').removeClass('current-object');
    $(myObject).addClass('current-object');

    scaleValues = (g_selectedModel.scale.getValueDirect());
    x = scaleValues['x'] * 100
    $('#scales').slider('setValue', x);

    var r = g_selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);
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

function trashAnimation(name)
{
  var cmd = "\<Remove target='" + name + "'/>";
  console.log(cmd);
  bridgeworks.updateScene(cmd);

  var panel = document.getElementById("animate-panel");
  var link = document.getElementById("row" + name);
  panel.removeChild(link);

}

<!-- Color Picker Script - ColorCodeHex.COM -->
function updateInfo(color) {
  document.getElementById('info-r').value = color.rgb[0];
  document.getElementById('info-g').value = color.rgb[1];
  document.getElementById('info-b').value = color.rgb[2];
}




function show(name)
{
    var xml = "\<Locate target='" + name + "'/>";
    console.debug(xml);
    bridgeworks.updateScene(xml);
}
//Apply Color function takes the selected model and sets its color to whatever the color is
//in the color patch



function remoteColor(name)
{
    var b = $('#' + name + 'info-b').val();
    var g = $('#' + name + 'info-g').val();
    var r = $('#' + name + 'info-r').val();
}

function cubify() {
  var m = "\<Update>";

    m += "\<Model url='objects/Cube.lwo'>";
    m += "\<scale x='100' y='100' z='1'/>";
    m += "\<position x='100' y='0' z='0'/>";
    m += "\</Model>";

    m += "\<Model url='objects/Cube.lwo'>";
    m += "\<scale x='1' y='100' z='100'/>";
    m += "\</Model>";

    m += "\<Model url='objects/Cube.lwo'>";
    m += "\<scale x='100' y='1' z='100'/>";
    m += "\<position x='0' y='0' z='100'/>";
    m += "\</Model>";

  m += "\</Update>";
  bridgeworks.updateScene(m);

}
