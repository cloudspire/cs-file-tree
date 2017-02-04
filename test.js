var tree = require('./index');

tree.getObject(__dirname, function(err, rslt) {
	if (err) {
		console.dir(err);
	} else {
		console.dir(rslt);
	}
});
