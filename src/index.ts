import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port: string | 3000 = process.env.PORT || 3000;

app.listen(port, (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
