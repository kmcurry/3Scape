// functions are organized by alpha

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

function setObject(Object)
{
    var p = document.getElementById('Current_Object');
    var q = document.getElementById('Current_Object2');
    p.innerHTML = "Target: " + Object;
    q.innerHTML = "Target: " + Object;
}

function copy()
{
    if (selectedModel) {
        copiedUrl = selectedModel.url.getValueDirect().join("");
        R = selectedModel.color.values[0];
        G = selectedModel.color.values[1];
        B = selectedModel.color.values[2];
        Size = selectedModel.scale.getValueDirect().x;
        rotX = selectedModel.rotation.getValueDirect().x;
        rotY = selectedModel.rotation.getValueDirect().y;
        rotZ = selectedModel.rotation.getValueDirect().z;
        copiedElement = 1;
    }
    else if (selected)
    {
        copiedSelectedText = selectedText;
        console.log(copiedSelectedText);
        copiedElement = 2;
    }
}
function switchModes()
{
    var objectInspector =bridgeworks.registry.find("ObjectInspector");
    var sceneInspector =bridgeworks.registry.find("SceneInspector");
    var sceneActive = sceneInspector.enabled.getValueDirect();

    if(sceneActive)
    {
        sceneInspector.enabled.setValueDirect(false);
        objectInspector.enabled.setValueDirect(true);
    }
    else if(!sceneActive)
    {
        sceneInspector.enabled.setValueDirect(true);
        objectInspector.enabled.setValueDirect(false);
    }

    console.log(sceneInspector.enabled.getValueDirect());

}
function trashModel(name)
{
    var c = "\<Remove target='" + name + "'/>";
    console.log(c);
    bridgeworks.updateScene(c);

    var panel = document.getElementById("object-list");
    var link = document.getElementById("row" + name);
    panel.removeChild(link);
}

function trashAnimation(name)
{
         var cmd = "\<Remove target='" + name + "'/>";
         //var cmd = "\<Stop target='" + name + "'/>";
         console.log(cmd);
         //bridgeworks.renderController.stop();
         bridgeworks.updateScene(cmd);
         //bridgeworks.updateScene(c);

         var panel = document.getElementById("animate");
         var link = document.getElementById("row" + name);
         panel.removeChild(link);
    
}

