function addTouchEvents() {
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", handleTouchStart, false);
  el.addEventListener("touchend", handleTouchEnd, false);
  el.addEventListener("touchcancel", handleTouchCancel, false);
  el.addEventListener("touchleave", handleTouchEnd, false);
  el.addEventListener("touchmove", handleTouchMove, false);
  console.log("touch events added");
}

function handleTouchStart(evt) {
    console.log("touch start");
}

function handleTouchEnd(evt) {
    console.log("touch end");
}

function handleTouchCancel(evt) {
    console.log("touch cancel");
}

function handleTouchMove(evt) {
    console.log("touch move");
}
