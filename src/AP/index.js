//==============================
//          IMPORTS
//==============================
import cors from "cors"; // Allows using the server
import express from "express"; // Library: makes it easy to handle requests & responses
import mysql from "mysql2"; // Helps with connecting to the database

//==============================
//      INITIALIZATION
//==============================
const app = express(); // Create an Express application

// MySQL connection setup
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "allergen",
  port: 3306,
});

//==============================
//         MIDDLEWARE
//==============================
app.use(
  cors({
    origin: "http://localhost:3000", // Only this URL is allowed to access the backend
    methods: ["GET", "POST", "DELETE", "PUT"], // Allowed HTTP methods
    credentials: true, // Allowing cookies to be sent with the data from the server
  })
);

app.use(express.json()); // Parse JSON bodies

//==============================
//        ROUTES
//==============================

//---------------------------------
//       GET MENU DATA
//---------------------------------
app.get("/api/menu/", (req, res) => {
  const query = "SELECT * FROM menu"; // SQL query to fetch all menu items
  connection.query(query, (err, data) => {
    if (err) return res.json(err); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

//---------------------------------
//       ADD MENU ITEM
//---------------------------------
app.post("/api/menuadd", (req, res) => {
  const query =
    "INSERT INTO menu (`name`, `ingredients`, `allergens`) VALUES (?)"; // SQL query to insert a new menu item
  const values = [req.body.name, req.body.ingredients, req.body.allergens]; // Values from request body

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err); // Handle error
    return res.json("Item has been added to the Menu."); // Success response
  });
});

//---------------------------------
//       DELETE MENU ITEM
//---------------------------------
app.delete("/api/menu/:id", (req, res) => {
  const menuId = req.params.id; // Get the menu ID from URL parameters
  const query = "DELETE FROM menu WHERE id = ?"; // SQL query to delete a menu item

  connection.query(query, [menuId], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been deleted."); // Success response
  });
});

//---------------------------------
//       EDIT MENU ITEM
//---------------------------------
app.put("/api/menu/:id", (req, res) => {
  const menuId = req.params.id; // Get the menu ID from URL parameters
  const query =
    "UPDATE menu SET name = ?, ingredients = ?, allergens = ? WHERE id = ?"; // SQL query to update a menu item
  const values = [req.body.name, req.body.ingredients, req.body.allergens]; // New values from request body

  connection.query(query, [...values, menuId], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been edited."); // Success response
  });
});

//---------------------------------
//       GET SINGLE MENU ITEM
//---------------------------------
app.get("/api/menu/:id", (req, res) => {
  const menuId = req.params.id; // Get the menu ID from URL parameters
  const query = "SELECT * FROM menu WHERE id = ?"; // SQL query to fetch a menu item by ID

  connection.query(query, [menuId], (err, data) => {
    if (err) return res.json(err); // Handle error
    return data.length
      ? res.json(data[0]) // Return the first item if found
      : res.status(404).json("Menu item not found."); // 404 response if not found
  });
});

//---------------------------------
//       PAGE 1 ROUTES
//---------------------------------

// Getting Data from DB for Page 1
app.get("/api/page1/", (req, res) => {
  const query = "SELECT * FROM page1"; // SQL query to fetch all page1 items
  connection.query(query, (err, data) => {
    if (err) return res.json(err); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

// Adding Data to DB for Page 1
app.post("/api/page1add", (req, res) => {
  const query =
    "INSERT INTO page1 (`logo`, `paragraph1`, `paragraph2`) VALUES (?)"; // SQL query to insert a new page1 item
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2]; // Values from request body

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err); // Handle error
    return res.json("Item has been added."); // Success response
  });
});

// Deleting data from Page 1
app.delete("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id; // Get the page1 ID from URL parameters
  const query = "DELETE FROM page1 WHERE id = ?"; // SQL query to delete a page1 item

  connection.query(query, [page1Id], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been deleted."); // Success response
  });
});

// Edit data from Page 1
app.put("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id; // Get the page1 ID from URL parameters
  const query =
    "UPDATE page1 SET logo = ?, paragraph1 = ?, paragraph2 = ? WHERE id = ?"; // SQL query to update a page1 item
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2]; // New values from request body

  connection.query(query, [...values, page1Id], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been edited."); // Success response
  });
});

// Get a single page1 item by ID
app.get("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id; // Get the page1 ID from URL parameters
  const query = "SELECT * FROM page1 WHERE id = ?"; // SQL query to fetch a page1 item by ID

  connection.query(query, [page1Id], (err, data) => {
    if (err) return res.json(err); // Handle error
    return data.length
      ? res.json(data[0]) // Return the first item if found
      : res.status(404).json("Page1 item not found."); // 404 response if not found
  });
});