function cut()
{
    if (selectedModel) {
        copy();
        var name = selectedModel.name.getValueDirect().join("");
        var c = "\<Remove target='" + name + "'/>"
        bridgeworks.updateScene(c);
        console.log(name);

        var panel = document.getElementById("object-list");
        var link = document.getElementById("row" + name);
        panel.removeChild(link);
    }
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
        //listDirectory(url + "objects/", panel);

        panel = document.getElementById("panel-lib-animalObjects");
        loadDirectoryObject(url,"Animals/objects/Cow.lwo",panel,"Cow");
        loadDirectoryObject(url,"Animals/objects/trex.lwo",panel,"Trex");
        loadDirectoryObject(url,"Animals/objects/Ant.lwo",panel,"Ant");
        loadDirectoryObject(url,"objects/rhino.lwo",panel,"Rhino");
        loadDirectoryObject(url,"objects/elephant.lwo",panel,"Elephant");
        loadDirectoryObject(url,"objects/dolphin.lwo",panel,"Dolphin");
        loadDirectoryObject(url,"objects/dragon.lwo",panel,"Dragon");
       // listDirectory(url + "Animals/objects/", panel);

        panel = document.getElementById("panel-lib-peopleObjects");
        loadDirectoryObject(url,"People/objects/B rifleman.lwo",panel,"Rifleman");
        loadDirectoryObject(url,"People/objects/Civilian.lwo",panel,"Civilian");
        loadDirectoryObject(url,"People/objects/RECON.lwo",panel,"RECON");
        loadDirectoryObject(url,"People/objects/SOF_gun.lwo",panel,"SOF_gun");
        loadDirectoryObject(url,"People/objects/Saw_Gunner.lwo",panel,"Saw_Gunner");
        loadDirectoryObject(url,"People/objects/SOF.lwo",panel,"SOF");
        loadDirectoryObject(url,"People/objects/Soldier_look.lwo",panel,"Soldier_look");

        panel = document.getElementById("panel-lib-anatomyObjects");
        // loadDirectoryObject(url,"Heart/objects/heart4.lwo",panel,"heart4");
        // loadDirectoryObject(url,"Heart/objects/aortaw.lwo",panel,"aortaw");
        // loadDirectoryObject(url,"Heart/objects/catheder.lwo",panel,"catheder");
        // loadDirectoryObject(url,"Heart/objects/1.lwo",panel,"1");
        // loadDirectoryObject(url,"Heart/objects/2.lwo",panel,"2");
        // loadDirectoryObject(url,"Heart/objects/4.lwo",panel,"4");
        // loadDirectoryObject(url,"Heart/objects/a.lwo",panel,"a");
        // loadDirectoryObject(url,"Heart/objects/HumanHeart_1.lwo",panel,"HumanHeart_1");
        loadDirectoryObject(url,"Heart/objects/Heart_back.lwo",panel,"Heart_back");
        // loadDirectoryObject(url,"Heart/objects/Heart_back2.lwo",panel,"Heart_back2");
        loadDirectoryObject(url,"Heart/objects/Heart_front.lwo",panel,"Heart_front");
        // loadDirectoryObject(url,"Heart/objects/Heart_front2.lwo",panel,"Heart_front2");
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
        // listDirectory(url + "Buildings/objects/", panel);

        panel = document.getElementById("panel-lib-landVehicleObjects");        
        loadDirectoryObject(url,"Vehicles/objects/C2V.lwo",panel,"C2V");
        loadDirectoryObject(url,"Vehicles/objects/Fishing Boat.lwo",panel,"Fishing Boat");
        loadDirectoryObject(url,"Vehicles/objects/Humvee_Medical.lwo",panel,"Humvee_Medical");
        loadDirectoryObject(url,"Vehicles/objects/M1A1.lwo",panel,"M1A1");
        loadDirectoryObject(url,"Geography/objects/Camaro.lwo",panel,"Camaro");
        loadDirectoryObject(url,"Geography/objects/SemiTruck.lwo",panel,"SemiTruck");
        loadDirectoryObject(url,"Geography/objects/Truck3.lwo",panel,"Truck3");
       // listDirectory(url + "Vehicles/objects/", panel);

        panel = document.getElementById("panel-lib-airVehicleObjects");
        loadDirectoryObject(url,"Vehicles/objects/F16.lwo",panel,"F16");
        loadDirectoryObject(url,"Vehicles/objects/DC-10.lwo",panel,"DC-10");
        loadDirectoryObject(url,"Vehicles/objects/BlackHawk.lwo",panel,"BlackHawk");
        loadDirectoryObject(url,"Vehicles/objects/Predator.lwo",panel,"Predator");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL1.lwo",panel,"AP_ApacheL1");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL2.lwo",panel,"AP_ApacheL2");
        loadDirectoryObject(url,"Geography/objects/AP_ApacheL3.lwo",panel,"AP_ApacheL3");
        loadDirectoryObject(url,"Geography/objects/AP_F18R.lwo",panel,"AP_F18R");

        

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
       // listDirectory(url + "Egypt/objects/", panel);

        panel = document.getElementById("panel-lib-robotObjects");
        loadDirectoryObject(url,"Robots/objects/MULE_ARV_1.lwo",panel,"MULE_ARV_1");
        // loadDirectoryObject(url,"Robots/objects/MULE_ARV_HIGH.lwo",panel,"MULE_ARV_HIGH");
        loadDirectoryObject(url,"Robots/objects/MULE_CM_1.lwo",panel,"MULE_CM_1");
        // loadDirectoryObject(url,"Robots/objects/MULE_CM_HIGH.lwo",panel,"MULE_CM_HIGH");
        loadDirectoryObject(url,"Robots/objects/MULE_T_HIGH.lwo",panel,"MULE_T_HIGH");
        // loadDirectoryObject(url,"Robots/objects/Shadow_MULE_ARV_1.lwo",panel,"Shadow_MULE_ARV_1");
        // loadDirectoryObject(url,"Robots/objects/Shadow_MULE_CM_HIGH.lwo",panel,"Shadow_MULE_CM_HIGH");
        // loadDirectoryObject(url,"Robots/objects/Shadow_MULE_T_HIGH.lwo",panel,"Shadow_MULE_T_HIGH");
        // listDirectory(url + "Robots/objects/", panel);

        panel = document.getElementById("panel-lib-geoObjects");
        loadDirectoryObject(url,"objects/Terrain.lwo",panel,"Terrain");
        loadDirectoryObject(url,"Vehicles/objects/Landing-Pad.lwo",panel,"Landing-Pad");
        loadDirectoryObject(url,"Vehicles/objects/AirfieldFlat.lwo",panel,"AirfieldFlat");
        loadDirectoryObject(url,"Geography/objects/Dam.lwo",panel,"Dam");
        loadDirectoryObject(url,"Geography/objects/road.lwo",panel,"road");
        loadDirectoryObject(url,"objects/Water.lwo",panel,"Water");
        loadDirectoryObject(url,"objects/Sky2.lwo",panel,"Sky2");
        // listDirectory(url + "Geography/objects/", panel);

        panel = document.getElementById("panel-motions");
        loadDirectoryObject(url,"motions/fly-loop.mot",panel,"Fly-loop");
        loadDirectoryObject(url,"motions/fly-loop-roll.mot",panel,"Fly-loop-roll");
        loadDirectoryObject(url,"motions/oscillate-dissolve.mot",panel,"Oscillate Dissolve");
        loadDirectoryObject(url,"motions/oscillate-scale.mot",panel,"Oscillate Scale");
        loadDirectoryObject(url,"motions/spin-y.mot",panel,"Spin");
    }
    /*
    url = document.location.href + "/../../Entymology/BwContent/"
    listDirectory(url + "objects/", panel);

    url = document.location.href + "/../../Paleontology/BwContent/"
    listDirectory(url + "objects/", panel);*/

    //panel = document.getElementById("panel-lib-motions");

    //url = document.location.href + "/../BwContent/";

    //listDirectory(url + "motions/", panel);
    //listDirectory(url + "Vehicles/motions/", panel);
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

