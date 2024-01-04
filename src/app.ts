import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import bookRoutes from "./routes/books";
import commentRoutes from "./routes/comments";
import publisherRoutes from "./routes/publishers";
import usersRoutes from "./routes/users";
import sequelize from "./config/database";
import Sequelize from "sequelize";
import dotenv from "dotenv";

// import SessionSequelize from "express-session-sequelize";

const app = express();
const PORT = 3000;
dotenv.config();

// app.use(
//   session({
//     secret:
//       "0db08d4cd8646fe86298d6868772e243c71f4276335be0f855cc784e3fceb844c3e9f825d00ecec55b27ed75a2e54331f469760b7a94422c5184788f39186279",
//     resave: false,
//     saveUninitialized: false,
//     name: "sessionId",
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 60 * 60 * 1000,
//     },
//   })
// );

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log("Error syncing the database", err);
  });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(express.json());
app.use("/books", bookRoutes);
app.use("/comments", commentRoutes);
app.use("/publishers", publisherRoutes);
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
