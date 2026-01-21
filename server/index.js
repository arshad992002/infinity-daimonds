import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';
import multer from 'multer';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'data', 'db.json');

// Ensure uploads directory exists
const uploadDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Keep original extension
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
  }
});

const upload = multer({ storage: storage });

// Initialize LowDB with default data
const defaultData = { content: {}, products: [], collections: [], gallery: [], messages: [] };
const db = await JSONFilePreset(file, defaultData);

const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// --- File Upload Route ---
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the URL to access the file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("File uploaded successfully:", fileUrl);
    res.json({ url: fileUrl });
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.json({
    message: "Server is running",
    endpoints: [
      "/api/content",
      "/api/products",
      "/api/collections",
      "/api/messages"
    ]
  });
});

// --- Content Routes ---
app.get('/api/content', async (req, res) => {
  await db.read();
  res.json(db.data.content);
});

app.post('/api/content', async (req, res) => {
  await db.read();
  db.data.content = { ...db.data.content, ...req.body };
  await db.write();
  res.json(db.data.content);
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

app.post('/api/products', async (req, res) => {
  await db.read();
  const newProduct = { id: Date.now().toString(), ...req.body };
  db.data.products.push(newProduct);
  await db.write();
  res.json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  await db.read();
  const { id } = req.params;
  const index = db.data.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Update product preserving ID
  db.data.products[index] = { ...db.data.products[index], ...req.body, id };
  await db.write();
  res.json(db.data.products[index]);
});

app.delete('/api/products/:id', async (req, res) => {
  await db.read();
  const { id } = req.params;
  db.data.products = db.data.products.filter(p => p.id !== id);
  await db.write();
  res.json({ success: true });
});



// --- Collection Routes ---
app.get('/api/collections', async (req, res) => {
  await db.read();
  res.json(db.data.collections);
});

// --- Contact/Message Routes ---
app.post('/api/messages', async (req, res) => {
  await db.read();
  const newMessage = { id: Date.now().toString(), date: new Date().toISOString(), ...req.body };
  db.data.messages.push(newMessage);
  await db.write();
  res.json({ success: true });
});

app.get('/api/messages', async (req, res) => {
  await db.read();
  // In a real app, you'd check auth here
  res.json(db.data.messages);
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: `Route ${req.url} not found` });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
