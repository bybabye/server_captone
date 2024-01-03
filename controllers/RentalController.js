import HomeModel from "../models/homeModels.js";
import NotificationModel from "../models/notificationModel.js";
import RentalModel from "../models/rentalModel.js";
import UserModel from "../models/userModels.js";

export const addRental = async (req, res) => {
  try {
    const { homeId, leasePeriod, cost } = req.body;
    const uid = res.locals.uid;

    const currentDate = new Date();
    const leaseEndDate = new Date(currentDate);

    const [user, home] = await Promise.all([
      await UserModel.findOne({ uid }),
      await HomeModel.findOne({ _id: homeId }),
    ]);

    console.log(home.ownerId);
    leaseEndDate.setMonth(currentDate.getMonth() + leasePeriod);
    // kiểm tra xem nhà đã đc thuê chưa
    const [checkRental, checkRentalUser] = await Promise.all([
      RentalModel.findOne({
        homeId: homeId,
        rentalStatus: true,
      }),
      RentalModel.findOne({
        tenantId: user._id,
        rentalStatus: true,
      }),
    ]);
    if (checkRental || checkRentalUser) {
      return res.status(404).send({ message: "User has rented this room" });
    }
    const newRental = RentalModel({
      homeId: homeId,
      tenantId: user._id,
      leasePeriod: leasePeriod,
      cost: cost,
      endTime: leaseEndDate,
      hostId: home.ownerId,
      rentalStatus: 0,
    });
    await newRental.save();
    return res
      .status(201)
      .send({ message: "Rental created successfully", data: newRental._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
export const getRental = async (req, res) => {
  try {
    const rentalId = req.query.rentalId;
    const rental = await RentalModel.findOne({ _id: rentalId }).populate(
      "tenantId"
    ).populate("homeId");
    if (rental) {
      return res.status(200).send({
        data: rental,
      });
    }
    return res.status(404).send({ message: "Rental not found!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
/**
 * lấy id của rental
 * Chuyển trạng thái từ chưa thuế thành đã thuê
 * Chuyển trạng thái nhà ở đã được thuê
 * Xoá hết các notification có chứa rental đó
 * Xoá hết các notification của người thuê trước đó
 * chặn thuê nếu người dùng đã thuê đc phòng
 */
export const rentalConfirmation = async (req, res) => {
  try {
    const rentalId = req.query.rentalId;
    const rental = await RentalModel.findOne({ _id: rentalId });
    if (rental.rentalStatus) {
      return res.status(400).send({ message: "Rental is confirmed!" });
    }
    await Promise.all([
      NotificationModel.deleteMany({ senderId: rental.tenantId }),
      RentalModel.deleteMany({
        tenantId: rental.tenantId,
        _id: { $ne: rental._id },
      }),
      rental.updateOne({
        $set: { rentalStatus: true },
      }),
    ]);

    return res.status(200).send({ message: "Rental confirmed!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
/**
 * tim kiem tat ca nhung nha da cho thue cua host do
 */
export const getRentalsForHost = async (req, res) => {
  try {
    const uid = res.locals.uid;
    const user = await UserModel.findOne({ uid});

    const rentals = await RentalModel.find({hostId : user._id}).populate('tenantId').populate(
      {
        path : 'homeId',
        populate : {path : 'ownerId'}
      }
    );

    return res.status(200).send({data : rentals});

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
