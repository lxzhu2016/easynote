(function() {
	var traceTag = 'account.js:';
	if (!window.easynote)
		return;
	function onPageChange() {		
		console.log(traceTag + ' onPageChange started')
		var accounts = window.easynote.database.list_account();
		var count = accounts.length;
		for ( var idx = 0; idx < count; idx++) {
			var ac = accounts[idx];
			var html = '<div id="account-' + ac.id + '">' + '<p>' + ac.name
					+ '</p>' + '</div>';
			$('#account-list').append($(html));
		}
	}
	window.easynote.on_page_before_show(window.easynote.dirs.www+'/account.html', onPageChange);
})();
