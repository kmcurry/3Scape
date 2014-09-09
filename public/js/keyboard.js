function handleKey(e)
{
  if(editorOpen == 0) {
      switch (e.keyCode) {
          case 'C'.charCodeAt(0):
          {
              if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  copy();
                  copy(); // why is this called 2X?? - KMC
              }      // c
          }
              break;
          case 187: //Equal Sign
//                        var command = "\<Serialize target='Root'/>";
//                        bridgeworks.updateScene(command);
//                            saveThis(serializedScene,"Scene");


//                        var canvasId = "Canvas";
//                        var xml = "<ScreenCapture canvasId='" + canvasId + "'/>"
//                        console.debug(xml);
//                        bridgeworks.updateScene(xml);
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
          {      // v
              if (e.metaKey || e.ctrlKey) {
                  if (document.activeElement.id != 'url') {
                      e.preventDefault();
                      paste();
                  }
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
            }
            else{
              objectBackward(1);
            }
            break;
          case 38: //up
            if (e.shiftKey || e.ctrlKey) {
              objectUp(1);
            }
            else{
              objectForward(1);
            }
            break;
          case 'X'.charCodeAt(0):
          {      // x
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
          }
              break;

      }
  }
}
