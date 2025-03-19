import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

import L from "leaflet";

const MapComponent = ({ currentLocation, pickup, dropoff, setTotalDistance, setTotalDuration }) => {
  const [route, setRoute] = useState([]);
  const [stops, setStops] = useState([]);


  const fuelIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.freepik.com/256/8809/8809304.png?semt=ais_hybrid",
    iconSize: [25, 25], 
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });

  const restIcon = new L.Icon({
    iconUrl: "https://static.vecteezy.com/system/resources/thumbnails/022/283/739/small/3d-render-red-stop-sign-the-concept-of-warning-3d-render-stop-sign-cartoon-icon-png.png",
    iconSize: [40, 35], 
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });

  const defaultCenter = currentLocation || { lat: 37.7749, lng: -122.4194 };

  useEffect(() => {
    if (!currentLocation || !pickup || !dropoff) return;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentLocation.lng},${currentLocation.lat};${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson&steps=true`
        );
        const data = await response.json();

        if (data.routes) {
          const routeData = data.routes[0];
          setRoute(routeData.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          setTotalDistance(routeData.distance / 1609); // Convert meters to miles
          setTotalDuration(routeData.duration / 3600 + 2); // Convert seconds to hours
          fetchStopsAlongRoute(routeData.geometry.coordinates);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [currentLocation, pickup, dropoff]);

  
  // ✅ Fetch Stops Along Route
  const fetchStopsAlongRoute = async (routeCoordinates) => {
    if (!routeCoordinates.length) return;

    const stepSize = Math.floor(routeCoordinates.length / 10); // Adjust to query every ~10% of the route

    const queries = routeCoordinates
      .filter((_, index) => index % stepSize === 0) // Pick waypoints along the route
      .map(([lng, lat]) => `(node(around:5000,${lat},${lng})["amenity"~"fuel|parking|rest_area"];);`)
      .join("");

    try {
      const overpassQuery = `[out:json];(${queries});out;`;

      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const data = await response.json();
      const fetchedStops = data.elements.map(({ lat, lon, tags }) => ({
        lat,
        lng: lon,
        name: tags.name || "Unknown Stop",
        type: tags.amenity || "Stop",
      }));

      setStops(fetchedStops);
      console.log('stop fetching is working');
      
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  return (
    <div>
      <MapContainer center={defaultCenter} zoom={10} style={{ height: "84vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route.length > 0 && <Polyline positions={route} color="blue" />}

        {/* Markers */}
        {currentLocation && <Marker position={currentLocation}><Popup>Current Location</Popup></Marker>}
        <Marker position={pickup}><Popup>Pickup Location (1 hour)</Popup></Marker>
        <Marker position={dropoff}><Popup>Dropoff Location (1 hour)</Popup></Marker>

        {/* Stops */}
        {stops.map((stop, index) => (
          <Marker key={index} position={{ lat: stop.lat, lng: stop.lng }} icon={stop.type === "fuel" ? fuelIcon : restIcon}>
            <Popup><strong>{stop.name}</strong><br />Type: {stop.type}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