function listDirectory(url, panel)
{
    // Models
    var xhttp = CreateHTTPRequestObject();
    xhttp.open("GET", url, false);
    xhttp.send();
    
    var dom = ParseHTTPResponse(xhttp, "text/html");
    var objects = dom.getElementsByTagName("a");
    var object = null;
    var onclick = null;
    var href = "";
    
    var i = 0;
    
    for (i = 0; i < objects.length; i++) {
        
        object = objects[i].cloneNode(true);
        
        var value = object.innerText;
        
        href = object.getAttribute("href");
        
        // skip subversion files - blecch
        var ndx = href.indexOf('.svn') && value.indexOf('Parent Directory');
        if (ndx != -1) continue;
        
        ndx = href.lastIndexOf('/');
        
        href = ndx == -1 ? href : href.substring(ndx+1);

        object.innerText = object.innerText.substring(0,object.innerText.indexOf('.'));

        object.setAttribute("id",object.innerText);
        object.removeAttribute("href");
        object.setAttribute("onclick", "load('" + url + href + "'),modalHide();");
        //This takes care of the file having the lwo attached to it.
        //console.debug(object.innerText);

        panel.appendChild(object);
        var br = document.createElement("br");
        panel.appendChild(br);
        
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
        bridgeworks.updateScene(url);
        break;
    }
}

