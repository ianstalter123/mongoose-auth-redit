var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
                    comment: String,
                    ownerId:String,
                    post: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Post"
                    }
                  });


var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;