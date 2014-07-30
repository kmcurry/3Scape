//Mouse Controls
function handleEvent(e){
    bridgeworks.handleEvent(e);
    switch(e.type) {
        case "mousedown":
            capture = true;
            break;
        case "mouseup":
            capture = false;
            sceneInspector = bridgeworks.registry.find("SceneInspector");
            zoomActivate();        
            break;
        case "click":
            //Dishing out the event client x and y cordinates of the mouse for testing purposes
            // if (!e.metaKey && !e.ctrlKey) {
            window.clearInterval(zoomUpdate);
            selectedModel = bridgeworks.selector.selections.models[0];
            if(selectedModel) {
                modelName = selectedModel.name.getValueDirect().join("");
                var name = selectedModel.name.getValueDirect().join("");
                setObject(name);
                setColorPicker();            
                myObject = document.getElementById(name);
                $('.object').removeClass('current-object');
                $(myObject).addClass('current-object');
                scaleValues = (selectedModel.scale.getValueDirect());
                x = scaleValues['x'] * 100
                $('#scales').slider('setValue', x);
                var r = selectedModel.rotation.getValueDirect();
                $("#rotxs").slider("setValue", r.x);
                $("#rotys").slider("setValue", r.y);
                $("#rotzs").slider("setValue", r.z);              
            }else {
                selected = bridgeworks.selector.selectedName.getValueDirect().join("");
                //console.log(selected);
                selectedId = bridgeworks.selector.getAttribute("Selected").id;
                selectedText = bridgeworks.selector.getAttribute("Selected").text.getValueDirect().join("");
                //console.log(selectedId);
            }
            capture = false;
            break;
        case "dblclick":
            if(selected){
                openLabelEdit();
            }
            else {
                var name = selectedModel.name.getValueDirect().join("");
                var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
                var cmd = "";
                if (e.metaKey || e.ctrlKey) {
                cmd = "\<AutoInterpolate target='" + name + "'>";
                cmd += "\<position x='" + pointWorld.x + "' y='" + pointWorld.y + "' z='" + pointWorld.z + "'/>"
                cmd += "\</AutoInterpolate>";
                }else {
                    cmd = "\<Locate target='" + name + "'/>";
                }
                console.log(name);
                console.debug(cmd);
                bridgeworks.updateScene(cmd);
                setObject(name);
                setColorPicker();
            }
            break;
    }
};

//Keyboard Controls
function handleKey(e){
    if(editorOpen == 0) {
        switch (e.keyCode) {
            case 'C'.charCodeAt(0):            
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    copy();
                    copy();
                }      // c              
                break;
            case 46: //Delete Key
                var slice = selected.slice(6,8);
                console.log(slice);
                var cmd = "\<Remove target='"+selected+"'/>";
                bridgeworks.updateScene(cmd);
                var cmd2 = "\<Remove target='"+slice+"'/>"
                var div = document.getElementById(selectedId);
                bridgeworks.updateScene(cmd2);
                div.parentNode.removeChild(div);
                break;
            case 'V'.charCodeAt(0):        
                if (e.metaKey || e.ctrlKey) {
                    if (document.activeElement.id != 'url') {
                        e.preventDefault();
                        paste();
                    }
                }
                break;
            case 39: //right
                objectRight(1);
                break;
            case 37: //left
                objectLeft(1);
                break;
            case 40: //down
                if (e.shiftKey || e.ctrlKey) {
                    objectDown(1);
                }else{
                    objectBackward(1);
                }
                break;
            case 38: //up
                if (e.shiftKey || e.ctrlKey) {
                    objectUp(1);
                }else{
                    objectForward(1);
                }
                break;
            case 'X'.charCodeAt(0):          
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    if(selected){
                        var slice = selected.slice(6.8);
                        console.log(slice);
                        var cmd = "\<Remove target='"+selected+"'/>";
                        bridgeworks.updateScene(cmd);
                        var cmd2 = "\<Remove target='"+slice+"'/>"
                        var div = document.getElementById(selectedId);
                        bridgeworks.updateScene(cmd2);
                        div.parentNode.removeChild(div);
                        copy();
                    }
                    cut();
                }            
                break;
        }
    }
};

