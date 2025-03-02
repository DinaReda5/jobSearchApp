import connectionDB from "./DB/connectionDB.js";
import authRouter from "./modules/Auth/auth.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import dashboardRouter from "./modules/dashboard/dashboard.controller.js";
import jopRouter from "./modules/jobs/job.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandler } from "./utilits/index.js";
import cors from 'cors'
const bootstrap = (app, express) => {
  app.use(cors())

 // middleware for passing request body
  app.use(express.json());
  
 //connect to database
  connectionDB();
  
  // Home route
  app.get("/", (req, res, next) => {
   return res.status(200).json({message:"hello on Jop Search App"})
  });
  
 //application routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/jop", jopRouter);
  app.use("/dashboard", dashboardRouter);


 //routes for unhandeled request
 app.use("*", (req, res, next) => {
   return next(new Error(`invalid url ${req.originalUrl}`));
 });
  
  //global Error Handler
  app.use(globalErrorHandler);
}
export default bootstrap