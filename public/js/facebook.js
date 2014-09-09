window.fbAsyncInit = function() {
    FB.init({
        appId      : '270261976501269',
        xfbml      : true,
        version    : 'v2.0'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function postPictureToFacebook() {
    var canvasId = "Canvas";
      var xml = "<ScreenCapture canvasId='" + canvasId + "'/>"
      console.debug(xml);
      bridgeworks.updateScene(xml);
        setTimeout(function() {
            document.getElementById("picCaption").src=cimageData;
            document.getElementById("picCaption").width= 500;
            document.getElementById("picCaption").height=200;
            $("#example").dialog("open");
        }, 1000);
}
