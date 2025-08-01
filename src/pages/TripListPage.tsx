// src/pages/TripListPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

type Trip = {
  id: string;
  title: string;
  note: string;
  day_numbers: number[];
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
    <div>
      <h1>All Trips</h1>
      {trips.map((trip) => (
        <Link key={trip.id} to={`/trips/${trip.id}`}>
          <div style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
            <h2>{trip.title}</h2>
            <p>{trip.note}</p>
            <p>{trip.day_numbers.length} day(s)</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
