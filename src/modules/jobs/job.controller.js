import { Router } from "express";
import * as JS from "./job.service.js";
import * as JV from "./job.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
const jopRouter = Router({mergeParams:true});
jopRouter.post("/addJop", validation(JV.addJopSchema), authentication, JS.addJop);
jopRouter.patch("/updateJop/:id", validation(JV.updateJopSchema), authentication, JS.updateJop);
jopRouter.patch("/deleteJop/:id", validation(JV.deleteJopSchema), authentication, JS.deleteJop);
jopRouter.get("/matchjobs", authentication, validation(JV.matchjobsSchema), JS.matchjobs)
jopRouter.post("/applyToJob",
    multerHost(fileTypes.document).single("userCV"),
    validation(JV.applyToJobSchema),
    authentication,
    authorization("User"),
    JS.applyToJob)

jopRouter.patch("/applyStatus", validation(JV.applyStatusSchema), JS.applyStatus);

jopRouter.get("/:jobId?", authentication, validation(JV.JopsSchema), JS.jobs)

export default jopRouter;