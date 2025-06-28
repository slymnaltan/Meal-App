const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  products: { type: [String], required: true }, 
  preparation: { type: String, required: true }, 
  category: { type: String, required: true }, 
  link: { type: String }, 
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;