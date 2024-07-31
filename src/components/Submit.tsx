import React from "react";
import { Button } from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.min.css";

interface SubmitProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Submit: React.FC<SubmitProps> = ({ onClick, children }) => {
  return (
    <Button
      className="btn btn-success"
      type="button"
      onClick={onClick}
      colorScheme="teal"
    >
      {children}
    </Button>
  );
};

export default Submit;