var count = 1;
var motionCount = 1;

function loadModel(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    name = count.toString()+". "+name;
    count++;

    // c = document.createElement('div');
    // c.innerHTML = '<input id="heyColor">' {onImmediateChange:\'updateInfo(this);\'}" id="2myColor" value="FFFFFF"'
    //             + 'onchange="applyColor();" style="height:20px;width:20px;"/>'
    //             + '<input id="2info-r" size="2" type="hidden"/>'
    //             + '<input id="2info-g" size="2" type="hidden"/>'
    //             + '<input id="2info-b" size="2" type="hidden"/>';

    setObject(name);
    var objectPanel = document.getElementById("object-list");
    var row = document.createElement('div');
    row.setAttribute("id", "row" + name)
    var nameColumn = document.createElement('div');
    // var colorColumn = document.createElement('div');
    var findColumn = document.createElement('div');
    var trashColumn = document.createElement('div');
    a = document.createElement('a');
    a.innerHTML = name;
    a.setAttribute("id", name);
    a.setAttribute("onclick", "setModel('"+name+"');"); // Instead of calling setAttribute    
    a.setAttribute("Title", "Select Object");
    a.setAttribute("class", "object")
    a.style.cursor="pointer"; 
    a.style.cursor="hand";
    f = document.createElement('span');
    f.setAttribute("id", "find" + name)
    f.setAttribute("class", 'shape fa fa-search');
    f.setAttribute("style", "margin-top:3px;");
    f.setAttribute("Title", 'Jump to Object');
    f.setAttribute("onClick", "locate('" + name + "');");
    t = document.createElement('span');
    t.setAttribute("id", "trash" + name)
    t.setAttribute("class", 'shape fa fa-trash-o');
    t.setAttribute("style", "margin-top:3px;");
    t.setAttribute("Title", 'Remove');
    t.setAttribute("onClick", "trashModel('" + name + "');");
    nameColumn.setAttribute("class", "col-md-8");
    // colorColumn.setAttribute("class", "col-md-5");
    findColumn.setAttribute("class", "col-md-2");
    trashColumn.setAttribute("class", "col-md-2");
    nameColumn.appendChild(a);
    findColumn.appendChild(f);
    // colorColumn.appendChild(c);
    trashColumn.appendChild(t);
    row.appendChild(nameColumn);
    // row.appendChild(colorColumn)
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
    console.debug(xstr);
    bridgeworks.updateScene(xstr);
    
    selectedModel = bridgeworks.registry.find(name);

    var r = selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);
    
    // add the loaded thing to the list of loaded things
    var p = document.createElement("div");
    p.setAttribute("id", name);
    var a = document.createElement("a");
    a.setAttribute("onclick", "show('" + name + "');")
    a.innerText = name;
    
    //p.appendChild(a);
    
    var panel = document.getElementById("panel-curr-scene");
    //panel.appendChild(p);
    console.log(name);
    
    
}

// <div class="row">
//   <div class="col-md-6">.col-md-6</div>
//   <div class="col-md-6">.col-md-6</div>
// </div>

function loadMotion(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    name = motionCount.toString()+". "+name;
    motionCount++;

    var animationPanel = document.getElementById("animate");
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

    //var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    
    var xml = loadXMLFile("BwContent/motion.xml");
    
    var kfi = xml.getElementsByTagName("KeyframeInterpolator")[0];
    
    var n = kfi.attributes["name"];
    n.value = name;
    
    var u = kfi.attributes["url"];
    u.value = url;
    
    var t = kfi.attributes["target"];
    t.value = selectedModel.name.getValueDirect().join("");
    
    var xstr = (new XMLSerializer()).serializeToString(xml);
    console.debug(xstr);
    bridgeworks.updateScene(xstr);
}

function locate()
{
    var xml = "\<Locate target='" + $('#objectname').val() + "'/>";
    console.log(xml);
    bridgeworks.updateScene(xml);

}

