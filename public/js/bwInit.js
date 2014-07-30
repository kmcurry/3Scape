//A group of global variables
var bridgeworks = null;
var cube ="objects/Cube.lwo";
var sphere = "objects/Sphere.lwo";
var tube = "objects/Tube.lwo";
var Spin = "motions/spin-y.mot";
var Diss = "motions/oscillate-dissolve.mot";
var Scal = "motions/oscillate-scale.mot";
var fly = "motions/fly-loop.mot";
var wall = "objects/Wall.lwo";
var beam = "objects/Beam.lwo";
var Ring = "objects/Ring.lwo";
var Pyramid = "objects/Pyramid.lwo";
var c2v = "Vehicles/objects/C2V.lwo";
var cow = "Animals/objects/Cow.lwo";
var church = "Barnville/objects/Church.lwo";
var medHV = "Vehicles/objects/Humvee_Medical.lwo";
var currentObj = "Target: X";
var editorOpen = 0;
var slideCount = 1;
var numSlides = 10;
var elapsedTime = 0;
var CameraMotion = "CameraMotion";
var zoomUpdate;
var distance;
var sceneInspector;
var objectInspector;
var camStartPos;
var modelName;
var ancientLoaded = 0;
var selected;
var selectedId;
var edit = 0;
var selectedText;
var nicText;
//Progress Bar ===========================================================
var interval;
var kfi;
var slideTime;
var playSlider;
var slidesPlayed;
var isPlaying;
var isStopped;
var timer;
//========================================================================
var g_labelCount = 0;
var g_labelName = null;
var g_countStr = "";        
var selectedModel = null;        
var capture = false;                  
// This function makes it so that mouse interaction with the scene
// continues when the cursor moves out of the Bridgeworks frame.
function handleDocMove(event){
  if (capture) bridgeworks.handleEvent(event);
}

document.onreadystatechange = function () {
  if (document.readyState == "complete") {    
    if (!window.WebGLRenderingContext) {
      // browser supports WebGL
      document.location.href = "http://get.webgl.org/";
    } else {
      var canvas = document.getElementById("Canvas");
      var ctx = canvas.getContext("webgl");
      if (!ctx) {
        // browser supports WebGL but initialization failed.
        window.location.href = "nowebgl";
      }
    }
    bridgeworks = init("grid-100.xml", document.getElementById("BwContainer"));              
    sceneInspector = bridgeworks.registry.find("SceneInspector");
    objectInspector = bridgeworks.registry.find("ObjectInspector");
    listLibrary();
    window.onkeydown = handleKey;
    //window.onkeyup = handleKey;                
  }
}