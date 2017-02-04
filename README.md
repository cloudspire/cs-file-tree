## Synopsis

Tree structure that represents the contents (files / folders) of a given start folder. Simply pass in a start folder and this module will return an object that you can use in a user interface to represent your files!

##Requirements

Before building this project you will need the following resources:

- npm

## Installation

```js
npm install cs-file-tree --save
```

## Usage

There are 2 functions exposed in this module (excluding the promise wrappers): 'getList' and 'getObject'.
getList returns a list off all files and folders, and getObject returns the tree structure. See below for instructions.

### Get List of Files / Folder
```js
var tree = require('cs-file-tree');
tree.getList(__dirname, function(err, rslt) {
	if (err) {
		console.dir(err);
	} else {
		console.dir(rslt);
	}
});
```

### Get Tree Structure
```js
var tree = require('cs-file-tree');
tree.getObject(__dirname, function(err, rslt) {
	if (err) {
		console.dir(err);
	} else {
		console.dir(rslt);
	}
});
```

## Promise wrappers

For your convenience I have added wrappers to expose these functions as promises. See below for instructions.

### Get List of Files / Folders (Promise)
```js
var tree = require('cs-file-tree');
tree.getList(__dirname)
	.then((rslt) => { ...do something })
```

### Get Tree Structure (Promise)
```js
var tree = require('cs-file-tree');
tree.getObject(__dirname)
	.then((rslt) => { ...do something })
```
