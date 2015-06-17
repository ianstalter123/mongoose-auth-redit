var mongoose = require("mongoose");
var Comment = require("./comment");

var postSchema = new mongoose.Schema({
                    title: String,
                    url: String,
                    ownerId: String,
                    comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }]
                  });

//set up post as parent association

postSchema.pre('remove', function(callback) {
    Comment.remove({post_id: this._id}).exec();
    callback();
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;