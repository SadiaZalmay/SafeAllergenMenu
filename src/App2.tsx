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
  interface App2Item {
    id: number;
    logo: string;
    paragraph1: string;
    paragraph2: string;
  }

  interface App2Allergens {
    id: number;
    name: string;
    category?: string; // Make allergen optional to prevent TypeErrors
  }

  const location = useLocation();
  const { selectedAllergens } = location.state || { selectedAllergens: [] }; // Default to empty array if undefined
  const [filteredMenu, setFilteredMenu] = useState<App2Allergens[]>([]);
  const [app2, setApp2] = useState<App2Item[]>([]);

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

  const categorizeMenuItems = (items: App2Allergens[]) => {
    const categories = {
      Sides: [],
      Snacks: [],
      Soups: [],
      Mains: [],
      Sweets: [],
      Condiments: [],
      SixteenMill: [],
      Beverages: [],
    };

    items.forEach((item) => {
      // Check if category exists and is a string
      const category = item.category?.toLowerCase();
      if (category) {
        if (category.includes("main" || "mains")) {
          categories.Mains.push(item);
        } else if (category.includes("side" || "sides")) {
          categories.Sides.push(item);
        } else if (category.includes("soup" || "soups")) {
          categories.Soups.push(item);
        }else if (category.includes("snack" || "snacks")) {
          categories.Snacks.push(item);
        }else if (category.includes("beverage" || "beverages" || "drinks" || "drink")) {
          categories.Beverages.push(item);
        }else if (category.includes("sweet" || "sweets")) {
          categories.Sweets.push(item);
        }else if (category.includes("sixteenmill" || "16mill" || "sixteen mill")) {
          categories.SixteenMill.push(item);
        }else if (category.includes("condiment")) {
          categories.Condiments.push(item);
        }
      }
    });

    return categories;
  };

  const categorizedMenu = categorizeMenuItems(filteredMenu);

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
          {Object.keys(categorizedMenu).map((category) => (
            <Box key={category}>
              <Text
                m={{ base: 4, md: 6 }}
                fontSize={{ base: "lg", md: "2xl" }}
                fontWeight="bold"
              >
                {category}
              </Text>
              {categorizedMenu[category].map((item) => (
                <Box
                  key={item.id}
                  height={{ base: "60px", md: "80px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    m={{ base: 2, md: 4 }}
                    fontSize={{ base: "md", md: "xl" }}
                  >
                    {item.name}
                  </Text>
                </Box>
              ))}
            </Box>
          ))}
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
