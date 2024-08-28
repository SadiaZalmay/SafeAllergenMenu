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
//      CONNECTION
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

  const jwtSecret = process.env.JWT_SECRET;

  jwt.verify(token, jwtSecret, (err, user) => {
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
app.post("/api/login", (req, res) => {
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
          const jwtSecret = process.env.JWT_SECRET;
          jwt.sign({ name }, jwtSecret, { expiresIn: "1h" }, (err, token) => {
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
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;

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
    const jwtSecret = process.env.JWT_SECRET;
    const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: "10m" });

    // TODO: Send reset token to email (use a mailing service like Nodemailer)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  });
});
//==============================
//       FORGOT PASSWORD
//==============================
app.post("/api/forgotpassword", (req, res) => {
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
    const jwtSecret = process.env.JWT_SECRET;
    const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: "30m" });

    // Create the reset link
    const resetLink = `http://localhost:3000/ResetPassword/${resetToken}`;

    // Email sending logic
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ error: "Failed to send email. Please try again later." });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email." });
      }
    });
  });
});
//==============================
//       RESET PASSWORD
//==============================
app.post("/api/reset-password", (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Verify the token
  const jwtSecret = process.env.JWT_SECRET;
  jwt.verify(resetToken, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash the new password
    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password." });
      }

      // Update the user's password in the database
      const sql = "UPDATE login SET password = ? WHERE email = ?";
      connection.query(sql, [hashedPassword, decoded.email], (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to reset password." });
        }
        return res.status(200).json({ message: "Password reset successful." });
      });
    });
  });
});
//Confirmation email sending after reseting password
const confirmationMailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Password Reset Confirmation",
  text: "Your password has been successfully reset.",
};

transporter.sendMail(confirmationMailOptions, (err, info) => {
  if (err) {
    console.error("Error sending confirmation email:", err);
  } else {
    console.log("Confirmation email sent:", info.response);
  }
});


//==============================
//       CHANGE PASSWORD
//==============================

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
