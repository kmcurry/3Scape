document.addEventListener('contextmenu', function(e) {
  if (e.button === 2) {
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
