import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, SimpleGrid, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import "./App2.css";

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
    category?: string;
  }

  const [filteredMenu, setFilteredMenu] = useState<App2Allergens[]>([]);
  const [app2, setApp2] = useState<App2Item[]>([]);
  const [activeSection, setActiveSection] = useState();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
          allergens: [],
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
  }, []);

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
      const category = item.category?.toLowerCase();
      if (category) {
        if (category.includes("main")) categories.Mains.push(item);
        else if (category.includes("side")) categories.Sides.push(item);
        else if (category.includes("soup")) categories.Soups.push(item);
        else if (category.includes("snack")) categories.Snacks.push(item);
        else if (category.includes("beverage")) categories.Beverages.push(item);
        else if (category.includes("sweet")) categories.Sweets.push(item);
        else if (category.includes("sixteenmill"))
          categories.SixteenMill.push(item);
        else if (category.includes("condiment"))
          categories.Condiments.push(item);
      }
    });

    return categories;
  };

  const categorizedMenu = categorizeMenuItems(filteredMenu);

  const handleScroll = useCallback(() => {
    for (const category in sectionRefs.current) {
      const section = sectionRefs.current[category];
      if (section && section.getBoundingClientRect().top <= 100) {
        setActiveSection(category);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (section: string) => {
    const targetSection = sectionRefs.current[section];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section); // Set the active section here
      console.log(`Scrolling to: ${section}`);
    } else {
      console.error(`Section ${section} not found`);
    }
  };

  return (
    <Box className="app-container">
      <Box className="header">
        {app2.map((item) => (
          <Box key={item.id}>
            <Image src={item.logo} alt="Logo" />
            <Text>
              <b>{item.paragraph1}</b>
            </Text>
          </Box>
        ))}
      </Box>

      <Box className="sidebar">
        <SimpleGrid>
          {Object.keys(categorizedMenu).map((category) => (
            <Text
              key={category}
              className={`sidebar-item ${
                activeSection === category ? "active" : ""
              }`}
              onClick={() => scrollToSection(category)}
            >
              {category}
            </Text>
          ))}
        </SimpleGrid>
      </Box>

      <Box className="main">
        <SimpleGrid>
          {Object.keys(categorizedMenu).map((category) => (
            <Box
              key={category}
              ref={(el) => (sectionRefs.current[category] = el)}
              className="category-section"
            >
              <Text className="category-title">{category}</Text>
              {categorizedMenu[category].map((item) => (
                <Box key={item.id} className="food-item-container">
                  <Text className="food-item">{item.name}</Text>
                </Box>
              ))}
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box className="footer">
        {app2.map((item) => (
          <Text key={item.id}>
            <b>{item.paragraph2}</b>
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default App2;
