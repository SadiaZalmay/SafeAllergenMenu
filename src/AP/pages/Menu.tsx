import React, { useEffect, useState } from "react";
import "../assets/css/light-bootstrap-dashboard.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

interface Menu {
  id: number;
  name: string;
  ingredients: string;
  allergens: string;
}

const Menu: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<Menu[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu/", {
          withCredentials: true,
        });
        setMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to fetch menu.");
      }
    };
    fetchAllMenu();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        withCredentials: true,
      });
      const res = await axios.get("http://localhost:5000/api/menu/", {
        withCredentials: true,
      });
      setMenu(res.data);
    } catch (err) {
      console.error("Error during DELETE request:", err);
      setError("Failed to delete item.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      setError("Logout failed.");
      console.error("Logout failed:", err);
    }
  };
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div>
      <div className="wrapper">
        <div className="sidebar">
          <div className="sidebar-wrapper">
            <div className="logo">
              <a className="simple-text">Electric Beets Allergen</a>
            </div>
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link" href="/Page1">
                  <p>Allergen Selection Page</p>
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/AP">
                  <p>Menu</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Page2">
                  <p>Filtered Safe Menu Page</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-panel">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <a className="navbar-brand">Dashboard</a>
              <button
                className="navbar-toggler navbar-toggler-right"
                type="button"
                data-toggle="collapse"
                aria-controls="navigation-index"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-bar burger-lines"></span>
                <span className="navbar-toggler-bar burger-lines"></span>
                <span className="navbar-toggler-bar burger-lines"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navigation"
              >
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <a href="#" className="nav-link" data-toggle="dropdown">
                      <i className="nc-icon nc-palette"></i>
                      <span className="d-lg-none">Dashboard</span>
                    </a>
                  </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                  <Dropdown className="nav-item dropdown">
                    <Dropdown.Toggle
                      variant="text"
                      className="nav-link dropdown-toggle"
                    >
                      Account
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                      <Dropdown.Item as={Link} to="/ChangePassword">
                        Change Password
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </div>
          </nav>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div
                    style={{
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "rgb(94, 2, 49)",
                    }}
                  >
                    <div className="card-header">
                      <h4 className="card-title" style={{ margin: "20px" }}>
                        Menu
                      </h4>
                    </div>
                    <div className="container-fluid">
                      <div className="card shadow mb-4">
                        <div className="card-header py-3">
                          <div className="row">
                            <div className="col-6">
                              <div className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control bg-light border-0 small"
                                    placeholder="Search for..."
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                    name="search1"
                                  />
                                  <div className="input-group-append">
                                    <button
                                      className="btn btn-primary"
                                      type="submit"
                                      name="search"
                                    >
                                      <i className="nc-icon nc-zoom-split"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <a
                                href="/MenuAdd"
                                className="btn btn-primary float-right text-button "
                              >
                                Add Data
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          className="table table-bordered"
                          id="dataTable"
                          width="100%"
                          cellSpacing={0}
                        >
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Ingredients</th>
                              <th>Allergen</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {menu.map((item) => (
                              <tr key={item.id}>
                                <td>{capitalizeWords(item.name)}</td>
                                <td>{capitalizeWords(item.ingredients)}</td>
                                <td>{capitalizeWords(item.allergens)}</td>
                                <td className="text-center">
                                  <Link to={`/MenuEdit/${item.id}`}>
                                    <Button variant="info">Edit</Button>
                                  </Link>
                                </td>
                                <td className="text-center">
                                  <Button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    variant="danger"
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
