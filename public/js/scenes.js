function load2dvs3d() {
  reset();
  bridgeworks.contentDir='/BwContent/2Dvs3D/';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('Pyramid.xml');
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

function loadfacepalm() {
  loadhi5();
}

function loadgrid50() {
  reset();
  bridgeworks.contentDir = '/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('grid-50.xml');
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

function loadinclinedplanes() {
  reset();
  bridgeworks.contentDir='BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('InclinedPlanes.xml');
}

function loadinertia() {
 reset();
 bridgeworks.contentDir='BwContent';
 bridgeworks.onLoadModified();
 bridgeworks.updateScene('Inertia.xml');
}

function loadadventuretime() {
 reset();
 bridgeworks.contentDir='BwContent';
 bridgeworks.onLoadModified();
 bridgeworks.updateScene('AdventureTime.xml');
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
  bridgeworks.contentDir='/BwContent/Underwater/BwContent';
  bridgeworks.onLoadModified();
  bridgeworks.updateScene('UnderWater.xml');
}


function loadFish() {
    reset();
    bridgeworks.contentDir = '/BwContent/Fish/';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('scene.xml');
}

function loadTerrain() {
    reset();
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('Terrain.xml');
}
