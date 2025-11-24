import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function App() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState<"none" | "all" | "random">("none");
  const [randomItem, setRandomItem] = useState<any | null>(null);

  // ✅ Fetch menu from backend
  const fetchMenu = async () => {
    try {
    const response = await fetch("https://mycoffeeapi.fly.dev/menu");
 // 🟢 Android Emulator
      // If using real device: replace with your PC IP
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.log("❌ Error fetching menu:", error);
      Alert.alert("Error", "Failed to load menu from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleMenu = () => setDisplay("all");

  const handleSurprise = () => {
    const random = menu[Math.floor(Math.random() * menu.length)];
    setRandomItem(random);
    setDisplay("random");
  };

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.category}\nPrice: Rs. ${item.price}\n${
        item.inStock ? "Available ✅" : "Out of Stock ❌"
      }`
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6f4e37" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Coffee Shop</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMenu}>
          <Text style={styles.buttonText}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSurprise}>
          <Text style={styles.buttonText}>Surprise Me</Text>
        </TouchableOpacity>
      </View>

      {display === "all" && (
        <FlatList
          data={menu}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.menuList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                !item.inStock && { backgroundColor: "#f8d7da" },
              ]}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>Rs. {item.price}</Text>
              <Text
                style={[
                  styles.stockStatus,
                  { color: item.inStock ? "green" : "red" },
                ]}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {display === "random" && randomItem && (
        <View style={styles.randomBox}>
          <Text style={styles.randomTitle}>🎁 Surprise Drink!</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleItemPress(randomItem)}
          >
            <Text style={styles.itemName}>{randomItem.name}</Text>
            <Text style={styles.itemCategory}>{randomItem.category}</Text>
            <Text style={styles.itemPrice}>Rs. {randomItem.price}</Text>
            <Text
              style={[
                styles.stockStatus,
                { color: randomItem.inStock ? "green" : "red" },
              ]}
            >
              {randomItem.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 15,
  },
  button: {
    backgroundColor: "#6f4e37",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  menuList: {
    alignItems: "center",
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    width: 250,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemCategory: {
    fontSize: 16,
    color: "#555",
  },
  itemPrice: {
    fontSize: 18,
    color: "#6f4e37",
  },
  stockStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  randomBox: {
    alignItems: "center",
  },
  randomTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d2691e",
  },
});
