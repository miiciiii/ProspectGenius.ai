import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface WaitingListEntry {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  created_at: string;
}

export default function WaitingListTable() {
  const [entries, setEntries] = useState<WaitingListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWaitingList = async () => {
      const { data, error } = await supabase
        .from("waiting_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching waiting list:", error);
      } else {
        setEntries(data || []);
      }

      setIsLoading(false);
    };

    fetchWaitingList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f8f9fc] via-[#e8eaf6] to-[#dee2ff] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}

        {/* Card */}
        <Card className="shadow-xl rounded-xl border border-transparent bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Waiting List Entries
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-6 h-6 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <p className="text-gray-600 text-center py-10">No entries found.</p>
            ) : (
              <div className="overflow-auto rounded-lg shadow-inner">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">First Name</th>
                      <th className="px-4 py-3">Last Name</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 text-gray-800">
                    {entries.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={`${
                          index % 2 === 0 ? "bg-white/70" : "bg-gray-50/70"
                        } hover:bg-indigo-50 transition`}
                      >
                        <td className="px-4 py-3">{entry.first_name}</td>
                        <td className="px-4 py-3">{entry.last_name}</td>
                        <td className="px-4 py-3">{entry.company_name}</td>
                        <td className="px-4 py-3">{entry.email}</td>
                        <td className="px-4 py-3">
                          {new Date(entry.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
