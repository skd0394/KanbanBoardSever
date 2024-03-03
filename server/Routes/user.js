const Board = require("../Model/BoardSchema");
const Task = require("../Model/TaskSchema");

const router = require("express").Router();

//board

router.post("/user/new-board", async (req, res) => {
  try {
    let newBoard = new Board({
      name: req.body.name,
      createdBy: req.user._id,
      members: [],
    });
    await newBoard.save();
    let result = await User.findById({ _id: req.user._id });
    if (result) {
      result.recentlyVisitedBoard = req.body.recentlyVisitedBoard;
      await result.save();
    }
    res.status(200).json({ message: "Board created successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/board", async (req, res) => {
  console.log(req.user._id);
  try {
    if (req.user._id) {
      let boards = await Board.find({ createdBy: req.user._id })
        .sort({ timestamp: -1 })
        .populate("createdBy");
      console.log(boards);
      if (boards) {
        res.status(200).json({ message: "Recently used boards", data: boards });
      } else {
        res.status(301).json({ message: "boards not found" });
      }
    } else {
      res.status(401).json({ message: "Please login first" });
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.put("/edit-board", async (req, res) => {
  try {
    if (req.user._id) {
      let boards = await Board.findOneAndUpdate(
        { createdBy: req.user._id },
        { $set: { name: req.body.name } },
        { new: true }
      );
      if (boards) {
        res
          .status(200)
          .json({ message: "Board Updated Successfully", data: boards });
      }
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

//Tasks

router.post("/add-tasks", async (req, res) => {
  try {
    let task = await new Task({
      ...req.body,
    });
    await task.save();
    res.status(200).send({ message: "Task added Successfully", task: task });
  } catch (error) {
    res.status(500).send("Something went wrong")
  }
});

router.get('/get-tasks',async(req,res)=>{
  try{
    const tasks=await Task.find()
    return res.status(200).json({data:tasks})
  }catch(error){
    res.status(500).send("Something went wrong");
  }
})

router.put("/update-task/:id",async (req, res) => {
      try {
        const id=req.params.id;
        const task=await Task.findByIdAndUpdate(id, req.body ,{new:true})
        if (!task)
          return res
            .status(404)
            .json({ message: "No task Found" });
        else
          return res.status(200).json({ data: task, message: "Task Updated Successfully" });
      } catch (error) {
        console.log('Error in updating the task');
        return res.status(500).json({ message: 'Internal Server Error' });
      }
})




module.exports = router;