//Mock Up of How Search would work
function Search(){
  var Search = $("#Search").val();
  var cmd = "\<Locate target='" + Search + "'/>";
  bridgeworks.updateScene(cmd);
  console.debug(cmd);
}

function zoomActivate() {
    zoomUpdate = window.setInterval(function () {
        distance = sceneInspector.pivotDistance.getValueDirect()
        if ((distance >= 0) && (distance < 4000)) {
            if (distance * 0.3 != sceneInspector.panSensitivity.values[0]) {
                sceneInspector.panSensitivity.values[0] = distance * 0.05;
                sceneInspector.panSensitivity.values[1] = distance * 0.05;
                sceneInspector.panSensitivity.values[2] = distance * 0.05;
                console.log(sceneInspector.panSensitivity.values[0]);
            }
        }
        else {
            sceneInspector.panSensitivity.values[0] = 1200;
            sceneInspector.panSensitivity.values[1] = 1200;
            sceneInspector.panSensitivity.values[2] = 1200;
            console.log(sceneInspector.panSensitivity.values[0]);
            console.log(distance);
        }
    }, 200);
};

function objectLeft(magnitude){
  // var objectInspector = bridgeworks.registry.find("ObjectInspector");
  // objectInspector.enabled.setValueDirect(true);
  // objectInspector.translationDelta.setValueDirect(-100,0,0);
  // objectInspector.evaluate();
  // bridgeworks.updateScene();
  var cmd;
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0]-= magnitude) + "' y='" + selectedModel.position.values[1] + "' z='" + selectedModel.position.values[2] + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);
  //previousSlide();
}

function objectRight(magnitude){
  // This way will activate the keys depending on the direction the camera is facing. But will need some refactoring.
  // var objectInspector = bridgeworks.registry.find("ObjectInspector");
  // objectInspector.enabled.setValueDirect(true);
  // objectInspector.translationDelta.setValueDirect(100,0,0);
  // //objectInspector.evaluate();
  // bridgeworks.updateScene();
  var cmd;
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0] += magnitude) + "' y='" + selectedModel.position.values[1] + "' z='" + selectedModel.position.values[2] + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);
  //nextSlide();
}

function objectDown(magnitude){
  var cmd;            
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + (selectedModel.position.values[1]-= magnitude) + "' z='" + selectedModel.position.values[2] + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);          
}

function objectBackward(magnitude){
  var cmd;
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + selectedModel.position.values[1] + "' z='" + (selectedModel.position.values[2] -= magnitude) + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);
  //nextSlide();
}

function objectUp(magnitude){
  var cmd;
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + (selectedModel.position.values[1]+= magnitude) + "' z='" + selectedModel.position.values[2] + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);
}

function objectForward(magnitude){
  cmd = "\<Set target='" + selectedModel.name.getValueDirect().join("") + "'>";
  cmd += "\<position x='" + (selectedModel.position.values[0]) + "' y='" + selectedModel.position.values[1] + "' z='" + (selectedModel.position.values[2] += magnitude) + "'/>"
  cmd += "\</Set>";
  console.log(selectedModel.position.getValueDirect());
  bridgeworks.updateScene(cmd);            
}

function setScale(value) {
    // var value = $( "#scale" ).spinner( "value" );
    
    if (selectedModel) {
        //var s = selectedModel.rotation.getValueDirect();
        selectedModel.scale.setValueDirect(value, value, value);
    }
}

function setRotationX(value) {
    //var value = $( "#rotationX" ).spinner( "value" );
    
    if (selectedModel) {
        var r = selectedModel.rotation.getValueDirect();
        selectedModel.rotation.setValueDirect(value, r.y, r.z);
    }
}

function setRotationY(value) {
    //var value = $( "#rotationY" ).spinner( "value" );
    
    if (selectedModel) {
        var r = selectedModel.rotation.getValueDirect();
        selectedModel.rotation.setValueDirect(r.x, value, r.z);
    }
}

function setRotationZ(value) {
    //var value = $( "#rotationZ" ).spinner( "value" );
    
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