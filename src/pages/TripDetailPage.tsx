// src/pages/TripDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { MapPin } from "lucide-react";

type Trip = {
  id: string;
  title: string;
  note: string;
  day_numbers: number[];
  map_image_url?: string; // 메인이미지
};

type Place = {
  id: string;
  trip_id: string;
  day: number;
  order: number;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string; // 장소별 이미지
  info_url?: string;  
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 메인이미지 */}
      {trip.map_image_url && (
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-md">
          <img
            src={trip.map_image_url}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 제목과 노트 */}
      <div>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <p className="text-gray-600">{trip.note}</p>
      </div>

      {/* Day별 일정 */}
      {trip.day_numbers.map((day) => {
        const dayPlaces = places.filter((place) => place.day === day);
        return (
          <div key={day}>
            <h2 className="text-xl font-semibold mt-6 mb-2">Day {day}</h2>
            <div className="space-y-4">
              {dayPlaces.map((place) => (
                <div
                  key={place.id}
                  className="rounded-xl border shadow-sm overflow-hidden mb-6"
                >
                    {/* 이미지 크게 */}
                  <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-500">
                    {place.image_url ? (
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MapPin className="w-24 h-24" />
                    )}
                  </div>
                    {/* 하단 정보 */}
                  <div className="px-4 py-2 border-t">
                    <div className="text-lg font-medium">{place.name}</div>
                    <div className="text-sm text-gray-500">
                      {place.category} ・ {place.description}
                    </div>
                    <div className="text-xs text-gray-400">
                     <a
                        href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Go to Googlemap
                      </a>
                    </div>
                    {/* 정보 링크 */}
                  {place.info_url && (
                    <div className="mt-4">
                      <a
                        href={place.info_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        🔗 Detail Information
                      </a>
                    </div>
                  )}
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
