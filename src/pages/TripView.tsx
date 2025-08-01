// src/pages/TripView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { MapPin } from "lucide-react";

type Trip = {
  id: string;
  title: string;
  note: string;
  day_numbers: number[];
};

type Place = {
  id: string;
  trip_id: string;
  day: number;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function TripView() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tripData } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId!)
        .single();

      const { data: placesData } = await supabase
        .from("places")
        .select("*")
        .eq("trip_id", tripId!)
        .order("day", { ascending: true })
        .order("order", { ascending: true });

      setTrip(tripData);
      setPlaces(placesData || []);
    };

    if (tripId) fetchData();
  }, [tripId]);

  if (!trip) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <p className="text-gray-600">{trip.note}</p>
      </div>

      {trip.day_numbers.map((day) => {
        const dayPlaces = places.filter((p) => p.day === day);
        return (
          <div key={day}>
            <h2 className="text-xl font-semibold mt-6">Day {day}</h2>
            <div className="space-y-4">
              {dayPlaces.map((place) => (
                <div
                  key={place.id}
                  className="rounded-xl border p-4 shadow-sm flex items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-medium">{place.name}</div>
                    <div className="text-sm text-gray-500">
                      {place.category} ・ {place.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      ({place.latitude.toFixed(3)}, {place.longitude.toFixed(3)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
