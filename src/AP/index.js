//==============================
//          IMPORTS
//==============================
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";

dotenv.config();

const saltRounds = 10;

//==============================
//      INITIALIZATION
//==============================
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

//==============================
//          CONNECTION
//==============================
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "allergen",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database");
});

//==============================
//          SERVER SETUP
//==============================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//==============================
//          AUTHENTICATION
//==============================
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

app.get("/api/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

//==============================
//            REGISTER
//==============================
app.post("/api/register/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(
      req.body.password.toString(),
      saltRounds
    );
    const sql = "INSERT INTO login (username, email, password) VALUES (?)";
    const values = [req.body.username, req.body.email, hashedPassword];

    connection.query(sql, [values], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error inserting data into server" });
      }
      return res.status(201).json({ status: "Signed up successfully!" });
    });
  } catch (err) {
    return res.status(500).json({ error: "Error hashing password" });
  }
});

//==============================
//            LOGIN
//==============================
app.post("/api/login/", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ?";
  connection.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ Error: "Server error. Please try again later." });
    }

    if (data.length === 0) {
      return res
        .status(401)
        .json({ Error: "Incorrect email. Please check and try again." });
    }

    bcrypt.compare(
      req.body.password.toString(),
      data[0].password,
      (err, isMatch) => {
        if (err) {
          return res.status(500).json({ Error: "Password comparison error." });
        }

        if (isMatch) {
          const name = data[0].email;
          if (!"secret") {
            return res.status(500).json({ Error: "JWT secret is not set." });
          }
          jwt.sign({ name }, "secret", { expiresIn: "1h" }, (err, token) => {
            if (err) {
              return res
                .status(500)
                .json({ Error: "Error signing the token." });
            }
            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
            });

            return res.status(200).json({ message: "Login successful!" });
          });
        } else {
          return res
            .status(401)
            .json({ Error: "Incorrect password. Please try again." });
        }
      }
    );
  });
});

//==============================
//       FORGOT PASSWORD
//==============================
app.post("/api/forgotpassword/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  // Check if the user exists
  const sql = "SELECT * FROM login WHERE email = ?";
  connection.query(sql, [email], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Server error. Please try again later." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });

    // Create the reset link
    const resetLink = `http://localhost:3000/ResetPassword?token=${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mangalnadima@gmail.com",
        pass: "vyyu mtho zuvm kuwc",
      },
    });
    console.log("Reset Link:", resetLink);

    var mailOptions = {
      from: "mangalnadima@gmail.com",
      to: email,
      subject: "Forgot Password",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send the email." });
      } else {
        return res
          .status(200)
          .json({ message: "Successfully sent the email!" });
      }
    });
  });
});
//==============================
//       TOKEN VALIDATION
//==============================
app.post("/api/token", async (req, res) => {
  const { token } = req.body;
  console.log("Received token for validation:", token);

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    return res
      .status(200)
      .json({ message: "Token is valid.", email: decoded.email });
  });
});

//==============================
//       RESET PASSWORD
//==============================
app.post("/api/resetpassword", async (req, res) => {
  const { token, newPassword } = req.body;

  // Verify the token
  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid token." });
    }

    const email = decoded.email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = "UPDATE login SET password = ? WHERE email = ?";
    connection.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to reset password." });
      }

      return res.status(200).json({ message: "Password successfully reset!" });
    });
  });
});
app.post("/api/changepassword", authenticateToken, async (req, res) => {
  const { password, newPassword } = req.body;
  const email = req.user.name; // Extract email from token

  // Fetch the current password hash from the database
  const sql = "SELECT password FROM login WHERE email = ?";
  connection.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Server error. Please try again later." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the provided current password with the stored password hash
    const isMatch = await bcrypt.compare(password, data[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    // Check if the new password is the same as the current password
    if (newPassword === password) {
      return res.status(400).json({
        error: "New password cannot be the same as the current password.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateSql = "UPDATE login SET password = ? WHERE email = ?";
    connection.query(updateSql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res
          .status(500)
          .json({ error: "Failed to change the password." });
      }
      return res
        .status(200)
        .json({ message: "Password successfully changed!" });
    });
  });
});

//==============================
//            LOGOUT
//==============================
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully!" });
});

//---------------------------------
//       GET MENU DATA
//---------------------------------
app.get("/api/menu/", (req, res) => {
  const query = "SELECT * FROM menu";
  connection.query(query, (err, data) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    return res.json(data);
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
    return res.json(data); // Send data as JSON response
  });
});

//---------------------------------
//       GET APP2 DATA
//---------------------------------
app.get("/api/app2/", (req, res) => {
  const query = "SELECT * FROM page2"; // SQL query to fetch all page2 items
  connection.query(query, (err, data) => {
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
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
    if (err) return res.status(500).json({ error: "Database query failed" }); // Handle error
    return data.length
      ? res.json(data[0]) // Return the first item if found
      : res.status(404).json("Page2 item not found."); // 404 response if not found
  });
});
