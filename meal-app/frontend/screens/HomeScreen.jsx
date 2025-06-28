import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeals, toggleFavorite } from "../redux/slice/mealSlice";
import { updateUser } from "../redux/slice/authSlice";
import { useNavigation } from "@react-navigation/native";

const categories = ["Tümü", "Çorba", "Ana Yemek", "Tatlı", "Salata","İçecek"];
const sliderImages = [
  'https://img.freepik.com/free-photo/close-up-appetizing-ramadan-meal_23-2151182441.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-photo/tea-set-with-baklava-jams-dried-fruits_140725-8096.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-photo/ramadan-celebration-digital-art_23-2151358097.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-photo/pakhlava-tea-marble_114579-20720.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-photo/close-up-saffron-infusion_23-2149278519.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-photo/collection-lamps-store-with-dark-background_188544-11867.jpg?ga=GA1.1.954346917.1745335793&semt=ais_hybrid&w=740',
  'https://images.unsplash.com/photo-1712488067097-648020b79dd4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D'
];

const windowWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { meals, status } = useSelector((state) => state.meals);
  const { user, token } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  const handleFavoriteToggle = async (mealId) => {
    if (token) {
      const resultAction = await dispatch(toggleFavorite(mealId));
      if (toggleFavorite.fulfilled.match(resultAction)) {
        dispatch(updateUser(resultAction.payload));
      }
    } else {
      alert("Favorilere eklemek için giriş yapmalısınız.");
    }
  };

  const filteredMeals = meals.filter(
    (meal) =>
      (selectedCategory === "Tümü" || meal.category === selectedCategory) &&
      meal.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderMealCard = ({ item }) => {
    const isFavorite = user?.favorites?.includes(item._id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Detay", { mealId: item._id })}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardOverlay}>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleFavoriteToggle(item._id)}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Sabit Üst Bölüm */}
      <View style={styles.fixedHeader}>
        <Text style={styles.header}>🍽 Palace Kitchen</Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Yemek Ara..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Slider - Sabit Yükseklik */}
        <View style={styles.sliderContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.sliderContent}
          >
            {sliderImages.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.sliderImage} />
            ))}
          </ScrollView>
        </View>

        {/* Kategoriler - Sabit Yükseklik */}
        <View style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Scroll Edilebilir Yemek Listesi */}
      <View style={styles.mealsListContainer}>
        {status === "loading" ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMeals}
            keyExtractor={(item) => item._id}
            renderItem={renderMealCard}
            numColumns={2}
            columnWrapperStyle={styles.cardRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mealsContainer}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  fixedHeader: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: "#069C54",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  // Slider için sabit yükseklik
  sliderContainer: {
    height: 180,
    marginBottom: 20,
  },
  sliderContent: {
    paddingRight: 16,
  },
  sliderImage: {
    width: windowWidth - 50,
    height: 180,
    borderRadius: 16,
    marginRight: 15,
  },
  // Kategori için sabit yükseklik
  categoryContainer: {
    height: 40,
    marginBottom: 10,
  },
  categoryContent: {
    paddingRight: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#F8E9D6",
    color:"#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  categoryButtonActive: {
    backgroundColor: "#069C54",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  // Yemek listesi için ayrı bir container
  mealsListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  mealsContainer: {
    paddingBottom: 20,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: (windowWidth - 40) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  cardFooter: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  }
});

export default HomeScreen;