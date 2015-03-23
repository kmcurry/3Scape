// override context menu for the document
// should this be on gcanvas instead? - KMC
document.addEventListener('contextmenu', function(e) {

    selectObject();
    if (g_selectedModel) {
      positionMenu(e, modelMenu);

      //set the scale slider to correct val for selected object
      var scaleVals = (g_selectedModel.scale.getValueDirect());
      var modelScale = scaleVals['x']*100;
      $('#model-scale-slider').slider('setValue', modelScale);

      $("#model-menu").toggleClass("active");
    }

    e.preventDefault();
    return false;

}, false);

function positionMenu(e, menu) {
  var xPosition = e.clientX - (menu.clientWidth / 2);
  var yPosition = e.clientY - (menu.clientHeight / 2);

  menu.style.left = xPosition + "px";
  menu.style.top = yPosition + "px";

}

function addContextMenu() {

    // Format and add the color picker
  $(".pick-a-color").pickAColor({
    showAdvanced						: false,
    showSpectrum            : false,
    showSavedColors         : false,
    saveColorsPerElement    : false,
    fadeMenuToggle          : true,
    showHexInput            : false,
    showBasicColors         : true,
    allowBlank              : false,
    inlineDropdown          : false
  });

  $("#model-color input").on("change", function () {
    applyColor($(this).val());
  });

  // Format and add the scale slider
  $('#model-scale-slider').slider({
    formater: function(value) {
      return 'scale: ' + (value) + '%';
    },
    min: 0,
    max: 2000,
    value: 100
  })
  .on('slide', function(ev){
    setModelScale(ev.value / 100)
  });

  // makes sure the menu isn't in the way when it's not visible
  $("#model-menu").hover( function() {
    if ($("#model-menu").hasClass('active') == false) {
      modelMenu.style.top = 0;
      modelMenu.style.left = 0;
    }
  });
}
