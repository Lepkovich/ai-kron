import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// сохраняем файлы в папку /app/data (она примонтирована из docker-compose)
const upload = multer({ dest: "data/" });

// Загрузка файла
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "Файл загружен",
    file: req.file
  });
});

// Список файлов
router.get("/list", (req, res) => {
  const files = fs.readdirSync("data");
  res.json(files);
});

// Удаление файла
router.delete("/:filename", (req, res) => {
  const { filename } = req.params;
  fs.unlinkSync(`data/${filename}`);
  res.json({ message: "Удалено" });
});

export default router;
