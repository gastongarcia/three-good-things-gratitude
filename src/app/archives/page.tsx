"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

interface GratitudeEntry {
  what: string;
  why: string;
}

interface GratitudeDocument {
  id: string;
  date: Date;
  entries: GratitudeEntry[];
}

export default function ArchivesPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<GratitudeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<GratitudeDocument | null>(
    null
  );

  useEffect(() => {
    async function fetchEntries() {
      if (!session?.user?.email) return;

      try {
        const q = query(
          collection(db, "gratitude"),
          where("userId", "==", session.user.email),
          orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const gratitudeDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date.toDate(),
          entries: doc.data().entries,
        }));

        setEntries(gratitudeDocs);
      } catch (error) {
        console.error("Error fetching entries:", error);
        alert("Error loading your entries");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Your Gratitude Archives
        </h1>

        {selectedEntry ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedEntry(null)}
              className="mb-4 text-indigo-600 hover:text-indigo-800"
            >
              ← Back to all entries
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Entries for {selectedEntry.date.toLocaleDateString()}
              </h2>

              {selectedEntry.entries.map((entry, index) => (
                <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900">
                    Good Thing #{index + 1}
                  </h3>
                  <p className="mt-2 text-gray-800">What: {entry.what}</p>
                  <p className="mt-2 text-gray-800">Why: {entry.why}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg">
            {entries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No entries yet. Start by adding your first gratitude entry!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="w-full px-6 py-4 hover:bg-gray-50 flex justify-between items-center text-left"
                    >
                      <span className="text-gray-900">
                        {entry.date.toLocaleDateString()}
                      </span>
                      <span className="text-indigo-600">View entries →</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
