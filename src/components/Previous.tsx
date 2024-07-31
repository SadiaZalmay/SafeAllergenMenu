import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  onClick: () => void;
}

const Previous = () => {
  return (
    <button className="btn btn-success" type="button">
      Previous
    </button>
  );
};

export default Previous;
