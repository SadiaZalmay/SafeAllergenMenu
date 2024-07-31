import axios from "axios";
import React, { useEffect, useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  ingredients: string;
}

interface MenuProps {
  selectedAllergens: string[];
}

const Menu: React.FC<MenuProps> = ({ selectedAllergens }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/menu");
        setMenu(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMenu();
  }, []);

  useEffect(() => {
    const filterMenu = () => {
      const allergenKeywords = {
        Treenut: [
          "walnut",
          "almond",
          "cashew",
          "pecan",
          "pistachio",
          "macadamia",
          "hazelnut",
        ],
        Soy: ["soybean", "tofu", "tempeh", "miso"],
        Sesame: ["sesame", "tahini"],
        Peanut: ["peanut"],
        Wheat: ["wheat", "flour", "gluten"],
        Garlic: ["garlic"],
        Avocado: ["avocado"],
        Banana: ["banana"],
        Mushrooms: ["mushroom"],
      };

      const allergensSet = new Set(selectedAllergens);
      const keywordsToExclude = Object.entries(allergenKeywords)
        .filter(([key]) => allergensSet.has(key))
        .flatMap(([, keywords]) => keywords);

      const filteredItems = menu.filter(
        (item) =>
          !keywordsToExclude.some((keyword) =>
            item.ingredients.toLowerCase().includes(keyword.toLowerCase())
          )
      );
      setFilteredMenu(filteredItems);
    };

    filterMenu();
  }, [menu, selectedAllergens]);

  return (
    <div>
      <div className="menu">
        {filteredMenu.map((item, index) => (
          <div key={index} className="menu-item">
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
