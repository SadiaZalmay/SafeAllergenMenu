import React, { useState } from "react";
import "../assets/css/light-bootstrap-dashboard.css"; // Custom styles
import "../assets/css/bootstrap.min.css"; // Custom styles
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MenuAdd: React.FC = () => {
  const [menu, setMenu] = useState({
    name: "",
    ingredient: "", // Ensure this is lowercase
    allergens: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setMenu((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/menu/menuadd", menu); // Corrected URL
      navigate("/AP"); // Go to home page
    } catch (err) {
      console.error(err);
    }
  };
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
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="no-icon">Account</span>
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <a className="dropdown-item" href="ChangePassword.tsx">
                      Change Password
                    </a>
                    <div className="divider"></div>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      Log out
                    </a>
                  </div>
                </li>
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
                <a href="logout.tsx" className="btn btn-primary">
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
                    <h4 className="card-title">Add to the Menu</h4>
                  </div>
                  <form>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ingredients</label>
                        <input
                          type="text"
                          name="ingredient"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Allergen</label>
                        <input
                          type="text"
                          name="allergens"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="modal-footer float-left">
                      <a href="/AP">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Back
                        </button>
                      </a>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleClick}
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

export default MenuAdd;
