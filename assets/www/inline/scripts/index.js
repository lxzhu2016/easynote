(function(){
	function onDeviceReady() {
		setTimeout(function() {
			$.mobile.changePage('home.html');
		}, 0);
	}
	$(window).load(function() {
		onDeviceReady();
	});
})();

