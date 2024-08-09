import { useState } from "react";
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
];

function App() {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const navigate = useNavigate();

  //for my own understanding, this function adding the checked allergens
  //into the list of allergens if they r checked, but if they are already checked
  //and we get another click on the checkbox then it removes that allergen from the list.
  const handleCheckboxChange = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((item) => item !== allergen)
        : [...prev, allergen]
    );
  };
  //after hitting submit, the selectedAllergens list
  //is sent to the URL of next page App2
  const handleSubmit = () => {
    navigate("/App2", { state: { selectedAllergens } });
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
              NOTE: WE DO NOT LIST DAIRY OR SHELLFISH AS AN ALLERGY SINCE WE
              DON'T UTILIZE THOSE INGREDIENTS IN OUR FOOD:
            </b>
          </Text>
        </GridItem>
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
                <Text margin={10}>
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
        <GridItem area={"footer"}>
          <Text margin={20}>
            <b>Allergen Disclaimer: </b>Our food may come into contact with
            peanuts, tree nuts, soy, gluten, and sesame seeds.
          </Text>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
