import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import AIAssistant from "../AIAssistant";

type ColleaguePreference = {
  id: string;
  name: string;
  presencePercent: number;
  daysPresent: number;
  favoriteRoom: string;
  favoriteSeat: string;
};

const Preferences = () => {
  const [preferences, setPreferences] = useState<ColleaguePreference[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/hr/preferences", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load preferences");
        }
        return response.json() as Promise<ColleaguePreference[]>;
      })
      .then((data) => {
        setPreferences(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setPreferences([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = preferences.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <BackButton fallbackTo="/dashboard" />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Caută un coleg după nume..."
              className="w-full rounded-full border border-[#D1D5DB] bg-[#F9FAFB] px-5 py-3 text-[#1E1B4B] outline-none transition focus:border-[#6D28D9]"
            />
            <p className="text-xs text-gray-400 mt-2 ml-4">
              Caută o persoană pentru a-i vedea preferințele din ultima lună.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-[#1E1B4B] mb-10 text-center">
            Preferințele Colegilor (Ultima Lună)
          </h2>

          {isLoading ? (
            <div className="text-center text-gray-500">Se încarcă preferințele...</div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {filtered.length > 0 ? (
                filtered.map((person) => (
                  <div key={person.id} className="flex flex-col items-start w-full">
                    <h3 className="text-[22px] font-bold text-[#1E1B4B] mb-2 ml-4">
                      {person.name}
                    </h3>

                    <div className="bg-[#EDE9FE] border border-[#DDD6FE] rounded-full px-8 py-6 text-lg font-bold text-[#1E1B4B] shadow-sm w-full text-left">
                      {person.name.split(" ")[0]} a venit {person.presencePercent}% la birou în ultima lună (prezent fizic {person.daysPresent} zile).
                      <span className="text-[#6D28D9] ml-2">
                        (Preferință: {person.favoriteRoom}, {person.favoriteSeat})
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xl text-gray-400 font-medium mt-10 w-full">
                  Nu am găsit niciun coleg cu acest nume.
                </div>
              )}
            </div>
          )}

          <AIAssistant />
        </div>
      </div>
    </div>
  );
};

export default Preferences;