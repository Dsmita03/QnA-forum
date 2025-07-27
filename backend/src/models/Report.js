import mongoose from "mongoose";


const reportSchema=mongoose.Schema({
    reporterId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    questionId:{type:mongoose.Schema.Types.ObjectId,ref:"Question",required:true},
    reason:{type:String,required:true},
    message:{type:String},
    status:{type:String,enum:["pending","reviewed","dismissed"],default:"pending"}
},
{timestamps:true}
)
export const Report=mongoose.model("Report",reportSchema)