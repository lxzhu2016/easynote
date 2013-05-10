(function() {	
	$(window).load(function() {
		document.addEventListener("deviceready", onDeviceReady, true);
	});
	function onDeviceReady() {
		if (!window.easynote)
			return;
		if (!window.easynote.database)
			return;
		var accounts = window.easynote.database.list_account();
		var count = accounts.length;
		for ( var idx = 0; idx < count; idx++) {
			var ac = accounts[idx];
			var html = '<div id="account-' + ac.id + '">' + '<p>' + ac.name
					+ '</p>' + '</div>';
			$('#account-list').append($(html));
		}
	}
})();