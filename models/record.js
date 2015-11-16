var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var recordSchema = new Schema({
	til: String,
	context: String,
	tags: [String],
	bestPartDay: String,
	//pageURL: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'TIL' model so we can interact with it in other files
module.exports = mongoose.model('Record', recordSchema);