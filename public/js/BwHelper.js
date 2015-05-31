// THIS FILE IS USED TO CENTRALIZE SCRIPT THAT IS PRESENTLY REPLICATED IN EACH DEMO'S HTML
// THIS CODE SHOULD BE MIGRATED OVER TIME TO APPROPRIATE PLACES

function draw()
{
    showBG();
    bridgeworks.render();
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

function initBw(container, recreateCanvas)
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


    // disable selection
    document.onselectstart = function() { return false; }

    var drawInterval = setInterval(draw, 1000/60);

    resize();

    return bridgeworks;
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
