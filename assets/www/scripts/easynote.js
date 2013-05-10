(function() {
	if (!window.easynote)
		window.easynote = {};
	var pub=window.easynote; 
	
	var pri = {
		device_ready_callbacks : []		
	};
	
	pub.on_device_ready = function(callback) {
		pri.device_ready_callbacks.push(callback);
	};
	pri.fire_device_ready = function() {
		var count = pri.device_ready_callbacks.length;
		for ( var idx = 0; idx < count; idx++) {
			var callback = pri.device_ready_callbacks[idx];
			callback();
		}
	};
	$(window).load(function() {
		document.addEventListener("deviceready", pri.fire_device_ready, true);
	});
})();