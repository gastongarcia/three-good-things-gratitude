"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface GratitudeEntry {
  what: string;
  why: string;
}

export default function GratitudePage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<GratitudeEntry[]>([
    { what: "", why: "" },
    { what: "", why: "" },
    { what: "", why: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("You must be logged in to save entries");
      return;
    }

    try {
      setIsSaving(true);

      // Create the document to save
      const gratitudeDoc = {
        userId: session.user.email,
        date: serverTimestamp(),
        entries: entries,
      };

      // Save to Firestore
      await addDoc(collection(db, "gratitude"), gratitudeDoc);

      // Clear the form
      setEntries([
        { what: "", why: "" },
        { what: "", why: "" },
        { what: "", why: "" },
      ]);

      alert("Entries saved successfully!");
    } catch (error) {
      console.error("Error saving entries:", error);
      alert("Error saving entries. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Three Good Things
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Good Thing #{index + 1}
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  What went well today?
                </label>
                <textarea
                  value={entry.what}
                  onChange={(e) => {
                    const newEntries = [...entries];
                    newEntries[index].what = e.target.value;
                    setEntries(newEntries);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Why do you think it went well?
                </label>
                <textarea
                  value={entry.why}
                  onChange={(e) => {
                    const newEntries = [...entries];
                    newEntries[index].why = e.target.value;
                    setEntries(newEntries);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  rows={3}
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:bg-indigo-400"
          >
            {isSaving ? "Saving..." : "Save Today's Entries"}
          </button>
        </form>
      </div>
    </div>
  );
}
