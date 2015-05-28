$(function(){

	var clock = $('#clock'),
		alarm = clock.find('.alarm'),
		ampm = clock.find('.ampm');
	var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
	var digits = {};
	var positions = [
		'm1', 'm2', ':', 's1', 's2'
	];
	var digit_holder = clock.find('.digits');

	$.each(positions, function(){

		if(this == ':'){
			digit_holder.append('<div class="dots">');
		}
		else{

			var pos = $('<div>');

			for(var i=1; i<8; i++){
				pos.append('<span class="d' + i + '">');
			}

			// Set the digits as key:value pairs in the digits object
			digits[this] = pos;

			// Add the digit elements to the page
			digit_holder.append(pos);
		}

	});
  function checkTime(){
    if ( $(".digits div:nth-child(4)").hasClass("two")){
      console.log("two minutes!");
      $(".digits").addClass("winner");
      $(".winnerMessage").addClass("winner");
      clearInterval(handle);
    };
  } 

	// Run a timer every second and update the clock
var now = moment().startOf('hour');
   
	function update_time(){
    
		// Use moment.js to output the current time as a string
		// hh is for the hours in 12-hour format,
		// mm - minutes, ss-seconds (all with leading zeroes),
		// d is for day of week and A is for AM/PM
    
      var formatted = now.format("mmss");
      
      digits.m1.attr('class', digit_to_name[formatted[0]]);
      digits.m2.attr('class', digit_to_name[formatted[1]]);
      digits.s1.attr('class', digit_to_name[formatted[2]]);
      digits.s2.attr('class', digit_to_name[formatted[3]]);
  
    now = now.add(1, 's');
		// Schedule this function to be run again in 1 sec
    checkTime();
	};
  var handle = setInterval(update_time, 1000);

});