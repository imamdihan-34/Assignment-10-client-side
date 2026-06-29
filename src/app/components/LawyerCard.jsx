"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LawyerCard({ lawyer }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <img
          src={lawyer.profilePicture || "https://via.placeholder.com/300x200"}
          alt={lawyer.fullName}
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute top-3 right-3 z-10">
          {lawyer.status === "busy" ? (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Busy
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Available
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-2">
            {lawyer.specialization || lawyer.specialty}
          </span>

          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600 transition">
            {lawyer.fullName || lawyer.name}
          </h3>

          <p className="text-gray-500 text-xs font-medium mb-3">
            Experience: {lawyer.experience || "N/A"}
          </p>
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
            {lawyer.bio ||
              "Provides expert professional legal consultation and representation services."}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Hourly Rate
              </p>
              <p className="text-2xl font-black text-gray-950">
                ${lawyer.hourlyRate || "50"}
                <span className="text-xs font-medium text-gray-500">/hr</span>
              </p>
            </div>

            {lawyer.totalHires && (
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Total Hires
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {lawyer.totalHires} clients
                </p>
              </div>
            )}
          </div>

          <Link href={`/lawyer-details/${lawyer._id}`} className="block w-full">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-blue-200 text-center text-sm tracking-wide">
              View Profile & Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
