
function setScale(value) {
    // var value = $( "#scale" ).spinner( "value" );

    if (g_selectedModel) {
        //var s = selectedThing.rotation.getValueDirect();
        g_selectedModel.scale.setValueDirect(value, value, value);
    }
}

function setRotationX(value) {
    //var value = $( "#rotationX" ).spinner( "value" );

    if (g_selectedModel) {
        var r = g_selectedModel.rotation.getValueDirect();
        g_selectedModel.rotation.setValueDirect(value, r.y, r.z);
    }
}

function setRotationY(value) {
    //var value = $( "#rotationY" ).spinner( "value" );

    if (g_selectedModel) {
        var r = g_selectedModel.rotation.getValueDirect();
        g_selectedModel.rotation.setValueDirect(r.x, value, r.z);
    }
}

function setRotationZ(value) {
    //var value = $( "#rotationZ" ).spinner( "value" );

    if (g_selectedModel) {
        var r = g_selectedModel.rotation.getValueDirect();
        g_selectedModel.rotation.setValueDirect(r.x, r.y, value);
    }
}

function setPositionX() {
    var value = $( "#positionX" ).spinner( "value" );

    if (g_selectedModel) {
        var p = g_selectedModel.position.getValueDirect();
        g_selectedModel.position.setValueDirect(value, p.y, p.z);
    }
}

function setPositionY() {
    var value = $( "#positionY" ).spinner( "value" );

    if (g_selectedModel) {
        var p = g_selectedModel.position.getValueDirect();
        g_selectedModel.position.setValueDirect(p.x, value, p.z);
    }
}

function setPositionZ() {
    var value = $( "#positionZ" ).spinner( "value" );

    if (g_selectedModel) {
        var p = g_selectedModel.position.getValueDirect();
        g_selectedModel.position.setValueDirect(p.x, p.y, value);
    }
}

function setAmbientR() {
    var value = $( "#ambientR" ).spinner( "value" );

    var ambientLight = bridgeworks.registry.find("AmbientLight");

    if (ambientLight) {
        var p = ambientLight.ambient.getValueDirect();
        ambientLight.ambient.setValueDirect(value, p.g, p.b);
    }
}

function setAmbientG() {
    var value = $( "#ambientG" ).spinner( "value" );

    var ambientLight = bridgeworks.registry.find("AmbientLight");

    if (ambientLight) {
        var p = ambientLight.ambient.getValueDirect();
        ambientLight.ambient.setValueDirect(p.r, value, p.b);
    }
}

function setAmbientB() {
    var value = $( "#ambientB" ).spinner( "value" );

    var ambientLight = bridgeworks.registry.find("AmbientLight");

    if (ambientLight) {
        var p = ambientLight.ambient.getValueDirect();
        ambientLight.ambient.setValueDirect(p.r, p.g, value);
    }
}

function setModelR() {
    var value = $( "#modelR" ).spinner( "value" );

    if (selectedThing) {
        var c = selectedThing.color.getValueDirect();
        selectedThing.color.setValueDirect(value, c.g, c.b);
    }
}

function setModelG() {
    var value = $( "#modelG" ).spinner( "value" );

    if (g_selectedModel) {
        var c = g_selectedModel.color.getValueDirect();
        g_selectedModel.color.setValueDirect(c.r, value, c.b);
    }
}

function setModelB() {
    var value = $( "#modelB" ).spinner( "value" );

    if (g_selectedModel) {
        var c = g_selectedModel.ambient.getValueDirect();
        g_selectedModel.ambient.setValueDirect(c.r, c.g, value);
    }
}
