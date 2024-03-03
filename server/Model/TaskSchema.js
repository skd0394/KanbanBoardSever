const mongoose=require('mongoose')

const TaskSchema=new mongoose.Schema({
    board: { type: mongoose.Types.ObjectId, ref: 'Board' }, 
    title: String,
    description:String,
    category:{type:String,enum:['Unassigned','InDevelopment','Pending Review','done']},
    assignedTo: { type: mongoose.Types.ObjectId, ref: 'User'},
    deadline:Date
},{timestamps:true})

const Task=new mongoose.model("Task",TaskSchema)

module.exports=Task