const { model , Schema } = require('mongoose')
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2")

const videoSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : Number,
        required : true
    },
    discription : {
        type : String,
        required : true,
    },
    videoFile : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    isPublished : {
        type : Boolean,
        default : false
    }
} , { timestamps : true })

videoSchema.plugin(mongooseAggregatePaginate)

const Video = model("Video" , videoSchema)

module.exports = Video;