window.easynote.on_device_ready(function() {

	var traceTag = 'database.js:';
	console.log(traceTag + 'start database.js');
	window.easynote.database = {
		isOnline : false,
		size : 2 * 1024 * 1024,
		row_exist : function(table, id) {
		},
		list_account : function(options) {
		},
		save_account : function(account) {
		},
		delete_account : function(id) {
		}
	};
	console.debug(traceTag + 'complete declare database interface.');
	// / following are implementation details.
	var pub = window.easynote.database;
	var pri = {
		handle : null
	};
	console.debug(traceTag + 'try to open database.');
	pri.handle = window.openDatabase('easynote', '1.0', 'easynote database',
			pub.size, function(database) {
			  console.debug(traceTag+'database creation callback.');
				pri.migrate(database);
			});

	pub.isOnline = pri.handle !== null;

	console.debug(traceTag + 'is database online? ' + pub.isOnline);
	console.debug(traceTag = 'declare pri.migrate');
	pri.migrate = function(database) {
		console.debug(traceTag + 'pri.migrate started.');
		database.changeVersion('', '1.0', function(tx) {
			pri.migrate10(tx);
		});
		console.debug(traceTag + 'pri.migrate finished.');
	};

	pri.migrate10 = function(tx) {
		console.debug(traceTag + 'pri.migrate10 started.');
		tx.executeSql('create table AccountType(id int,name nvarchar(20))');
		console.debug(traceTag + 'table AccountType created.');
		tx.executeSql('insert into AccountType(id,name) values(?,?)',
				[ 1, '资产' ]);
		tx.executeSql('insert into AccountType(id,name) values(?,?)', [ -1,
				'负债' ]);
		tx.executeSql('create table Account(id int, name nvarchar(20), ' 
			+ 'account_type int, balance float, money_unit int,' 
			+ ' visible int,display_order int,description nvarchar(100)');
		tx.executeSql('insert into Account('
				+ 'id,name,account_type,balance,money_unit,visible,'
				+ 'display_order,description) ' + 'values (?,?,?,?,?,?,?,?)', [
				1, '现金', 1, 0, 1, 1, 1, '现金帐号' ]);
		console.debug(traceTag + 'pri.migrate10 finished.');

	};
	pri.copy_result_list = function(result) {
		var retList = [];
		var count = result.rows.length;
		for ( var idx = 0; idx < count; idx++) {
			retList.push(result.rows.item(idx));
		}
		return retList;
	};

	pub.row_exist = function(table, id) {
		console.debug(traceTag + 'pub.row_exist started.');
		var exist = false;
		if (id > 0) {
			pri.handle.transaction(function(tx) {
				tx.executeSql('select id from ' + table + ' where id=?',
						[ id ], function(tx, result) {
							exist = result.rows.length > 0;
						}, function(err) {
							window.navigator
									.alert('error when querying database:'
											+ err.code);
						});
			});
		}
		console.debug(traceTag + 'pub.row_exist finished.');
		return exist;
	};

	pub.list_account = function(options) {
		console.debug(traceTag + 'pub.list_account started.');
		var retAccountList = [];
		var sql = "select * from Account";
		pri.handle.transaction(function(tx) {
			tx.executeSql(sql, [],
				function(tx, result) {
				retAccountList = pri.copy_result_list(result);
				},
				function(err) {
			});
		});
		console.debug(traceTag + 'pub.list_account finished.');
		return retAccountList;
	};

	pub.save_account = function(account) {
		if (pub.row_exist('Account', account.id)) {
			pri.handle.transaction(function(tx) {
				var sql = 'update Account set ' + 'name=?' + ',account_type=?'
						+ ',balance=?' + ',money_unit=?' + ',visible=?'
						+ ',display_order=?' + ',description=?' + 'where id=?';
				tx.executeSql(sql,
						[ account.name, account.account_type, account.balance,
								account.money_unit, account.visible,
								account.display_order, account.description,
								account.id ], function(tx, result) {

						}, function(err) {

						});
			});
		}
	};

});
