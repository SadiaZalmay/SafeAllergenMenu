import React, { useEffect, useState } from "react";
import "../assets/css/light-bootstrap-dashboard.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";

//adding to the DB
const Page1: React.FC = () => {
  interface Page1Item {
    id: number;
    logo: string;
    paragraph1: string;
    paragraph2: string;
  }

  const [page1, setPage1] = useState<Page1Item[]>([]);
  
  useEffect(() => {
    const fetchAllPage1 = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/page1/");
        setPage1(res.data);
      } catch (err) {
        console.error("Error during POST request:", err);
      }
    };
    fetchAllPage1();
  }, []);

  //deleting from the DB
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/page1/${id}`);
      // Fetch the updated page1 list after deletion
      const res = await axios.get("http://localhost:5000/api/page1/");
      setPage1(res.data); // Update the page1 state with the new data
    } catch (err) {
      console.error("Error during DELETE request:", err);
    }
  };

  // Function to capitalize each word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="wrapper">
      <div
        className="sidebar"
        // style={{
        //   backgroundImage: `url(${backgroundImage})`,
        //   backgroundSize: 'cover', // Optional: Adjusts how the background image is displayed
        //   backgroundPosition: 'center', // Optional: Centers the background image
        // }}
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
              <ul className="navbar-nav mr-auto">
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
                    <a className="dropdown-item" href="/ChangePassword">
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
                    <h4 className="card-title">Allergen Selection Page</h4>
                  </div>
                </div>
              </div>
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
                        href="/Page1Add"
                        className="btn btn-primary float-right"
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
                      <th>Logo</th>
                      <th>Allergen Notice</th>
                      <th>Additional Allergen Disclaimer</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page1.map((item) => (
                      <tr key={item.id}>
                        <td>{capitalizeWords(item.logo)}</td>
                        <td>{capitalizeWords(item.paragraph1)}</td>
                        <td>{capitalizeWords(item.paragraph2)}</td>
                        <td className="text-center">
                          <Link to={`/Page1Edit/${item.id}`}>
                            <Button variant="info" title="Edit Data">
                              <i className="fa fa-edit"></i> Edit
                            </Button>
                          </Link>
                        </td>
                        <td className="text-center">
                          <a href="">
                            <Button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              variant="danger"
                              title="Remove"
                            >
                              Delete
                            </Button>
                          </a>
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
  );
};

export default Page1;
