// src/pages/TripDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Trip = {
  id: string;
  title: string;
  note: string;
  day_numbers: number[];
};

type Place = {
  id: string;
  day: number;
  order: number;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchTripAndPlaces = async () => {
      const { data: tripData } = await supabase.from("trips").select("*").eq("id", id).single();
      const { data: placeData } = await supabase
        .from("places")
        .select("*")
        .eq("trip_id", id)
        .order("day", { ascending: true })
        .order("order", { ascending: true });

      setTrip(tripData);
      setPlaces(placeData || []);
    };

    fetchTripAndPlaces();
  }, [id]);

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div>
      <h1>{trip.title}</h1>
      <p>{trip.note}</p>

      {trip.day_numbers.map((day) => (
        <div key={day}>
          <h2>Day {day}</h2>
          {places
            .filter((place) => place.day === day)
            .map((place) => (
              <div key={place.id} style={{ paddingLeft: "1rem", marginBottom: "0.5rem" }}>
                <strong>{place.name}</strong> ({place.category})<br />
                {place.description}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
