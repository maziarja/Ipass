import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT;

app.listen(port || "5001", () => {
  console.log(`Server is running on PORT ${port}`);
});
