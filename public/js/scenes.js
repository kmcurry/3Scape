function load2dvs3d() {
  reset();
  bridgeworks.contentDir='/BwContent/2Dvs3D/';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Pyramid.xml');
}

function loadbrakes() {
  reset();
  bridgeworks.contentDir='BwContent/Motorcycle';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('BrakeAssemblyLWS.xml');
}

function loadegypt() {
  reset();
  bridgeworks.contentDir='BwContent/Egypt';
  // don't call onloadModified b/c XML doesn't reset Bw
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Egypt.xml');
  g_numSlides = 10;
  g_currSlide = 1;
  //loadSlides(10);
}

function loadentymology() {
  reset();
  bridgeworks.contentDir='/BwContent/Entymology/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('formica_rufa.xml');
}

function loadhi5() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('HighFive.xml');
}

function loadhighfive() {
  loadhi5();
}

function loadlight() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Lights.xml');
}

function loadphysics() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Physics.xml');
}

function loadtwostroke() {
  reset();
  bridgeworks.contentDir='/BwContent/Engine/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Stihl.xml');
  loadSlides(1);
}

function loadundersea() {
  reset();
  bridgeworks.contentDir='/BwContent/Underwater/';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Underwater.xml');
}
