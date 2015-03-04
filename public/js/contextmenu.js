// override context menu for the document
// should this be on gcanvas instead? - KMC
document.addEventListener('contextmenu', function(e) {

    selectObject();
    if (g_selectedModel) {
      positionMenu(e, modelMenu);
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
    if(g_selectedModelName != "Grid") // TODO
        setModelScale(ev.value / 100)
  });

  // makes sure the menu isn't in the way when it's not visible
  $("#model-menu").hover( function() {
    if (this.style.opacity == 0) {
      this.style.top = 0;
      this.style.left = 0;
    }
  });
}
