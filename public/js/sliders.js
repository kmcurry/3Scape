$('#rotxs').slider({
  formater: function(value) {
   return 'Pitch: '+value;
    },
    min: -180,
    max: 180,
    value: 0
  })
   .on("slide", function(ev){
    console.log(ev.value)
    if(modelName != "Grid")
          setRotationX(ev.value);
   });
$('#rotys').slider({
  formater: function(value) {
    return 'Yaw: '+value;
  },
  min: -180,
  max: 180,
  value: 0
})
 .on("slide", function(ev){
   console.log(ev.value);
   if(modelName != "Grid")
      setRotationY(ev.value);
 });
$('#rotzs').slider({
 formater: function(value) {
 return 'Roll: '+value;
 },
 min: -180,
 max: 180,
 value: 0
})
.on("slide", function(ev){
 console.log(ev.value);
 if(modelName != "Grid")
      setRotationZ(ev.value);
  });
$('#scales').slider({
  formater: function(value) {
    return 'Scale: ' + (value);
  },
  min: 0,
  max: 200,
  value: 100
})
.on('slide', function(ev){
  console.log(ev.value);
  if(modelName != "Grid")
      setScale(ev.value / 100)
});
