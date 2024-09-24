import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";


function NotFound() {

  return (      
        <Grid templateAreas={`"header" "main" "footer"`} >
          <GridItem area={"header"}>
            <Box
              marginTop={15}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
            </Box>
            <Text
              margin={20}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <b>404 Not Found</b>
            </Text>
          </GridItem>

          <GridItem area={"main"}>
            <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
                <Box
                  height="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text margin={10}>
                    <b>I couldn't find your page!</b>
                  </Text>
                </Box>
            </SimpleGrid>
            <Box
              height="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
            </Box>
          </GridItem>
        </Grid>
      
  );
}

export default NotFound;
