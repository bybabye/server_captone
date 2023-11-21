import express from "express";


import { addRental, getRental, getRentalsForHost, rentalConfirmation } from "../controllers/RentalController.js";

const RentalRouter = express.Router(); 

RentalRouter.post('/rental/add',addRental);
RentalRouter.get('/rental/get',getRental)
RentalRouter.patch('/rental/confirm',rentalConfirmation)
RentalRouter.get('/rental/get/host',getRentalsForHost)
export default RentalRouter;