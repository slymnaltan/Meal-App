import React, { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeals, toggleFavorite } from "../redux/slice/mealSlice";
import { updateUser } from "../redux/slice/authSlice";
import { useNavigation } from "@react-navigation/native";

const FavoriteScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { meals, status, error } = useSelector((state) => state.meals);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  const favoriteMeals = meals.filter((meal) => user?.favorites?.includes(meal._id));

  const handleRemoveFavorite = async (mealId) => {
    if (token) {
      const result = await dispatch(toggleFavorite(mealId));
      if (toggleFavorite.fulfilled.match(result)) {
        dispatch(updateUser(result.payload));
      }
    } else {
      alert("Silmek için giriş yapmalısınız.");
    }
  };

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (status === "failed" || error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Yemekler alınırken bir hata oluştu: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff", marginTop: 25 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 25,
          textAlign: "center",
        }}
      >
        🌟 Favoriler ({favoriteMeals.length})
      </Text>

      {favoriteMeals.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          Favori yemekleriniz yok.
        </Text>
      ) : (
        <FlatList
          data={favoriteMeals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#f8f8f8",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Detay", { mealId: item._id })}
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    marginRight: 10,
                    backgroundColor: "#eee",
                  }}
                />
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveFavorite(item._id)}
                style={{
                  marginLeft: 10,
                  backgroundColor: "#ff4d4d",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoriteScreen;
