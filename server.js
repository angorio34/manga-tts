import express from "express"; import cors from "cors"; import fetch from "node-fetch"; import { createWriteStream } from "fs"; import { exec } from "child_process";

const app = express(); app.use(cors()); app.use(express.json());

app.post("/api/process", async (req, res) => { const { url } = req.body; if (!url) return res.status(400).json({ error: "Нет ссылки на мангу" });

try { // Загружаем изображение страницы манги const response = await fetch(url); if (!response.ok) throw new Error("Не удалось загрузить изображение");

const fileStream = createWriteStream("page.jpg");
response.body.pipe(fileStream);
await new Promise((resolve) => fileStream.on("finish", resolve));

// Распознаём текст с изображения (используем Tesseract)
exec("tesseract page.jpg output", async (error) => {
  if (error) return res.status(500).json({ error: "Ошибка OCR" });
  
  // Читаем распознанный текст
  const text = await fs.promises.readFile("output.txt", "utf8");
  if (!text.trim()) return res.status(500).json({ error: "Текст не найден" });
  
  // Генерируем аудиофайл с TTS (используем Edge TTS)
  exec(`edge-tts --text \"${text}\" --voice ru-RU-SvetlanaNeural --out output.mp3`, async (err) => {
    if (err) return res.status(500).json({ error: "Ошибка синтеза речи" });
    
    res.json({ audioUrl: "output.mp3" });
  });
});

} catch (err) { res.status(500).json({ error: err.message }); } });

app.listen(3001, () => console.log("Сервер запущен на порту 3001"));
Добавлен сервер