//---------------------------------
//       GET APP DATA
//---------------------------------
app.get("/api/app/", (req, res) => {
  const query = "SELECT * FROM page1"; // SQL query to fetch all page1 items
  connection.query(query, (err, data) => {
    if (err) return res.json(err); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

//---------------------------------
//       GET APP2 DATA
//---------------------------------
app.get("/api/app2/", (req, res) => {
  const query = "SELECT * FROM page2"; // SQL query to fetch all page2 items
  connection.query(query, (err, data) => {
    if (err) return res.json(err); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

//---------------------------------------
//       FILTER MENU BASED ON ALLERGENS
//---------------------------------------
app.post("/filterMenu", (req, res) => {
  console.log("Request received with allergens:", req.body.allergens); // Log received allergens
  const { allergens } = req.body; // Destructure allergens from request body

  // Define allergen keywords
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
    Soy: ["soybean", "tofu", "tempeh", "miso"],
    Sesame: ["sesame", "tahini"],
    Peanut: ["peanut"],
    Wheat: ["wheat", "gluten"],
    Garlic: ["garlic"],
    Avocado: ["avocado"],
    Banana: ["banana"],
    Mushrooms: ["mushroom"],
  };

  const allergensSet = new Set(allergens); // Convert allergens to a Set for easier lookup
  const keywordsToExclude = Object.entries(allergenKeywords)
    .filter(([key]) => allergensSet.has(key)) // Get keywords for allergens that are set
    .flatMap(([, keywords]) => keywords); // Flatten the array of keywords

  // Fetch menu items from the database
  connection.query("SELECT * FROM menu", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query failed" }); // Handle error
    }

    const filteredItems = results.filter(
      (item) =>
        !keywordsToExclude.some((keyword) =>
          item.ingredients.toLowerCase().includes(keyword.toLowerCase())
        )
    ); // Filter out items containing allergens

    res.json(filteredItems); // Send filtered items as JSON response
  });
});

//==============================
//          PAGE TWO ROUTES
//==============================

//---------------------------------
//       GET PAGE 2 DATA
//---------------------------------
app.get("/api/page2/", (req, res) => {
  const query = "SELECT * FROM page2"; // SQL query to fetch all page2 items
  connection.query(query, (err, data) => {
    if (err) return res.json(err); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

//---------------------------------
//       ADD PAGE 2 ITEM
//---------------------------------
app.post("/api/page2add", (req, res) => {
  const query =
    "INSERT INTO page2 (`logo`, `paragraph1`, `paragraph2`) VALUES (?)"; // SQL query to insert a new page2 item
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2]; // Values from request body

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err); // Handle error
    return res.json("Item has been added."); // Success response
  });
});

//---------------------------------
//       DELETE PAGE 2 ITEM
//---------------------------------
app.delete("/api/page2/:id", (req, res) => {
  const page2Id = req.params.id; // Get the page2 ID from URL parameters
  const query = "DELETE FROM page2 WHERE id = ?"; // SQL query to delete a page2 item

  connection.query(query, [page2Id], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been deleted."); // Success response
  });
});

//---------------------------------
//       EDIT PAGE 2 ITEM
//---------------------------------
app.put("/api/page2/:id", (req, res) => {
  const page2Id = req.params.id; // Get the page2 ID from URL parameters
  const query =
    "UPDATE page2 SET logo = ?, paragraph1 = ?, paragraph2 = ? WHERE id = ?"; // SQL query to update a page2 item
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2]; // New values from request body

  connection.query(query, [...values, page2Id], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err); // Log error
      return res.status(500).json(err); // Handle error
    }
    return res.json("Item has been edited."); // Success response
  });
});

//---------------------------------
//       GET SINGLE PAGE 2 ITEM
//---------------------------------
app.get("/api/page2/:id", (req, res) => {
  const page2Id = req.params.id; // Get the page2 ID from URL parameters
  const query = "SELECT * FROM page2 WHERE id = ?"; // SQL query to fetch a page2 item by ID

  connection.query(query, [page2Id], (err, data) => {
    if (err) return res.json(err); // Handle error
    return data.length
      ? res.json(data[0]) // Return the first item if found
      : res.status(404).json("Page2 item not found."); // 404 response if not found
  });
});

//==============================
//          SERVER SETUP
//==============================
const PORT = process.env.PORT || 5000; // Define the port
app.listen(PORT, () => {
  console.log(`Connected to backend! On server: ${PORT}`); // Log server start
});
