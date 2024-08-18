//==============================
//          IMPORTS
//==============================
import cors from "cors";
import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const salt = 10;

//==============================
//      INITIALIZATION
//==============================
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

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

//==============================
//          SERVER SETUP
//==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Connected to backend! On server: ${PORT}`);
});

//==============================
//         AUTHENTICATION
//==============================
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "You're not authorized to access this page." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token is invalid or expired." });
    }

    req.name = decoded.name; // Extract user name from the token
    next();
  });
};

// Protected route
app.get("/api/auth", verifyUser, (req, res) => {
  return res.json({ status: "Success!", name: req.name });
});

//==============================
//            REGISTER
//==============================
app.post("/api/register", (req, res) => {
  const sql = "INSERT INTO login (`username`, `email`, `password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });
    const values = [req.body.username, req.body.email, hash];
    connection.query(sql, [values], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error inserting data into server" });
      return res.json({ status: "Signed up successfully!" });
    });
  });
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
        .json({ error: "Server error. Please try again later." });
    }

    if (data.length === 0) {
      return res
        .status(401)
        .json({ error: "Email not found. Please check and try again." });
    }

    bcrypt.compare(
      req.body.password.toString(),
      data[0].password,
      (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Server error. Please try again later." });
        }

        if (isMatch) {
          const name = data[0].username;
          const token = jwt.sign({ name }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
          });
          res.cookie("token", token);
          return res.status(200).json({ message: "Login successful!" });
        } else {
          return res
            .status(401)
            .json({ error: "Incorrect password. Please try again." });
        }
      }
    );
  });
});

//==============================
//        ROUTES
//==============================
app.get("/api/menu/", (req, res) => {
  const query = "SELECT * FROM menu";
  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/api/menuadd", (req, res) => {
  const query =
    "INSERT INTO menu (`name`, `ingredients`, `allergens`) VALUES (?)";
  const values = [req.body.name, req.body.ingredients, req.body.allergens];

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Item has been added to the Menu.");
  });
});

app.delete("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const query = "DELETE FROM menu WHERE id = ?";

  connection.query(query, [menuId], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been deleted.");
  });
});

app.put("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const query =
    "UPDATE menu SET name = ?, ingredients = ?, allergens = ? WHERE id = ?";
  const values = [req.body.name, req.body.ingredients, req.body.allergens];

  connection.query(query, [...values, menuId], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been edited.");
  });
});

app.get("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const query = "SELECT * FROM menu WHERE id = ?";

  connection.query(query, [menuId], (err, data) => {
    if (err) return res.json(err);
    return data.length
      ? res.json(data[0])
      : res.status(404).json("Menu item not found.");
  });
});

app.get("/api/page1/", (req, res) => {
  const query = "SELECT * FROM page1";
  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/api/page1add", (req, res) => {
  const query =
    "INSERT INTO page1 (`logo`, `paragraph1`, `paragraph2`) VALUES (?)";
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2];

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Item has been added.");
  });
});

app.delete("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id;
  const query = "DELETE FROM page1 WHERE id = ?";

  connection.query(query, [page1Id], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been deleted.");
  });
});

app.put("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id;
  const query =
    "UPDATE page1 SET logo = ?, paragraph1 = ?, paragraph2 = ? WHERE id = ?";
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2];

  connection.query(query, [...values, page1Id], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been edited.");
  });
});

app.get("/api/page1/:id", (req, res) => {
  const page1Id = req.params.id;
  const query = "SELECT * FROM page1 WHERE id = ?";

  connection.query(query, [page1Id], (err, data) => {
    if (err) return res.json(err);
    return data.length
      ? res.json(data[0])
      : res.status(404).json("Page1 item not found.");
  });
});

app.get("/api/app/", (req, res) => {
  const query = "SELECT * FROM page1";
  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/api/app2/", (req, res) => {
  const query = "SELECT * FROM page2";
  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/api/appadd", (req, res) => {
  const query =
    "INSERT INTO page1 (`logo`, `paragraph1`, `paragraph2`) VALUES (?)";
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2];

  connection.query(query, [values], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Item has been added.");
  });
});

app.delete("/api/app/:id", (req, res) => {
  const page1Id = req.params.id;
  const query = "DELETE FROM page1 WHERE id = ?";

  connection.query(query, [page1Id], (err) => {
    if (err) {
      console.error("Error during DELETE operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been deleted.");
  });
});

app.put("/api/app/:id", (req, res) => {
  const page1Id = req.params.id;
  const query =
    "UPDATE page1 SET logo = ?, paragraph1 = ?, paragraph2 = ? WHERE id = ?";
  const values = [req.body.logo, req.body.paragraph1, req.body.paragraph2];

  connection.query(query, [...values, page1Id], (err) => {
    if (err) {
      console.error("Error during EDIT operation:", err);
      return res.status(500).json(err);
    }
    return res.json("Item has been edited.");
  });
});
