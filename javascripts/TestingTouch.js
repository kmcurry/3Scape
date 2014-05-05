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

var options = {
    preventDefault: true
};
//We are creating a hammer touch event in an element
var hammertime = Hammer(document.getElementById('BwContainer'),options);

//We are turning on touch capabilities and setting which we want to define.
hammertime.on('touch drag doubletap transform release', function(ev) {
    //ev.gesture.preventDefault(true); //Allows me full access of all the touch events. And disables the browser actions.
    manageMultitouch(ev);
});

//Function that manages the type of touch we are performing.
function manageMultitouch(ev){

    switch(ev.type) {
        case 'touch':

            //----------------------------------------------------------------
            //I am printing the X and Y coordinate of the first touch, touches are logged in an array.

            console.log("We are touching the screen. Your X position is: "+ev.gesture.touches[0].clientX);
            console.log("We are touching the screen. Your Y position is: "+ev.gesture.touches[0].clientY);

            //Prints out the 2nd touches x and y when u have more than 1 finger on the screen.
            if(ev.gesture.touches.length>1) {
                    console.log("We are touching the screen. Your X position is: " + ev.gesture.touches[1].clientX);
                    console.log("We are touching the screen. Your Y position is: " + ev.gesture.touches[1].clientY);
            }

            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle the movement.
            var button = event.gesture.touches.length;
            var mouseEvent = new MouseEvent("mousedown", 0, 0, 0, 0, 0, null);
            mouseEvent.button = button-1;
            mouseEvent.clientX = ev.gesture.touches[0].clientX;
            mouseEvent.clientY = ev.gesture.touches[0].clientY;
            console.log("Mouse.clientX: "+mouseEvent.clientX);
            bridgeworks.handleEvent(mouseEvent);


            break;

        case 'drag':

            //For Testing Purposes
            console.log("We are dragging the screen. And here is its change in x: "+ev.gesture.touches[0].clientX);

            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle the movement.
            var button1= event.gesture.touches.length;
            var mouseEvent1 = new MouseEvent("mousemove", 0, 0, 0, 0, 0, null);
            mouseEvent1.button = button1-1;
            mouseEvent1.clientX = ev.gesture.touches[0].clientX;
            mouseEvent1.clientY = ev.gesture.touches[0].clientY;
            bridgeworks.handleEvent(mouseEvent1);
            break;

        case 'transform':

            //For tesiting purposes
            console.log("Delta Y for first touch: "+ev.gesture.deltaY);


            var blah = new Scale();
            blah.scale = ev.gesture.deltaY;
           // blah.panDelta = (0,0,ev.gesture.deltaY);
           // blah.evaluate();
            //var blah2 = new ObjectInspector();
            //blah2.translationDelta = ev.gesture.deltaY;

            //console.log("Here is your X:"+ev.transform.deltaX);
        //Need to rewrite my own scaling function. Cause I don't know how the pinchs grab its x cordinates

            console.log("We are pinching the screen. We will use this to modify the scale.");
            break;

        case 'doubletap': //Locates an object when you double tap the screen, and then views that object
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

        //Needed to add a release function cause if not then there is not way to register if the user is switching between using a touch
        //and a mouse.
        case 'release':

            //For testing purposes
            console.log("Thank God! Your finger was getting heavy");

            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle the movement.
            var button2 = event.gesture.touches.length;
            var mouseEvent2 = new MouseEvent("mouseup", 0, 0, 0, 0, 0, null);
            mouseEvent2.button = button2-1;
            mouseEvent2.clientX = ev.gesture.touches[0].clientX;
            mouseEvent2.clientY = ev.gesture.touches[0].clientY;
            bridgeworks.handleEvent(mouseEvent2);
    }
}