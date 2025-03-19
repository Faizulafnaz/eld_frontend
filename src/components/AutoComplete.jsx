import { useState } from "react";
import { FloatingLabel } from "flowbite-react";

const AutocompleteInput = ({ onSelect, label }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (input) => {
    if (input.length < 3) return; // Prevent unnecessary API calls
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
    }
  };

  return (
    <div className="relative">
        <FloatingLabel 
        variant="standard" 
        label={label} 
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}/>
      {/* <input
        type="text"
        placeholder="Enter location..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        className="border px-4 py-2 w-full rounded-md"
      /> */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 overflow-x-auto max-h-80">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => {
                // ✅ Convert lat/lon from string to number before passing it
                onSelect({
                  lat: parseFloat(place.lat), // Convert to number
                  lng: parseFloat(place.lon), // Convert to number
                  name: place.display_name,
                });
                setQuery(place.display_name);
                setSuggestions([]);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
