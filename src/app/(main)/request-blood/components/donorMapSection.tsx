"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; // ✅ Important: Must import CSS

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

type Donor = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

const donors: Donor[] = [
  { id: 1, name: "Dr. Rahman", lat: 23.8103, lng: 90.4125 }, // Dhaka
  { id: 2, name: "Hasan", lat: 22.3569, lng: 91.7832 }, // Chittagong
  { id: 3, name: "Nusrat", lat: 22.8456, lng: 89.5403 }, // Khulna
  { id: 4, name: "Arif", lat: 24.3745, lng: 88.6042 }, // Rajshahi
  { id: 5, name: "Sadia", lat: 24.8949, lng: 91.8687 }, // Sylhet
  { id: 6, name: "Rana", lat: 22.701, lng: 90.3535 }, // Barishal
  { id: 7, name: "Tania", lat: 25.7439, lng: 89.2752 }, // Rangpur
];

export default function DonorMapSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const L = require("leaflet");

    // Fix default marker icons in Next.js
    delete (L.Icon.Default as any).prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    setIsClient(true);
  }, []);

  return (
    <section className="container mx-auto w-full px-6 mb-24">
      <div className="bg-[#f3f3f5] rounded-4xl overflow-hidden flex flex-col md:flex-row items-center md:min-h-[400px]">
        {/* Left Content */}
        <div className="w-full md:w-1/2 p-12 md:p-16">
          <h2 className="font-headline text-3xl font-extrabold mb-4 text-on-surface">
            Donors Near You
          </h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            We currently have over {donors.length}+ active donors within a
            5-mile radius of central healthcare facilities. Your request will
            reach them in milliseconds.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="w-12 h-12 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-sm font-bold text-white relative z-10"
                  title={donor.name} // optional: show name on hover
                >
                  {donor.name[0]} {/* First letter of name */}
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-primary">
              + {donors.length} Active Donors
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-1/2 h-100 md:h-100 relative">
          {isClient && (
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={6}
              scrollWheelZoom={false}
              className="w-full h-full rounded-4xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {donors.map((donor) => (
                <Marker key={donor.id} position={[donor.lat, donor.lng]}>
                  <Popup>{donor.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </section>
  );
}
