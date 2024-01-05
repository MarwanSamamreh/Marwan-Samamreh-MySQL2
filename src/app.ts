import express, { Request, Response, NextFunction } from "express";
import bookRoutes from "./routes/books";
import commentRoutes from "./routes/comments";
import publisherRoutes from "./routes/publishers";
import usersRoutes from "./routes/users";
import sequelize from "./config/database";

const app = express();
const PORT = 3000;

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
