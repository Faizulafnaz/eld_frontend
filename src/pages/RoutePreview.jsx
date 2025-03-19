import { useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import AutocompleteInput from "../components/AutoComplete";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const RoutePreview = () => {
  const location = useLocation();
  const { currentLocation, pickup, dropoff, cycleHours } = location.state || {};

  const [newCurrentLocation, setNewCurrentLocation] = useState(currentLocation || null);
  const [newPickup, setNewPickup] = useState(pickup || null);
  const [newDropoff, setNewDropoff] = useState(dropoff || null);
  const [newCycleHours, setNewCycleHours] = useState(cycleHours || "");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // Default to New York City

  // Get user's current geolocation on page load
  useEffect(() => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(false); // Stop loading once location is fetched
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          alert("Unable to retrieve your location.");
          setUserLocation(defaultCenter); // Use default location if geolocation fails
          setIsLoading(false); // Stop loading
        }
      );
    }
  }, [currentLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPickup || !newDropoff ) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="flex max-h-screen  bg-gray-50">
      <Nav />

      {/* Sidebar for Trip Input */}
      <div className="w-1/5 p-6 bg-white mt-24 rounded  min-h-full">
        <h2 className="text-2xl  font-bold text-center">Enter trip details</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* ✅ Autocomplete Inputs for Trip Details */}
          <div className="mb-5 mt-8 ">
            <AutocompleteInput onSelect={setNewCurrentLocation} label="Current Location" />
          </div>
          <div className="mb-7">
            <AutocompleteInput onSelect={setNewPickup} label="Pickup Location"/>
          </div>
          <div className="mb-7">
            <AutocompleteInput onSelect={setNewDropoff} label="Dropoff Location"/>
          </div>
          
          <div className="flex mt-28 justify-center">
            <Button type="submit" className="w-40">
              Submit Details
            </Button>
          </div>
        </form>

        {isSubmitted && (

            <div className="p-4 bg-gray-100 rounded-lg mt-8">
                <h1 className="text-lg font-bold">Trip Summary</h1>
                <p>Total Distance: {totalDistance.toFixed(1)} miles</p>
                <p>Expected Total Duration: {totalDuration.toFixed(1)} hours (including pickup and dropoff)</p>
            </div>
        )}

      </div>

      {/* Main Route Preview Area */}
      <div className="flex-1 p-6 mt-20">
        {/* Render Map only after user location is fetched */}
        {isLoading ? (
          <div>Loading...</div> // You can show a spinner or any loading indicator
        ) : (
          <>
            {isSubmitted ? (
              <MapComponent
                currentLocation={newCurrentLocation || userLocation || defaultCenter}
                pickup={newPickup}
                dropoff={newDropoff}
                setTotalDistance={setTotalDistance} 
                setTotalDuration={setTotalDuration} 
              />
            ) : (
              <MapContainer
                center={userLocation || defaultCenter}
                zoom={10}
                style={{ height: "585px", width: "100%" }}
              >
                {/* OpenStreetMap Tile Layer */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={userLocation}>
                        <Popup>Current Location</Popup>
                    </Marker>
              </MapContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoutePreview;
