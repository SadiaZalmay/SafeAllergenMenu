import cors from 'cors'; // Allows using the server
import express from 'express'; //library: makes it easy to handle requests & responses
import mysql from 'mysql2'; //helps with connecting to database

// Create an Express application to serve data to clients
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // only this URL is allowed to go backend n fetch data
  methods: ['GET', 'POST'], // only get n post is allowed with data
  credentials: true // allowing cookies to be sent with the data from server
}));

app.use(express.json()); // For parsing application/json

// POST endpoint for filtering the menu based on allergens
app.post('/filterMenu', (req, res) => {
  console.log('Request received with allergens:', req.body.allergens);
  const { allergens } = req.body;
  const allergenKeywords = {
    Treenut: ["walnut", "almond", "cashew", "pecan", "pistachio", "macadamia", "hazelnut"],
    Soy: ["soybean", "tofu", "tempeh", "miso"],
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
  connection.query('SELECT * FROM menu', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    const filteredItems = results.filter(item => 
      !keywordsToExclude.some(keyword => 
        item.ingredients.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    res.json(filteredItems);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',    // Ensure this is correct
  user: 'root',         // Your database username
  password: '',         // Your database password
  database: 'allergen'  // Ensure this database exists
});
