import React, { useEffect } from 'react';
import '../assets/css/light-bootstrap-dashboard.css'; // Adjust the path as necessary
import '../assets/css/bootstrap.min.css'; // Custom styles

const Page2: React.FC = () => {
    useEffect(() => {
        const searchInput = document.querySelector('input[name="search1"]') as HTMLInputElement;
        const dataTable = document.querySelector('#dataTable tbody') as HTMLTableSectionElement;

        searchInput.addEventListener('input', function () {
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
        });
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
                            <a className="nav-link" href="Page1.tsx"><p>Allergen Selection Page</p></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="Menu.tsx"><p>Menu</p></a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="Page2.tsx"><p>Filtered Safe Menu Page</p></a>
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
                                        <h4 className="card-title">Menu</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-full-width">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="modal fade" id="addadminpanelfile" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                                                <div className="modal-dialog" role="document">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title" id="exampleModalLongTitle">Add</h5>
                                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <form action="hsectioncontrol.php" method="post" encType="multipart/form-data">
                                                                            <div className="modal-body">
                                                                                <div className="form-group">
                                                                                    <label>Img</label>
                                                                                    <input type="file" name="file" className="form-control" />
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Heading</label>
                                                                                    <input type="text" name="Heading" className="form-control" />
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Paragraph</label>
                                                                                    <textarea cols={10} rows={6} name="Paragraph" className="form-control" placeholder="Enter Paragraph"></textarea>
                                                                                </div>
                                                                            </div>
                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                                <input type="submit" name="submit" className="btn btn-primary" value="Save" />
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <div className="row">
                                        <div className="col-6">
                                            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search" action="" method="post">
                                                <div className="input-group">
                                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" name="search1" />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-primary" type="submit" name="search">
                                                            <i className="nc-icon nc-zoom-split"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-6">
                                            <button type="button" className="btn btn-primary float-right" data-toggle="modal" data-target="#addadminpanelfile">
                                                Add Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
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
                                        <tr>
                                            <td>Chickpea Salad</td>
                                            <td>Chickpeas, Hummus, pepper, salt, kale, mango, spinach</td>
                                            <td>Treenuts</td>
                                            <td className="td-actions text-center">
                                                <button type="button" rel="tooltip" title="Edit Data" className="btn btn-info btn-simple btn-link">
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button type="button" rel="tooltip" title="Remove" className="btn btn-danger btn-simple btn-link">
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Peanut Salad</td>
                                            <td>Soy, rice, kale, turmeric, salt, pepper, banana</td>
                                            <td>Peanut</td>
                                            <td className="td-actions text-center">
                                                <button type="button" rel="tooltip" title="Edit Data" className="btn btn-info btn-simple btn-link">
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button type="button" rel="tooltip" title="Remove" className="btn btn-danger btn-simple btn-link">
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
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

export default Page2;
