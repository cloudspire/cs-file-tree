var ls = require('node-dir');
var __ = require('underscore');

function getList(start, callback) {
	start = ensurePathFormat(start);
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
	start = ensurePathFormat(start);
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

//make sure path is correct format
function ensurePathFormat(path) {
	var chr = path.substring(path.length - 1);
	if (chr != '/') { path += '/'; }
	return path;
}

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
	var tmp = getFileParts(predicate).pop();
    return list.map((item) => {
        return tmp + '/' + item.replace(predicate, '');
    });
}

//returns an array representing a files path
function getFileParts(file) {
	return file.split('/').filter((val) => { return val != ""; })
}

//generate tree view
function buildFolderStructure(list, dir) {
	for (var i = 0; i < list.length; i++) {
		//remove first part of path (this is the current_dir)
		var parts = getFileParts(list[i]);
		parts.shift();
		//call recursive algorthm to add path object to tree
		create_path(parts.reduce(reduce_path, ''), dir);
	}
	return dir;
}

//recursive algorithm to buld folder structures
function create_path(path, current_dir) {
	var parts = getFileParts(path);
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

//turns an array of folder parts into path
function reduce_path(a, b) {return a + '/' + b;};
