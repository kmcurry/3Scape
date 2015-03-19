// THIS FILE IS USED TO CENTRALIZE SCRIPT THAT IS PRESENTLY REPLICATED IN EACH DEMO'S HTML
// THIS CODE SHOULD BE MIGRATED OVER TIME TO APPROPRIATE PLACES

function draw()
{
    showBG();
    bridgeworks.render();
}

function resize()
{
    if (!bridgeworks) return;

    var WIDTH = bridgeworks.container.offsetWidth;
    var HEIGHT = bridgeworks.container.offsetHeight;
    //console.debug("W = " + WIDTH + ", H = " + HEIGHT);
    if (WIDTH > 0 && HEIGHT > 0)
    {
        var zoom = getBrowserZoom();
        // getBrowserZoom can return NaN.
        if (zoom > 0)
        {
            WIDTH *= zoom;
            HEIGHT *= zoom;
        }

        bridgeworks.resize(WIDTH, HEIGHT);
    }
}

function getBrowserZoom()
{
    var zoom = 1;

    var browser = navigator.appName;
    if (browser.indexOf("Microsoft") != -1)
    {
        zoom = window.screen.deviceXDPI / window.screen.logicalXDPI;
    }
    else if (browser.indexOf("Netscape") != -1 ||
             browser.indexOf("Opera") != -1)
    {
        zoom = document.width / jQuery(document).width();
    }

    return zoom;
}

//var saveInterval = setInterval(function() {autoSaveScene();}, 1000);

function autoSaveScene(){
  serializedScene = "";

  var command = "\<Serialize target='Root'/>";
  bridgeworks.updateScene(command);
  localStorage.setItem("autoSave",serializedScene);
}

function getWorkInProgress(){
  return localStorage.getItem("autoSave");
}

function init(scene, container, recreateCanvas)
{
    // create render context for BW if one does not exist, or if recreateCanvas is set
    var canvas = document.getElementById("Canvas");
    if (!canvas || recreateCanvas)
    {
        if (canvas) container.removeChild(canvas);
        canvas = document.createElement("canvas");
        canvas.id = "Canvas";
        canvas.style.position = "relative";
        canvas.style.zIndex = "2";
        container.appendChild(canvas);
    }

    // TODO: don't assume XML specifies a bg image
    var bg = document.getElementById("BackgroundImage");
    if (!bg) {
        bg = document.createElement("img");
        bg.id = "BackgroundImage";
        bg.style.position = "absolute";
        bg.style.top = "0px";
        bg.style.left = "0px";
        container.parentNode.appendChild(bg);
    }

    var rcs = document.getElementById("RasterComponents");
    if (!rcs)
    {
        rcs = document.createElement("div");
        rcs.id = "RasterComponents";
        container.appendChild(rcs);
    }


    // create BW
    bridgeworks                     = new Bridgeworks(canvas, bg);
    bridgeworks.container           = container;
    bridgeworks.rasterComponents    = rcs;
    bridgeworks.bgImage             = bg;

    var savedScene = getWorkInProgress();
    if (savedScene != ""){
      //console.log(savedScene);
      bridgeworks.updateScene(savedScene);
    }
    else {
      bridgeworks.updateScene(scene);
    }

    addKeyEvents();

    // disable selection
    document.onselectstart = function() { return false; }

    var interval = 1000/60;
    setInterval(draw, interval);
    resize();

    return bridgeworks;
}

// temporary
function showBG()
{
    var eStage = bridgeworks.container;

    if (eStage != null)
    {
        var pageX = eStage.offsetLeft;
        var pageY = eStage.offsetTop;
        var ebg = bridgeworks.bgImage;
        if (ebg != null)
        {
            ebg.style.left = pageX;
            ebg.style.top = pageY;
            ebg.style.visibility = 'visible';
        }
    }

}

function addKeyEvents()
{
    if (window.addEventListener)
    {
        window.addEventListener("keyup",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }
    else
    {
        window.attachEvent("keyup",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }

    if (window.addEventListener)
    {
        window.addEventListener("keydown",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }
    else
    {
        window.attachEvent("keydown",
            function(event)
            {
                bridgeworks.handleEvent(event);
            }
        );
    }

}
