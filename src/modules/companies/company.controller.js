import { Router } from "express";
import * as CS from "./company.service.js";
import * as CV from "./company.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
import jopRouter from "../jobs/job.controller.js";
const companyRouter = Router();
companyRouter.use("/:companyName/", jopRouter)

companyRouter.post("/addCompany",
  multerHost([...fileTypes.image, ...fileTypes.document]).single("legalAttachment"),
  validation(CV.addCompanySchema),
  authentication,
  CS.addCompany
);
companyRouter.patch("/updateCompany/:id",
    validation(CV.updateCompanySchema),
    authentication,
    CS.updateCompany
);
companyRouter.patch("/softDelete/:id",
  validation(CV.DeleteCompanyLogoSchema),
  authentication,
  CS.softDelete
);
companyRouter.get("/companySearch/:companyName",
    validation(CV.companySearchSchema),
    CS.companySearch
);
companyRouter.patch("/uploadCompanyLogo/:id",
  multerHost(fileTypes.image).single("Logo"),
    validation(CV.uploadCompanyLogoSchema),
  authentication,
  CS.uploadCompanyLogo
);
companyRouter.patch("/uploadCompanyCover/:id",
    multerHost(fileTypes.image).single("coverPic"),
      validation(CV.uploadCompanyLogoSchema),
    authentication,
    CS.uploadCompanyCover
);
companyRouter.patch("/DeleteCompanyLogo/:id",
    validation(CV.DeleteCompanyLogoSchema),
    authentication,
    CS.DeleteCompanyLogo
  );
  companyRouter.patch("/DeleteCompanyCoverPic/:id",
    validation(CV.DeleteCompanyLogoSchema),
    authentication,
    CS.DeleteCompanyCoverPic
  );
export default companyRouter;
