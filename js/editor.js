// functions are organized by alpha

var copiedUrl = "";

function copy()
{
    if (selectedModel) {
        copiedUrl = selectedModel.url.getValueDirect().join("")
    }
}

function cut()
{
    if (selectedModel) {
        var name = selectedModel.name.getValueDirect().join("");
        var c = "\<Remove target='" + name + "'/>"
        bridgeworks.updateScene(c);
        console.log(name);

        var panel = document.getElementById("object-list");
        var link = document.getElementById(name);
        panel.removeChild(link);
    }
}
var loaded = 0;
function listLibrary()
{
    var url = document.location.href + "/../BwContent/";
    if(loaded == 0)
    {
        //Seperating the libs out and changing which panel they are loaded into.
        var panel = document.getElementById("panel-lib-shapeObjects");
        listDirectory(url + "objects/", panel);

        panel = document.getElementById("panel-lib-animalObjects");
        listDirectory(url + "Animals/objects/", panel);

        panel = document.getElementById("panel-lib-buildingObjects");
        listDirectory(url + "Buildings/objects/", panel);

        panel = document.getElementById("panel-lib-vehicleObjects");
        listDirectory(url + "Vehicles/objects/", panel);

        panel = document.getElementById("panel-lib-egyptObjects");
        listDirectory(url + "Egypt/objects/", panel);
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

        object.removeAttribute("href");
        object.setAttribute("onclick", "load('" + url + href + "');");
        //This takes care of the file having the lwo attached to it.
        object.innerText = object.innerText.substring(0,object.innerText.indexOf('.'));

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

function loadModel(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    name = count.toString()+". "+name;
    count++;

    var objectPanel = document.getElementById("object-list");
    a = document.createElement('a');
    a.setAttribute("onclick", "locate('" + name + "');");; // Insted of calling setAttribute
    a.setAttribute("id", name);
    a.innerHTML = name + "<br>"; // <a>INNER_TEXT</a>
    objectPanel.appendChild(a); // Append the link to the div
    //var br = document.createElement("br");
   // objectPanel.appendChild(br);
    
    var xml = loadXMLFile("bwcontent/model.xml");
    
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
    
    // add the loaded thing to the list of loaded things
    var p = document.createElement("div");
    p.setAttribute("id", name);
    var a = document.createElement("a");
    a.setAttribute("onclick", "show('" + name + "');")
    a.innerText = name;
    
    //p.appendChild(a);
    
    var panel = document.getElementById("panel-curr-scene");
    //panel.appendChild(p);
    
    
}

function loadMotion(url)
{
    var name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
    
    var xml = loadXMLFile("bwcontent/motion.xml");
    
    var kfi = xml.getElementsByTagName("KeyframeInterpolator")[0];
    
    var n = kfi.attributes["name"];
    n.value = name + "_Motion";
    
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
    console.debug(xml);
    bridgeworks.updateScene(xml);
}

function paste()
{
    load(copiedUrl);
}

function show(name)
{
    var xml = "\<Locate target='" + name + "'/>";
    console.debug(xml);
    bridgeworks.updateScene(xml);
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