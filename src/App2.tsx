import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Previous from "./components/Previous";
import "./App.css";

const App2 = () => {
  // Interface for App item
  interface App2Item {
    id: number;
    logo: string;
    paragraph1: string;
    paragraph2: string;
  }

  // Interface for Allergens
  interface App2Allergens {
    name: string;
    index: number;
    length: number;
  }

  const location = useLocation(); // Get the data passed to App2
  const { selectedAllergens } = location.state; // Destructure selectedAllergens from location.state
  const [filteredMenu, setFilteredMenu] = useState<App2Allergens[]>([]);
  const [app2, setApp2] = useState<App2Item[]>([]);

  // Fetch data from the database for the layout
  useEffect(() => {
    const fetchAllApp2 = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/app2/");
        setApp2(res.data);
      } catch (err) {
        console.error("Error during GET request:", err);
      }
    };
    fetchAllApp2();
  }, []);

  // Fetch filtered menu based on selected allergens
  useEffect(() => {
    const fetchFilteredMenu = async () => {
      try {
        const response = await axios.post("http://localhost:5000/filterMenu", {
          allergens: selectedAllergens,
        });
        setFilteredMenu(response.data);
      } catch (err) {
        console.error(
          "Couldn't get the filtered menu. Problem with backend server:",
          err
        );
      }
    };
    fetchFilteredMenu();
  }, [selectedAllergens]);

  // Function to capitalize each word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Grid templateAreas={`"header" "main" "footer"`}>
      {/* Header */}
      {app2.map((item) => (
        <GridItem area={"header"} key={item.id}>
          <Box
            marginTop={15}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image boxSize="80px" src={item.logo} alt="Logo" />
          </Box>
          <Text
            margin={20}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <b>{item.paragraph1}</b>
          </Text>
        </GridItem>
      ))}

      {/* Main Content */}
      <GridItem area={"main"}>
        <SimpleGrid columns={1} spacingX="40px" spacingY="20px">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, index) => (
              <Box
                key={index}
                height={{ base: "60px", md: "80px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  m={{ base: 2, md: 4 }}
                  fontSize={{ base: "md", md: "xl" }}
                >
                  {capitalizeWords(item.name)}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No items available for your selection.</Text>
          )}
        </SimpleGrid>

        <Box
          height="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Stack direction="row" align="center">
            <Link to="/">
              <Previous />
            </Link>
          </Stack>
        </Box>
      </GridItem>

      {/* Footer */}
      {app2.map((item) => (
        <GridItem area={"footer"} key={item.id}>
          <Text margin={20}>
            <b>{item.paragraph2}</b>
          </Text>
        </GridItem>
      ))}
    </Grid>
  );
};

export default App2;
