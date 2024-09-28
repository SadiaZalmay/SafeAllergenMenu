import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Submit from "./components/Submit";
import axios from "axios";
import purpleImage from './assets/ivory.png';

// List of allergens to display as checkboxes
const allergensList = [
  "Wheat",
  "Sesame",
  "Soy",
  "Treenut",
  "Peanut",
  "Garlic",
  "Avocado",
  "Banana",
  "Mushrooms",
  "Coconut_Oil",
  "Coconut_Sugar",
];

function App() {
  // Interface for App item
  interface AppItem {
    id: number;
    logo: string;
    paragraph1: string;
    paragraph2: string;
  }

  // State to manage selected allergens & layout
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [app, setApp] = useState<AppItem[]>([]);
  const navigate = useNavigate();

  // Fetch data from the database for the layout
  useEffect(() => {
    const fetchAllApp = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/app/");
        setApp(res.data);
      } catch (err) {
        console.error("Error during GET request:", err);
      }
    };
    fetchAllApp();
  }, []);

  // Handle checkbox change to add/remove allergens from the selected list
  const handleCheckboxChange = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((item) => item !== allergen)
        : [...prev, allergen]
    );
  };

  // Navigate to App2 with selected allergens on submit
  const handleSubmit = () => {
    navigate("/App2", { state: { selectedAllergens } });
  };

  return (
    <Grid
      templateAreas={`"header" "main" "footer"`}
      backgroundImage={`url(${purpleImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* Header */}
      {app.map((item) => (
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
            fontFamily="Roboto, sans-serif" // Change font family here
            fontSize="20px" // Optional: adjust font size
          >
            <b>{item.paragraph1}</b>
          </Text>
        </GridItem>
      ))}

      {/* Main Content */}
      <GridItem area={"main"}>
        <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
          {allergensList.map((allergen) => (
            <Box
              key={allergen}
              height="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(allergen)}
                />
                <span className="checkbox-indicator"></span>
              </label>
              <Text
                margin={10}
                fontFamily="Roboto, sans-serif" // Apply font family here
                fontSize="18px"
              >
                <b>{allergen}</b>
              </Text>
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
            <Submit onClick={handleSubmit}>Submit</Submit>
          </Stack>
        </Box>
      </GridItem>

      {/* Footer */}
      {app.map((item) => (
        <GridItem area={"footer"} key={item.id}>
          <Text
            margin={20}
            fontFamily="Roboto, sans-serif" // Apply font family here
            fontSize="20px"
          >
            <b>{item.paragraph2}</b>
          </Text>
        </GridItem>
      ))}
    </Grid>
  );
}

export default App;
