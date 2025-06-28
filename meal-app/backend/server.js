const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Meal = require("./models/mealsModel");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB'ye başarıyla bağlandı!"))
  .catch(err => console.error("MongoDB bağlantı hatası:", err));

//  Auth route
app.use("/api/auth", authRoutes);

//  Tüm yemekleri getir
app.get("/meals", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "Veri çekilirken hata oluştu" });
  }
});

//  Yeni yemek ekle
app.post("/meals", async (req, res) => {
  try {
    const newMeal = new Meal(req.body);
    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(400).json({ error: "Yemek eklenirken hata oluştu" });
  }
});

//  Kullanıcıya göre favorite ekle/kaldır
app.patch("/meals/:id", auth, async (req, res) => {
  const mealId = req.params.id;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    const index = user.favorites.indexOf(mealId);
    if (index === -1) {
      user.favorites.push(mealId); // ekle
    } else {
      user.favorites.splice(index, 1); // kaldır
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: "Favori güncellenirken hata oluştu" });
  }
});

// Server başlatma
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

