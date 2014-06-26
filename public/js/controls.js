
function setScale() {
    var value = $( "#scale" ).spinner( "value" );
    
    if (selectedModel) {
        //var s = selectedModel.rotation.getValueDirect();
        selectedModel.scale.setValueDirect(value, value, value);
    }
}

function setRotationX() {
    var value = $( "#rotationX" ).spinner( "value" );
    
    if (selectedModel) {
        var r = selectedModel.rotation.getValueDirect();
        selectedModel.rotation.setValueDirect(value, r.y, r.z);
    }
}

function setRotationY() {
    var value = $( "#rotationY" ).spinner( "value" );
    
    if (selectedModel) {
        var r = selectedModel.rotation.getValueDirect();
        selectedModel.rotation.setValueDirect(r.x, value, r.z);
    }
}

function setRotationZ() {
    var value = $( "#rotationZ" ).spinner( "value" );
    
    if (selectedModel) {
        var r = selectedModel.rotation.getValueDirect();
        selectedModel.rotation.setValueDirect(r.x, r.y, value);
    }
}

function setPositionX() {
    var value = $( "#positionX" ).spinner( "value" );
    
    if (selectedModel) {
        var p = selectedModel.position.getValueDirect();
        selectedModel.position.setValueDirect(value, p.y, p.z);
    }
}

function setPositionY() {
    var value = $( "#positionY" ).spinner( "value" );
    
    if (selectedModel) {
        var p = selectedModel.position.getValueDirect();
        selectedModel.position.setValueDirect(p.x, value, p.z);
    }
}

function setPositionZ() {
    var value = $( "#positionZ" ).spinner( "value" );
    
    if (selectedModel) {
        var p = selectedModel.position.getValueDirect();
        selectedModel.position.setValueDirect(p.x, p.y, value);
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
    
    if (selectedModel) {
        var c = selectedModel.color.getValueDirect();
        selectedModel.color.setValueDirect(value, c.g, c.b);
    }
}

function setModelG() {
    var value = $( "#modelG" ).spinner( "value" );
    
    if (selectedModel) {
        var c = selectedModel.color.getValueDirect();
        selectedModel.color.setValueDirect(c.r, value, c.b);
    }
}

function setModelB() {
    var value = $( "#modelB" ).spinner( "value" );
    
    if (selectedModel) {
        var c = selectedModel.ambient.getValueDirect();
        selectedModel.ambient.setValueDirect(c.r, c.g, value);
    }
}

$(function() {
    $("#scale").spinner({
        value: 1,
        step: 0.1,
        min: 0.1,
        numberFormat: "n",
        spin: setScale
    });
});

$(function() {
    $("#rotationX").spinner({
        step: 45,
        min: -180,
        max: 180,
        numberFormat: "n"
    }).change(function(){
             setRotationX();
        });
});

$(function() {
    $("#rotationY").spinner({
        step: 45,
        min: -180,
        max: 180,
        numberFormat: "n"
    }).change(function(){
             setRotationY();
        });
});

$(function() {
    $("#rotationZ").spinner({
        step: 45,
        min: -180,
        max: 180,
        numberFormat: "n"
    }).change(function(){
             setRotationZ();
        });
});

$(function() {
    $("#positionX").spinner({
        step: .1,
        numberFormat: "n"
    }).change(function(){
             setPositionX();
        });
});

$(function() {
    $("#positionY").spinner({
        step: .1,
        numberFormat: "n"
    }).change(function(){
             setPositionY();
        });
});

$(function() {
    $("#positionZ").spinner({
        step: .1,
        numberFormat: "n"
    }).change(function(){
             setPositionZ();
        });
});

$(function() {
    $("#ambientR").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setAmbientR();
        });
});

$(function() {
    $("#ambientG").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setAmbientG();
        });
});

$(function() {
    $("#ambientB").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setAmbientB();
        });
});

$(function() {
    $("#modelR").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setModelR();
        });
});

$(function() {
    $("#modelG").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setModelG();
        });
});

$(function() {
    $("#modelB").spinner({
        step: .05,
        min: 0,
        max: 1,
        numberFormat: "n"
    }).change(function(){
             setModelB();
        });
});