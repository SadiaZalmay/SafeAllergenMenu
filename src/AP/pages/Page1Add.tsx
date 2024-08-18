import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/light-bootstrap-dashboard.css";
import "../assets/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";

const Page1Add: React.FC = () => {
  const [page1, setPage1] = useState({
    logo: "",
    paragraph1: "",
    paragraph2: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage1((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!page1.logo || !page1.paragraph1 || !page1.paragraph2) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/page1add", page1);
      navigate("/Page1"); // Go to home page
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
            <li className="nav-item active">
              <a className="nav-link" href="/Page1">
                <p>Allergen Selection Page</p>
              </a>
            </li>
            <li className="nav-item ">
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
                    <h4 className="card-title">
                      Add to the Allergen Selection page
                    </h4>
                  </div>
                  <form onSubmit={handleClick}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Logo</label>
                        <input
                          type="text"
                          name="logo"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Allergen Notice</label>
                        <input
                          type="text"
                          name="paragraph1"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Additional Allergen Disclaimer</label>
                        <input
                          type="text"
                          name="paragraph2"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="modal-footer float-left">
                      <a href="/Page1">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Back
                        </button>
                      </a>
                      <button
                        type="submit"
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

export default Page1Add;
