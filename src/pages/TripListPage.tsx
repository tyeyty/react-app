// src/pages/TripListPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

type Trip = {
  id: string;
  title: string;
  note: string;
  day_numbers: number[];
  img_url?: string; // 지도 이미지 URL
};

export default function TripListPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase.from("trips").select("*");
      if (!error && data) {
        setTrips(data);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="lg:w-[1312px] flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">GH's Trips</h1>
      </div>      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {trips.map((trip) => (
          <Link key={trip.id} to={`/trips/${trip.id}`}>
            <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition-shadow duration-200">
              {trip.img_url && (
                <img
                  src={trip.img_url}
                  alt={trip.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{trip.title}</h2>
                <p className="text-gray-500">{trip.note}</p>
                <p className="text-gray-700 mt-1">{trip.day_numbers.length} day(s)</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
