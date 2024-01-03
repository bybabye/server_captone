import HomeModel from "../models/homeModels.js";
import NotificationModel from "../models/notificationModel.js";
import RentalModel from "../models/rentalModel.js";
import ReportModel from "../models/reportModel.js";
import UserModel from "../models/userModels.js";
const blockUser = async (req, res) => {
  const userIdToBlock = req.params.id;
  console.log(userIdToBlock);
  try {
    const userToBlock = await UserModel.findByIdAndUpdate(
      userIdToBlock,
      { $set: { isBlocked: true } },
      { new: true } // Trả về người dùng đã được cập nhật
    );

    if (!userToBlock) {
      return res.status(404).send({ message: "User not found" });
    }
    return res
      .status(200)
      .send({ message: "User blocked successfully", data: userToBlock });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
const unBlockUser = async (req, res) => {
  const userIdToBlock = req.params.id;

  try {
    const userToUnBlock = await UserModel.findByIdAndUpdate(
      userIdToBlock,
      { $set: { isBlocked: false } },
      { new: true } // Trả về người dùng đã được cập nhật
    );

    if (!userToUnBlock) {
      return res.status(404).send({ message: "User not found" });
    }
    return res
      .status(200)
      .send({ message: "User unBlocked successfully", data: userToUnBlock });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
const findUsersByPartialUsername = async (req, res) => {
  const partialUsername = req.params.partialUsername;

  try {
    // Sử dụng $regex để tìm kiếm theo phần từ của userName
    // i la k phan biet hoa thuong
    const users = await UserModel.find({
      userName: { $regex: partialUsername, $options: "i" },
    });

    if (users.length === 0) {
      return res.status(404).send({ message: "No users found" });
    }

    return res.status(200).send({ message: "Users found successfully", users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const informationUser = async (req, res) => {
  try {
    const _id = req.query.id;
    console.log(_id);

    const [user, homes, rental, report] = await Promise.all([
      UserModel.findOne({ _id: _id }),
      HomeModel.countDocuments({ ownerId: _id }),
      RentalModel.countDocuments({ hostId: _id, rentalStatus: true }),
      ReportModel.countDocuments({ authorId: _id }),
    ]);
    // Lấy số lượng báo cáo từ trường ownerId trong mô hình HomeModel
    const reports = await HomeModel.aggregate([
      { $match: { ownerId: user._id } },
      {
        $lookup: {
          from: "reports", // Tên của bảng báo cáo trong MongoDB
          localField: "_id",
          foreignField: "homeId",
          as: "reports",
        },
      },
      { $unwind: "$reports" },
      {
        $group: {
          _id: null,
          numberOfReports: { $sum: 1 },
        },
      },
    ]);

    const numberOfReports = reports.length > 0 ? reports[0].numberOfReports : 0;

    // Chỉnh sửa dữ liệu trước khi trả về
    const data = {
      ...user.toObject(),
      numberOfHomes: homes,
      numberOfRental: rental,
      numberOfReports: numberOfReports,
      numberOfReportsCreatedByUser: report,
    };

    return res.status(200).send({ message: "success", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const listReport = async (req, res) => {
  try {
    const reports = await ReportModel.find()
      .populate("homeId")
      .populate("authorId")
      .sort({ status: 1, createdAt: -1 });

    return res.status(200).send({ message: "success", data: reports });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const getReportForId = async (req, res) => {
  const id = req.query.id;
  try {
    const reports = await ReportModel.findOne({ _id: id })
      .populate("homeId")
      .populate("authorId");

    return res.status(200).send({ message: "success", data: reports });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const skipReportForId = async (req, res) => {
  try {
    const id = req.query.id;
    const senderId = res.locals.uid;
    // chuyển trạng thái về true : tức là đã giải quyết và bỏ qua vấn đề
    // thông báo tới user báo là báo cáo vô hiệu
    const [reports, senderUser] = await Promise.all([
      ReportModel.findByIdAndUpdate({ _id: id }, { $set: { status: true } })
        .populate("homeId")
        .populate("authorId"),
      UserModel.findOne({ uid: senderId }),
    ]);
    const newNotifi = NotificationModel({
      senderId: senderUser._id,
      receiverId: reports.authorId._id,
      target: null,
      targetId: null,
      content: "Thông báo của bạn về bài viết Không chính xác",
      read: false,
    });
    await newNotifi.save();
    return res.status(200).send({ message: "Skipped created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const deletedPostFromReport = async (req, res) => {
  try {
    const id = req.query.id;
    const senderId = res.locals.uid;

    // Chuyển trạng thái về true: tức là đã giải quyết và bỏ qua vấn đề
    // Thông báo tới user báo là báo cáo vô hiệu
    const [report, senderUser] = await Promise.all([
      ReportModel.findByIdAndUpdate(
        { _id: id },
        { $set: { status: true } },
        { new: true } // Để nhận được document sau khi cập nhật
      )
        .populate("homeId")
        .populate("authorId"),
      UserModel.findOne({ uid: senderId }),
    ]);

    if (!report || !report.homeId || !report.authorId) {
      console.error("Không thể populate đầy đủ thông tin cho báo cáo.");
      return res.status(404).send({ message: "Report not found" });
    }

    const newNotifiForUser = NotificationModel({
      senderId: senderUser._id,
      receiverId: report.authorId._id,
      target: null,
      targetId: null,
      content: "Báo cáo bài viết của bạn thành công!",
      read: false,
    });

    const newNotifiForHost = NotificationModel({
      senderId: senderUser._id,
      receiverId: report.homeId.ownerId,
      target: null,
      targetId: null,
      content: "Bài đăng của bạn bị thu hồi vì vi phạm nguyên tắc!",
      read: false,
    });

    await Promise.all([
      newNotifiForUser.save(),
      newNotifiForHost.save(),
      HomeModel.findByIdAndDelete(report.homeId._id),
    ]);

    return res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Lỗi khi xóa bài đăng:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export {
  blockUser,
  findUsersByPartialUsername,
  informationUser,
  listReport,
  unBlockUser,
  getReportForId,
  skipReportForId,
  deletedPostFromReport
};
