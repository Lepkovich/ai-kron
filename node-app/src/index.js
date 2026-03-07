import express from "express";
import chatRoutes from "./routes/chatRoutes.js";
import materialRoutes from "./routes/material.routes.js";

const app = express();
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/materials", materialRoutes);

app.get("/", (req, res) => {
  res.send("AI Kron backend is running 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
