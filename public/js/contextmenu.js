document.addEventListener('contextmenu', function(e) {
  if (e.button === 2) {
    if (g_selectedModel)
    {
        g_selectedModel.getAttribute("highlight").setValueDirect(false);
        g_selectedModel = null;
    }
    if (bridgeworks.selector.selections.models.length > 0)
    {
        g_selectedModel = bridgeworks.selector.selections.models[0];
    }

    if (g_selectedModel) {

        g_selectedModelName = g_selectedModel.name.getValueDirect().join("");
        console.log(g_selectedModelName);

        if (g_selectedModelName != 'Grid') {

            if (g_selectedModel.moveable.getValueDirect()) {
              g_selectedModel.getAttribute("highlight").setValueDirect(true);
            }

        } else { g_selectedModel = null; $("#model-menu").prop('disabled',true);} //turn off context menu on deselect
    }
    else {

        console.log("NO MODEL SELECTED");
        g_selectedModel = null;

    }
    if (g_selectedModel) {
      positionMenu(e, modelMenu);
      $("#model-menu").toggleClass("active");
    }

    e.preventDefault();
    return false;
  }
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
      return 'scale: ' + (value);
    },
    min: 0,
    max: 1000,
    value: 500
  })
  .on('slide', function(ev){
    if(g_selectedModelName != "Grid") // TODO
        setScale(ev.value / 100)
  });

}
