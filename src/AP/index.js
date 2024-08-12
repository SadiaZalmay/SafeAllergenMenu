import cors from "cors"; // Allows using the server
import express from "express"; // Library: makes it easy to handle requests & responses
import mysql from "mysql2"; // Helps with connecting to the database

// Create an Express application to serve data to clients
const app = express();

// MySQL connection setup
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "allergen",
  port: 3306,
});

app.use(
  cors({
    origin: "http://localhost:3000", // Only this URL is allowed to go backend n fetch data
    methods: ["GET", "POST", "DELETE", "PUT"], // Allowed methods
    credentials: true, // Allowing cookies to be sent with the data from server
  })
);

app.use(express.json());

// Getting Data from DB
app.get("/api/menu/", (req, res) => {
  const q = "SELECT * FROM menu";
  connection.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Adding Data to DB
app.post("/api/menuadd", (req, res) => {
  const q = "INSERT INTO menu (`name`, `ingredients`, `allergens`) VALUES (?)";
  const values = [req.body.name, req.body.ingredients, req.body.allergens];

  connection.query(q, [values], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Item has been added to the Menu.");
  });
});

// Deleting data from DB
app.delete("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const q = "DELETE FROM menu WHERE id = ?";

  connection.query(q, [menuId], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been deleted.");
  });
});

// Edit data from DB
app.put("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const q = "UPDATE menu SET name = ?, ingredients = ?, allergens = ? WHERE id = ?";
  
  const values = [req.body.name, req.body.ingredients, req.body.allergens];
  
  connection.query(q, [...values, menuId], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been edited.");
  });
});

// Get a single menu item by ID
app.get("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const q = "SELECT * FROM menu WHERE id = ?";

  connection.query(q, [menuId], (err, data) => {
    if (err) return res.json(err);
    return data.length ? res.json(data[0]) : res.status(404).json("Menu item not found."); // Return the first item or 404
  });
});

// POST endpoint for filtering the menu based on allergens
app.post("/filterMenu", (req, res) => {
  console.log("Request received with allergens:", req.body.allergens);
  const { allergens } = req.body;
  const allergenKeywords = {
    Treenut: ["walnut", "almond", "cashew", "pecan", "pistachio", "macadamia", "hazelnut", "almonds", "Beechnut", "Brazil nuts", "Butternut", "Cashews", "Chestnuts", "Chinquapin"],
    Soy: ["soybean", "tofu", "tempeh", "miso", "soy", "edamame", "natto", "soy albumin", "soy fiber"],
    Sesame: ["sesame", "tahini"],
    Peanut: ["peanut", "peanuts"],
    Wheat: ["wheat", "gluten"],
    Garlic: ["garlic"],
    Avocado: ["avocado"],
    Banana: ["banana", "bananas"],
    Mushrooms: ["mushroom", "mushrooms"],
  };

  const allergensSet = new Set(allergens);
  const keywordsToExclude = Object.entries(allergenKeywords)
    .filter(([key]) => allergensSet.has(key))
    .flatMap(([, keywords]) => keywords);

  // Fetch menu items from the database
  connection.query("SELECT * FROM menu", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query failed" });
    }

    const filteredItems = results.filter(
      (item) => !keywordsToExclude.some((keyword) =>
        item.ingredients.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    res.json(filteredItems);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Connected to backend! On server: ${PORT}`);
});
