import CommentModel from "../models/commentModel.js";
import HomeModel from "../models/homeModels.js";
import UserModel from "../models/userModels.js";
//add comment
export const addComment = async (req, res) => {
  try {
    const uid = res.locals.uid;

    const homeId = req.query.homeId;
    const { content } = req.body;
    const [user, home] = await Promise.all([
      UserModel.findOne({ uid }),
      HomeModel.findById(homeId),
    ]);
 
    if (!home) {
      return res.status(404).send({ message: "Home not Found" });
    }
    
    const newComment = new CommentModel({
      content,
      homeId,
      authorId: user._id,
    });
    await newComment.save();
    return res.status(201).send({ message: "Comment created successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
// update comment
export const updateComment = async (req, res) => {
  try {
    const uid = res.locals.uid;
    
    const commentId = req.query.commentId;
    const { content } = req.body;
    // tìm user cho bài comment đó
    const user = await UserModel.findOne({ uid });
    // tìm comment update đảm bảo 2 điều kiện là chủ comment và id comment đó
    const comment = await CommentModel.findOne({
      authorId: user._id,
      _id: commentId,
    });
    if (!comment) {
      return res.status(404).send({ message: "Comment Not Found" });
    }
    await CommentModel.findByIdAndUpdate(comment._id,{content : content},{new : true});
    return res.status(200).send({ message: "Comment update successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
// delete comment
export const removeComment = async (req, res) => {
  try {
    const uid = res.locals.uid;
   
    const commentId = req.query.commentId;
    // tìm user cho bài comment đó
    const user = await UserModel.findOne({ uid });
    // tìm comment xoá đảm bảo 2 điều kiện là chủ comment và id comment đó
    const comment = await CommentModel.findOne({
      authorId: user._id,
      _id: commentId,
    });
    if (!comment) {
      return res.status(404).send({ message: "Comment Not Found" });
    }
    await CommentModel.findByIdAndRemove(comment._id);
    return res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
