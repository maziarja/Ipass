import "dotenv/config";
import app from "./app";

const port = process.env.PORT;

app.listen(port || "5001", () => {
  console.log(`Server is running on PORT ${port}`);
});
