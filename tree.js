var ls = require('node-dir');
var __ = require('underscore');

function getList(start, callback) {
	var folders, files;
	var finished = __.after(2, function() {
		callback(null, folders.concat(files));
	});
	getAllDirectories(start)
		.then((rslt) => { return mapRelativeNames(rslt, start); })
		.then((rslt) => { folders = rslt; finished(); })
		.catch((err) => { callback(err); });
	getAllFiles(start)
		.then((rslt) => { return mapRelativeNames(rslt, start); })
		.then((rslt) => { files = rslt; finished(); })
		.catch((err) => { callback(err); });
}

function getObject(start, callback) {
	var folders, files;
	var finished = __.after(2, function() {
		//callback(null, generateDirectory(folders));
		var dir = generateDirectory(folders);
		callback(null, buildFolderStructure(files, dir));
	});
	getAllDirectories(start)
		.then((rslt) => { return mapRelativeNames(rslt, start); })
		.then((rslt) => { folders = rslt; finished(); })
		.catch((err) => { callback(err); });
	getAllFiles(start)
		.then((rslt) => { return mapRelativeNames(rslt, start); })
		.then((rslt) => { files = rslt; finished(); })
		.catch((err) => { callback(err); });
}

module.exports.getList = getList;
module.exports.getObject = getObject;

//list all directories (recursive)
function getAllDirectories(start) {
    return new Promise((res, error) => {
        ls.subdirs(start, function (err, subdirs) {
            if (err) error(err);
            else res(subdirs);
        });
    });
}

//list all files (recursive)
function getAllFiles(start) {
    return new Promise((res, error) => {
        ls.files(start, function (err, files) {
            if (err) error(err);
            else res(files);
        });
    });
}

//create directory structure
function generateDirectory(array) {
    var dir = {}, current, tmp;
    for (var i = 0; i < array.length; i++) {
        current = dir;
        tmp = array[i].split('/').slice(1);
        for (var j = 0; j < tmp.length; j++) {
            if (current[tmp[j]] == null) {
                current[tmp[j]] = {'...': {}, '_files_': []};
            }
            current = current[tmp[j]];
        }
    }
    return dir;
}

//removes predicate string from each item in list
function mapRelativeNames(list, predicate) {
    return list.map((item) => {
        return item.replace(predicate, '');
    });
}

//generate tree view
function buildFolderStructure(list, dir) {
	function create_path(path, current_dir) {
		var parts = path.split('/').filter((val) => {return val != "";});
		if (parts.length == 1) {
			if (current_dir['_files_'] == null) { current_dir['_files_'] = []; }
			current_dir['_files_'].push(parts[0]);
		} else {
			var next = parts[0];
			parts.shift();
			var new_path = parts.reduce(reduce_path, '');
			create_path(new_path, current_dir[next]);
		}
	}
	for (var i = 0; i < list.length; i++) {
		create_path(list[i], dir);
	}
	return dir;
}

//turns an array of folder parts into path
function reduce_path(a, b) {return a + '/' + b;};
