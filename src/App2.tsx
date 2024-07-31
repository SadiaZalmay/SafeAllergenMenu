import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";
import "./App.css";
import { Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Previous from "./components/Previous";

const App2 = () => {
  const location = useLocation();
  const { selectedAllergens } = location.state;
  const [filteredMenu, setFilteredMenu] = useState([]);

  useEffect(() => {
    const fetchFilteredMenu = async () => {
      try {
        const res = await axios.post("http://localhost:5000/filterMenu", {
          allergens: selectedAllergens,
        });
        setFilteredMenu(res.data);
      } catch (err) {
        console.log("Check What is wrong uff:", err);
      }
    };
    fetchFilteredMenu();
  }, [selectedAllergens]);

  // Function to capitalize each word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <Grid templateAreas={`"header" "main" "footer"`}>
        <GridItem area={"header"}>
          <Box
            marginTop={15}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image boxSize="80px" src="src/assets/BlackLogo.jpg" alt="Logo" />
          </Box>
          <Text
            margin={20}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <b>
              BASED ON YOUR ALLERGEN PREFERENCES, HERE ARE OUR PERSONALIZED
              RECOMMENDATIONS:
            </b>
          </Text>
        </GridItem>
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
                    <Text>{capitalizeWords(item.name)}</Text>
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
                <Previous></Previous>
              </Link>
            </Stack>
          </Box>
        </GridItem>
        <GridItem area={"footer"}>
          <Text margin={20}>
            <b>Allergen Disclaimer: </b>Our food may come into contact with
            peanuts, tree nuts, soy, gluten, and sesame seeds.
          </Text>
        </GridItem>
      </Grid>
    </>
  );
};

export default App2;
