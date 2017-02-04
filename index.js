var tree = require('./tree');

exports.getList = tree.getList;
exports.getObject = tree.getObject;

exports.getListPromise = function(start) {
	return new Promise((res, err) => {
		tree.getList(start, function (error, rslt) {
			if (error) { err(error); }
			else { res(rslt); }
		});
	});
}
exports.getObjectPromise = function(start) {
	return new Promise((res, err) => {
		tree.getObject(start, function (error, rslt) {
			if (error) { err(error); }
			else { res(rslt); }
		});
	});
}