//Locates the target given the name and also sets current object to be the object located
function locate(name){
    var cmd = "\<Locate target='" + name + "'/>";
    selectedModel = bridgeworks.registry.find(name); //Sets the selectedModel to whatever the name is of the model you click in the list.
    setColorPicker();
    console.log(cmd);
    bridgeworks.updateScene(cmd);
    setObject(name);
    myObject = document.getElementById(name);
    $('.object').removeClass('current-object');
    $(myObject).addClass('current-object');
    var r = selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);
    
}

function setColorPicker()
{
    var g;
    var r;
    var b;
    r = selectedModel.color.values[0];
    g = selectedModel.color.values[1];
    b = selectedModel.color.values[2];
    document.getElementById('myColor').color.fromRGB(r, g, b);
}

function setModel()
{
    var xml = "\<Set target='" + $('#objectname').val() + "'/>";
    console.log(xml);
    bridgeworks.updateScene(xml);
}

function setModel(name)
{
    var xml = "\<Set target='" + name + "'/>";
    selectedModel = bridgeworks.registry.find(name);
    console.log(xml);
    setColorPicker();
    bridgeworks.updateScene(xml);
    setObject(name);
    myObject = document.getElementById(name);
    $('.object').removeClass('current-object');
    $(myObject).addClass('current-object');
    var r = selectedModel.rotation.getValueDirect();
    $("#rotxs").slider("setValue", r.x);
    $("#rotys").slider("setValue", r.y);
    $("#rotzs").slider("setValue", r.z);
}
function paste()
{
    if(copiedElement == 2)
    {
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
        if(selectedModel)
        {
            label.attributes["parent"].value = modelName;
            console.log(modelName)
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
    else if(copiedElement == 1) {
        load(copiedUrl);
        var name = copiedUrl.substring(copiedUrl.lastIndexOf("/") + 1, copiedUrl.lastIndexOf("."));
        count -= 1;
        name = count.toString() + ". " + name;
        count += 1;
        selectedModel.scale.setValueDirect(Size, Size, Size);
        selectedModel.rotation.setValueDirect(rotX, rotY, rotZ);
        //selectedModel.color.setValueDirect(R,G,B); There is no setValueDirect for color. Should look into adding that
        var cmd = "\<Set target='" + name + "'>" + "\<color r= '" + R + "' " + "g= '" + G + "' " + "b= '" + B + "'/>" + "</Set>";
        bridgeworks.updateScene(cmd);
    }
}

function show(name)
{
    var xml = "\<Locate target='" + name + "'/>";
    console.debug(xml);
    bridgeworks.updateScene(xml);
}
//Apply Color function takes the selected model and sets its color to whatever the color is
//in the color patch

function applyColor() 
{
    var name = selectedModel.name.getValueDirect().join("");
    //($('#object-list a').attr('id'))
    var b = $('#info-b').val();
    var g = $('#info-g').val();
    var r = $('#info-r').val();
    var cmd = "\<Set target='"+name+"'>" + "\<color r= '" +r+ "' " + "g= '"+g+"' " + "b= '"+b+"'/>" +"</Set>";
    bridgeworks.updateScene(cmd);
}

function remoteColor(name) 
{
    var b = $('#' + name + 'info-b').val();
    var g = $('#' + name + 'info-g').val();
    var r = $('#' + name + 'info-r').val();
}

function showTop()
{
    bridgeworks.updateScene("top.xml");
}

function showBottom()
{
    bridgeworks.updateScene("bottom.xml");
}

function showLeft()
{
    bridgeworks.updateScene("left.xml");
}

function showRight()
{
    bridgeworks.updateScene("right.xml");
}

function showHome()
{
    bridgeworks.updateScene("home.xml");
}

function showHelp()
{
    alert ("1. 'Right-click' anywhere on an object.\n2. Name what you clicked.\n3. Submit.\n\n'Left-click', hold and drag to rotate.")
}