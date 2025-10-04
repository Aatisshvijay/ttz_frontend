import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const GodTemplesPage = ({ isDarkMode }) => {
  const { godName } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("GodTemplesPage: Fetching data for:", godName);
const response = await fetch(`/temples/deities/${encodeURIComponent(godName)}/categories`);        if (!response.ok) throw new Error("Failed to fetch categories");
        const categoryData = await response.json();
        console.log("GodTemplesPage: Categories Response:", categoryData);
        
        const vishnuCategoryOrder = ['Vishnu (108 Divya Desams)', 'Matsya Avatar', 'Kurma Avatar', 'Lord Varaha', 'Lord Narasimha', 'Lord Vamana', 'Lord Parshuram', 'Lord Sri Rama', 'Lord Krishna'];
        let transformedCategories = categoryData.map((category) => ({
          name: category.name,
          count: category.templeCount,
          image: category.image,
          temples: [],
          description: getCategoryDescription(category.name, godName),
        }));

        if (godName === 'Maha Avatars of Vishnu') {
          transformedCategories = transformedCategories.sort((a, b) => {
            const aIndex = vishnuCategoryOrder.indexOf(a.name);
            const bIndex = vishnuCategoryOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.name.localeCompare(b.name);
          });
        } else {
          transformedCategories = transformedCategories.sort((a, b) => a.name.localeCompare(b.name));
        }
        setCategories(transformedCategories);
        setTimeout(() => setShowCategories(true), 50);
      } catch (error) {
        console.error("GodTemplesPage: Error fetching data:", error);
        setError(error.message || "Failed to fetch temple data");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    if (godName) fetchData();
  }, [godName]);

  const getCategoryDescription = (category, deity) => {
    const descriptions = { 
      "Vishnu (108 Divya Desams)": "The 108 most sacred temples of Lord Vishnu across India", 
      "Matsya Avatar": "Temples dedicated to the Fish incarnation that saved the world from the great flood", 
      "Kurma Avatar": "Temples honoring the Turtle incarnation that supported Mount Mandara", 
      "Lord Varaha": "Temples of the Boar incarnation who rescued the Earth", 
      "Lord Narasimha": "Temples of the Man-Lion incarnation who protected devotee Prahlada", 
      "Lord Vamana": "Temples of the Dwarf incarnation who subdued Mahabali", 
      "Lord Parshuram": "Temples of the Warrior Sage who cleansed the earth of corruption", 
      "Lord Sri Rama": "Temples dedicated to the ideal king and hero of the Ramayana", 
      "Lord Krishna": "Temples of the complete incarnation and philosopher of the Bhagavad Gita", 
      "Arupadaiveedu": "The six sacred abodes of Lord Murugan in Tamil Nadu", 
      "Jyotirlingas": "The 12 sacred self-manifested shrines of Lord Shiva", 
      "Shakti Peethas": "Sacred shrines where parts of Goddess Sati fell", 
      "Pancha Bhoota Sthalams": "Five temples representing the five elements", 
      "Navagraha Temples": "Nine temples for the celestial bodies", 
      "Hanuman Temples": "Sacred temples of Lord Hanuman", 
      "Ayyappa Temples": "Sacred temples of Lord Ayyappa", 
      "Devi Temples": "Temples dedicated to various forms of the Divine Mother", 
      "Lakshmi Temples": "Temples dedicated to Goddess Lakshmi", 
      "Ganesha Temples": "Temples dedicated to the remover of obstacles" 
    };
    return descriptions[category] || `Sacred temples dedicated to ${deity}`;
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading temple categories for {godName}...</div></div>;
  if (error) return <div className="text-center py-12"><h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Error Loading Data</h2><p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p><div className="space-x-4"><button onClick={() => window.location.reload()} className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${isDarkMode ? "bg-orange-600 text-white hover:bg-orange-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}>Retry</button><button onClick={() => navigate("/")} className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${isDarkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-500 text-white hover:bg-gray-600"}`}>Go to Home</button></div></div>;
  if (categories.length === 0) return <div className="text-center py-12"><h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>No temple categories found for "{godName}"</h2><p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>The deity "{godName}" could not be found in our database, or no temples are available.</p></div>;

  const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 will-change-transform ${isDarkMode ? "bg-gray-800 text-gray-100 hover:shadow-gray-700" : "bg-white text-gray-800"}`;
  const shouldEagerLoad = (index) => index < 3;

  return (
    <div className="py-8">
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>{godName}</h1>
      <p className={`text-lg text-center mb-8 max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Explore the sacred temples and spiritual destinations dedicated to {godName}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container-75ms">
        {categories.map((category, index) => (
          <div
            key={category.name || index}
            onClick={() => navigate(`/god/${encodeURIComponent(godName)}/${encodeURIComponent(category.name)}`)}
            className={`${cardClass} stagger-card-base stagger-card-d500 ${showCategories ? 'is-visible' : ''}`}
          >
            {/* // Before: className="w-full h-48 object-cover" */}
<OptimizedImage
  src={category.image}
  alt={category.name}
  // FIX: Removed h-48 as OptimizedImage now manages vertical space via aspect ratio
  className="w-full object-cover rounded-t-xl" 
  width={400}
  height={192} // 400x192 is the aspect ratio used to calculate space
  eagerLoad={shouldEagerLoad(index)}
/>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{category.name}</h2>
              {category.description && <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{category.description}</p>}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? "bg-orange-500 text-white" : "bg-orange-500 text-white"}`}>{category.count} temple{category.count !== 1 ? "s" : ""}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GodTemplesPage;