//  file chạy chính server

import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT"]
  })
);
app.get("/", (req, res) => {
  res.send("hello word");
});
const PORT = 3000;
app.listen(PORT, (req, res) => {
  console.log(`server cua ban dang chay tren http://localhost:3000`);
});
