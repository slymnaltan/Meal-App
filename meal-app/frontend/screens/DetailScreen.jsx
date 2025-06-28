import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,Linking  } from "react-native";
import { useRoute,useNavigation  } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../redux/slice/mealSlice";
import { updateUser } from "../redux/slice/authSlice";

const MealDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mealId } = route.params;
  const { user, token } = useSelector((state) => state.auth);

  // Meal verisini Redux store'dan alıyoruz
  const meal = useSelector((state) =>
    state.meals.meals.find((m) => m._id === mealId)
  );

  // Eğer yemek bulunamazsa hata mesajı veriyoruz
  if (!meal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Yemek bulunamadı!</Text>
      </View>
    );
  }

  const handleFavoriteClick = async () => {
    if (token) {
      const resultAction = await dispatch(toggleFavorite(meal._id));
      if (toggleFavorite.fulfilled.match(resultAction)) {
        dispatch(updateUser(resultAction.payload)); // Güncel user'ı kaydet
      }
    } else {
      alert("Favorilere eklemek için giriş yapmalısınız.");
    }
  };

  const isFavorite = user?.favorites?.includes(meal._id);


  // Örnek malzeme renderlaması için dummy veri
  const renderIngredientItem = ({ item }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientIconContainer}>
        <Text style={styles.ingredientIcon}>🍳</Text>
      </View>
      <Text style={styles.ingredientText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Başlık ve Favori Butonu */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoriteClick}
          >
            <Text style={styles.favoriteButtonText}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        {/* Yemek Resmi */}
        <Image
          source={{ uri: meal.image }}
          style={styles.mealImage}
        />

        {/* Yemek Adı ve Yazar */}
        <View style={styles.titleContainer}>
          <Text style={styles.mealTitle}>{meal.name}</Text>
        </View>

        {/* Oynatma Butonu */}
        <TouchableOpacity style={styles.playButton} onPress={() => Linking.openURL(meal.link)}>
          <Text style={styles.playButtonIcon}>▶</Text>
        </TouchableOpacity>

        {/* Açıklama Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{meal.preparation}</Text>
        </View>

        {/* Malzemeler Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <FlatList
            data={meal.products}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderIngredientItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  header: {
    marginTop:15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8E9D6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  mealImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  titleContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
  },
  detailSeparator: {
    height: 24,
    width: 1,
    backgroundColor: "#E0E0E0",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#069C54",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 16,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  playButtonIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    marginLeft: 4,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  ingredientIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ingredientIcon: {
    fontSize: 20,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default MealDetailScreen;