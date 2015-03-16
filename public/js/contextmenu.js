document.oncontextmenu = function() {
  if (g_selectedModel) {
    positionMenu(window.event, modelMenu);
    $("#model-menu").toggleClass("active");
  }
  else {
    // context menu for other things -
    // ex., camera when nothing selected?
  }

  return false;
}

function positionMenu(e, menu) {
  var xPosition = e.clientX - (menu.clientWidth / 2);
  var yPosition = e.clientY - (menu.clientHeight / 2);

  menu.style.left = xPosition + "px";
  menu.style.top = yPosition + "px";

}
