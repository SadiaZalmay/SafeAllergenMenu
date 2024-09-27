import React, { useEffect, useRef, useState } from "react";
import "../assets/css/light-bootstrap-dashboard.css"; // Custom styles
import "../assets/css/bootstrap.min.css"; // Custom styles
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const MenuEdit: React.FC = () => {
  const [menu, setMenu] = useState({
    name: "",
    ingredients: "",
    category: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenu({ ...menu, [name]: value });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const menuId = location.pathname.split("/")[2]; // Store the ID properly

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Menu ID:", menuId);
    console.log("Menu Data:", menu);
    try {
      await axios.put(`http://localhost:5000/api/menu/${menuId}`, menu);
      navigate("/AP"); // Go to home page
    } catch (err) {
      console.error("Error during PUT request:", err);
    }
  };
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/menu/${menuId}`
        );
        setMenu({
          name: response.data.name,
          ingredients: response.data.ingredients,
          category: response.data.category,
        });
      } catch (err) {
        console.error("Error fetching menu data:", err);
      }
    };

    fetchMenu();
  }, [menuId]);

  return (
    <div className="wrapper">
      <div
        className="sidebar"
        style={{
          backgroundImage: `url('../assets/img/8a3af60e-5fb9-4a9e-817f-a5af303ba85d.avif')`,
        }}
      >
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
              <ul className="nav navbar-nav mr-auto">
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
                    <Dropdown.Item as={Link} to="/Login">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ul>
            </div>
          </div>
        </nav>

        {/* Logout Modal */}
        <div
          className="modal fade"
          id="logoutModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="logoutModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="logoutModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <a href="/Logout" className="btn btn-primary">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header">
                    <h4 className="card-title">Edit Menu</h4>
                  </div>
                  <form action="" method="post" encType="multipart/form-data">
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={menu.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ingredients</label>
                        <input
                          type="text"
                          name="ingredients"
                          className="form-control"
                          value={menu.ingredients}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>category</label>
                        <input
                          type="text"
                          name="category"
                          className="form-control"
                          value={menu.category}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="modal-footer float-left">
                      <Link to="/AP">
                        <button type="button" className="btn btn-secondary">
                          Back
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={handleClick}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEdit;
