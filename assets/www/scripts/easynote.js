(function() {
	var traceTag = 'easynote.js:';
	if (!window.easynote)
		window.easynote = {
			dirs:{
				assets:'file:///android_asset',
				www:'file:///android_asset/www'				
			}
	};
	//声明pub和pri这两个变量。
	//pub是会挂在window.easynote上的全局变量的别名。
	//pri是本地使用的其他所有函数和变量的容器。将他们都挂在pri上，有利于名字解析。
	var pub = window.easynote;
	var pri = {
		is_device_ready : false,//设备是否准备好(PhoneGap事件)
		device_ready_callbacks : [],
		trace_buffer : [],
		trace : function(level, message) {
		},
		trace_flush_buffer : function() {
		},
		trace_to_console : function(level, message) {
		},
		trace_levels : {
			log : 'log',
			debug : 'debug',
			info : 'info',
			warn : 'warn',
			error : 'error'
		},
		on_page_before_show_callbacks : {},
		on_page_before_show : function(url, callback) {
		}

	};

	pub.on_device_ready = function(callback) {
		pub.console.debug('new callback registered.');
		pri.device_ready_callbacks.push(callback);
	};
	pub.console = {
		log : function(message) {
			pri.trace('log', message);
		},
		debug : function(message) {
			pri.trace('debug', message);
		}
	};
	pub.on_page_before_show = function(url, callback) {
		pri.trace(pri.trace_levels.debug, traceTag
				+ 'new callack resigered for url:' + url);
		pri.on_page_before_show(url, callback);
	};

	// /
	pri.trace = function(level, message) {
		if (pri.is_device_ready) {
			pri.trace_to_console(level, message);
		} else {
			pri.trace_buffer.push({
				level : level,
				message : message
			});
		}
	};
	pri.dump = function(data) {
		var retTEXT = '';
		if (data === undefined) {
			retTEXT = 'undefined';
		} else if (data === null) {
			retTEXT = 'null';
		} else {
			for ( var p in data) {
				retTEXT += 'property:' + p + '=' + data[p] + '\n';
			}
			return retTEXT;
		}
	};
	
	pri.trace_to_console = function(level, message) {
		if ('log' === level)
			console.log(message);
		else if ('debug' === level)
			console.debug(message);
		else
			console.log(message);
	};
	pri.trace_flush_buffer = function() {
		if (!pri.is_device_ready)
			return;
		var count = pri.trace_buffer.length;
		for ( var idx = 0; idx < count; idx++) {
			var item = pri.trace_buffer[idx];
			pri.trace_to_console(item.level, item.message);
		}
	};

	pri.fire_device_ready = function() {
		console.debug(traceTag + 'pri.fire_device_ready');
		pri.is_device_ready = true;
		pri.trace_flush_buffer();
		var count = pri.device_ready_callbacks.length;
		for ( var idx = 0; idx < count; idx++) {
			var callback = pri.device_ready_callbacks[idx];
			callback();
		}
	};

	pri.on_page_before_show = function(url, callback) {
		pri.trace(pri.trace_levels.debug, traceTag
				+ 'new callack resigered for url:' + url);
		pri.on_page_before_show_callbacks[url] = callback;
	};

	pri.fire_registered_page_before_show_callback = function(data) {		
		pri.trace(pri.trace_levels.debug,'data.options='+pri.dump(data.options));
		var callback = pri.on_page_before_show_callbacks[data.absUrl];
		if (callback === undefined || callback === null) {
			pri.trace(pri.trace_levels.debug, traceTag
					+ 'does not find callback for:' + data.absUrl);
			return;
		} else if (typeof (callback) != 'function') {
			pri.trace(pri.trace_levels.debug, traceTag + 'callback for:'
					+ data.absUrl + ' is not function');
			return;
		}
		callback();
	};

	$(document)
			.ready(
					function() {
						var traceLog = traceTag + 'ready callback started';
						pri.trace(pri.trace_levels.debug, traceLog);
						$(document)
								.on(
										'pagechange',
										function(evt, data) {
											traceLog = traceTag
													+ 'pagechange callback for:'
													+ data.absUrl + ' started.';
											pri.trace(pri.trace_levels.debug,
													traceLog);
											traceLog = traceTag
													+ 'pagechange callback arguments length:'
													+ arguments.length;
											pri.trace(pri.trace_levels.debug,
													traceLog);
											pri
													.fire_registered_page_before_show_callback(data);
										});
					});

	$(window).load(function() {
		document.addEventListener("deviceready", pri.fire_device_ready, true);
	});

})();