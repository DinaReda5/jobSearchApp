import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
const userRouter = Router();
userRouter.patch("/updateAccount",
  validation(UV.updateAccountSchema),
  authentication,
  US.updateAccount
);
userRouter.get("/accountData",
  authentication,
  US.accountData
);
userRouter.get("/profile/:id",validation(UV.shareProfileSchema),authentication,US.shareProfile); 
userRouter.patch("/updatePassword",
  validation(UV.updatePasswordSchema),
  authentication,
  US.updatePassword
);
userRouter.post("/UploadProfilePic",
    multerHost(fileTypes.image).single("attachment"),
    validation(UV.UploadProfilePicSchema),
    authentication,
    US.UploadProfilePic)

userRouter.post("/UploadCoverPic",
  multerHost(fileTypes.image).single("attachment"),
  validation(UV.UploadCoverPicSchema),
  authentication,
  US.UploadCoverPic
);
userRouter.patch("/DeleteProfilePic",
  authentication,
  US.DeleteProfilePic
);
userRouter.patch("/DeleteCoverPic",
  authentication,
  US.DeleteCoverPic
);
userRouter.patch("/softDelete/:id",
  validation(UV.shareProfileSchema),
  authentication,
  US.softDelete
);
export default userRouter;
