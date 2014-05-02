/**
 * Created by Brandon on 4/30/2014.
 * This is a javascript to implement gestures into 3Scape
 */

//If we don't have a touch device we can use these plugins in order to fake the events using shift mouse click
if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
    Hammer.plugins.showTouches();
}

if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
    Hammer.plugins.fakeMultitouch();
}

//We are creating a hammer touch event in an element
var hammertime = Hammer(document.getElementById('BwContainer'), {
});

//We are turning on touch capabilities and setting which we want to define.
hammertime.on('touch drag doubletap transform', function(ev) {
  //  elemRect = document.getElementById('zoom1');
    ev.gesture.preventDefault(true); //Allows me full access of all the touch events. And disables the browser actions.
    manageMultitouch(ev);
});

//Function that manages the type of touch we are performing.
function manageMultitouch(ev){

    switch(ev.type) {
        case 'touch':
            //----------------------------------------------------------------
            //We some reason I can't find where the client x and client y are in hammer. Look for it. Also find how to get the return value
            // of the built in scale function with hammer, then implement it with 3Scape in order to in the gesture zoom working.
            console.log("We are touching the screen. Your X position is: "+ev.gesture.deltaX);//+ev.gesture.deltaX);
            console.log("We are touching the screen. Your Y position is: "+ev.gesture.deltaY);//+ev.gesture.deltaY);

            break;

        case 'drag':
            console.log("We are dragging the screen. And here is its change in x: "+ev.gesture.deltaX);
            break;

        case 'transform':
            //console.log("Here is your X:"+ev.transform.deltaX);
        //Need to rewrite my own scaling function. Cause I don't know how the pinchs grab its x cordinates

            console.log("We are pinching the screen. We will use this to modify the scale.");
            break;

        case 'doubletap':
        {
            console.log("We are double tapping");
            var name = selectedModel.name.getValueDirect().join("");
            var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
            var cmd = "";
            if (ev.metaKey || ev.ctrlKey) {
                cmd = "\<AutoInterpolate target='" + name + "'>";
                cmd += "\<position x='" + pointWorld.x + "' y='" + pointWorld.y + "' z='" + pointWorld.z + "'/>"
                cmd += "\</AutoInterpolate>";
            }
            else {
                cmd = "\<Locate target='" + name + "'/>";
            }
            bridgeworks.updateScene(cmd);
        }
    }
}