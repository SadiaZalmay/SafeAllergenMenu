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

//Showing the data on Admin Panel - Menu page
app.use(
  cors({
    origin: "http://localhost:3000", // Only this URL is allowed to go backend n fetch data
    methods: ["GET", "POST"], // Only GET and POST are allowed with data
    credentials: true, // Allowing cookies to be sent with the data from server
  })
);

app.use(express.json()); // For parsing application/json

//Getting Data from DB
app.get("/api/menu", (req, res) => {
  const q = "SELECT * FROM menu";
  connection.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Adding Data to DB
app.post("/api/menu/menuadd", (req, res) => {
  const q = "INSERT INTO menu (`name`, `ingredient`, `allergens`) VALUES (?)";
  const values = [req.body.name, req.body.ingredient, req.body.allergens];
  
  connection.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Item has been added to the Menu.");
  });
});

// POST endpoint for filtering the menu based on allergens
app.post("/filterMenu", (req, res) => {
  console.log("Request received with allergens:", req.body.allergens);
  const { allergens } = req.body;
  const allergenKeywords = {
    Treenut: [
      "walnut",
      "almond",
      "cashew",
      "pecan",
      "pistachio",
      "macadamia",
      "hazelnut",
    ],
    Soy: ["soybean", "tofu", "tempeh", "miso", "soy"],
    Sesame: ["sesame", "tahini"],
    Peanut: ["peanut"],
    Wheat: ["wheat", "flour", "gluten"],
    Garlic: ["garlic"],
    Avocado: ["avocado"],
    Banana: ["banana"],
    Mushrooms: ["mushroom"],
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
      (item) =>
        !keywordsToExclude.some((keyword) =>
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
