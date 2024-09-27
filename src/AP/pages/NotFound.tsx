import {
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";

function NotFound() {
  return (
    <Grid templateAreas={`"header" "main" "footer"`} minHeight="100vh" bgColor="#f8f8f8">
      {/* Header */}
      <GridItem area={"header"}>
        <Box display="flex" alignItems="center" justifyContent="center" marginTop={15}>
          <Text fontSize="3xl" color="#800020">
            <b>Oops! Page Not Found</b>
          </Text>
        </Box>
      </GridItem>

      {/* Main Content */}
      <GridItem area={"main"}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={10}
          bgColor="#ffffff" // White background for contrast
          borderRadius="md"
          marginX="20px"
          marginTop="10px"
          boxShadow="lg" // Optional: Add shadow for depth
        >
          <Text fontSize="10xl" marginBottom={4}> {/* Make the emoji bigger */}
            😄 {/* Smiling Emoji */}
          </Text>
          <Text fontSize="2xl" color="#800020" textAlign="center">
            <b>404 Not Found</b>
          </Text>
        </Box>
      </GridItem>

      {/* Footer */}
      <GridItem area={"footer"}>
        <Box
          marginTop={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="15px"
        >
          <Text color="#800020">
            <b>Go back to <a href="/" style={{ color: "#800020" }}>Home</a></b>
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default NotFound;
