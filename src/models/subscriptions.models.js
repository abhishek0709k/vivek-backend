const { Schema , model } = require("mongoose")

const subscriptionSchema = new Schema({
    subscriber : [
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    channel : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
} , { timestamps : true });

const Subscription = model("Subscription" , subscriptionSchema);

module.exports = Subscription;