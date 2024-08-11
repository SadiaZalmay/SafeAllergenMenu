import React, { useEffect, useRef } from 'react';
import '../assets/css/light-bootstrap-dashboard.css'; // Custom styles
import '../assets/css/bootstrap.min.css'; // Custom styles

const MenuEdit: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dataTableRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        const searchInput = searchInputRef.current;
        const dataTable = dataTableRef.current;

        if (searchInput && dataTable) {
            const handleSearchInput = () => {
                const searchValue = searchInput.value.toLowerCase();
                const rows = dataTable.querySelectorAll('tr');

                rows.forEach(row => {
                    const cells = row.getElementsByTagName('td');
                    let match = false;

                    for (let cell of cells) {
                        if (cell.textContent?.toLowerCase().includes(searchValue)) {
                            match = true;
                            break;
                        }
                    }

                    row.style.display = match ? '' : 'none'; // Show or hide the row
                });
            };

            searchInput.addEventListener('input', handleSearchInput);

            // Cleanup the event listener on component unmount
            return () => {
                searchInput.removeEventListener('input', handleSearchInput);
            };
        }
    }, []);

    return (
        <div className="wrapper">
            <div className="sidebar" style={{ backgroundImage: `url('../assets/img/8a3af60e-5fb9-4a9e-817f-a5af303ba85d.avif')` }}>
                <div className="sidebar-wrapper">
                    <div className="logo">
                        <a className="simple-text">Electric Beets Allergen</a>
                    </div>
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" href="Page1.tsx">
                                <p>Allergen Selection Page</p>
                            </a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="Menu.tsx">
                                <p>Menu</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="Page2.tsx">
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
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-bar burger-lines"></span>
                            <span className="navbar-toggler-bar burger-lines"></span>
                            <span className="navbar-toggler-bar burger-lines"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navigation">
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
                                    <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="no-icon">Account</span>
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <a className="dropdown-item" href="ChangePassword.tsx">Change Password</a>
                                        <div className="divider"></div>
                                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Log out</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Logout Modal */}
                <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog" aria-labelledby="logoutModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="logoutModalLabel">Ready to Leave?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Select "Logout" below if you are ready to end your current session.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <a href="logout.tsx" className="btn btn-primary">Logout</a>
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
                                                <input type="text" name="Name" className="form-control" />
                                            </div>
                                            <div className="form-group">
                                                <label>Ingredients</label>
                                                <input type="text" name="Ingredients" className="form-control" />
                                            </div>
                                            <div className="form-group">
                                                <label>Allergen</label>
                                                <input type="text" name="Allergen" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="modal-footer float-left">
                                            <a href="Menu.tsx">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Back</button>
                                            </a>
                                            <a href="Menu.tsx">
                                                <button type="button" className="btn btn-primary" data-dismiss="modal">Save</button>
                                            </a>
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
