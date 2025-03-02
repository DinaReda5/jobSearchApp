import { Router } from "express";
import * as DS from "./dashboard.service.js";
import * as DV from "./dashboard.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
const dashboardRouter = Router();
dashboardRouter.patch("/banedUser/:id", validation(DV.banUserSchema), DS.banUser)
dashboardRouter.patch("/banCompany/:id", validation(DV.banUserSchema), DS.banCompany)
dashboardRouter.patch("/approveCompany/:id",validation(DV.banUserSchema),DS.approveCompany)



export default dashboardRouter;