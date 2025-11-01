"use client";

import { useState } from "react";
import { createEvent } from "../../lib/api";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  venue: string;
  date: string;
  description: string;
  totalTickets: string;
  basePrice: string;
  floorPrice: string;
  ceilingPrice: string;
  isDefaultPricingRulesEnabled: boolean;
}

export default function CreateEventPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    venue: "",
    date: "",
    description: "",
    totalTickets: "",
    basePrice: "",
    floorPrice: "",
    ceilingPrice: "",
    isDefaultPricingRulesEnabled: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (["basePrice", "floorPrice", "ceilingPrice", "totalTickets"].includes(name)) {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      isDefaultPricingRulesEnabled: !prev.isDefaultPricingRulesEnabled,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const base = parseFloat(formData.basePrice);
    const floor = parseFloat(formData.floorPrice);
    const ceiling = parseFloat(formData.ceilingPrice);

    if (ceiling < base || floor > base) {
      alert(
        "Invalid pricing: Floor Price must be LOWER than Base Price, and Ceiling Price must be HIGHER than Base Price."
      );
      setLoading(false);
      return;
    }

    const minFloorPrice = Number(process.env.NEXT_PUBLIC_MIN_FLOOR_WEIGHT) * base;
    const maxFloorPrice = Number(process.env.NEXT_PUBLIC_MAX_FLOOR_WEIGHT) * base;
    const minCeilingPrice = Number(process.env.NEXT_PUBLIC_MIN_CEILING_WEIGHT) * base;
    const maxCeilingPrice = Number(process.env.NEXT_PUBLIC_MAX_CEILING_WEIGHT) * base;

    if (floor < minFloorPrice || floor > maxFloorPrice) {
      alert(`Invalid floor value must be between ${minFloorPrice} and ${maxFloorPrice}.`);
      setLoading(false);
      return;
    }

    if (ceiling < minCeilingPrice || ceiling > maxCeilingPrice) {
      alert(`Invalid ceiling value must be between ${minCeilingPrice} and ${maxCeilingPrice}.`);
      setLoading(false);
      return;
    }

    try {
      await createEvent({
        ...formData,
        totalTickets: parseInt(formData.totalTickets, 10),
        basePrice: base,
        floorPrice: floor,
        ceilingPrice: ceiling,
        date: new Date(formData.date).toISOString(),
      });
      toast.success("Event created successfully!");
      setFormData({
        name: "",
        venue: "",
        date: "",
        description: "",
        totalTickets: "",
        basePrice: "",
        floorPrice: "",
        ceilingPrice: "",
        isDefaultPricingRulesEnabled: true,
      });
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 16);

  const fields = [
    { label: "Event Name", name: "name", type: "text", placeholder: "Enter event name" },
    { label: "Venue", name: "venue", type: "text", placeholder: "Enter venue" },
    { label: "Date", name: "date", type: "datetime-local", placeholder: "Select event date" },
    { label: "Description", name: "description", type: "textarea", placeholder: "Enter event description" },
    { label: "Total Tickets", name: "totalTickets", type: "text", placeholder: "Total tickets available" },
    { label: "Base Price", name: "basePrice", type: "text", placeholder: "Enter base price" },
    { label: "Floor Price", name: "floorPrice", type: "text", placeholder: "Enter higher floor price" },
    { label: "Ceiling Price", name: "ceilingPrice", type: "text", placeholder: "Enter lower ceiling price" },
  ];

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-orange-400 bg-clip-text text-transparent">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-800 mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-3 bg-gray-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-transparent border-[2px] placeholder-gray-500"
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  inputMode={["basePrice", "floorPrice", "ceilingPrice", "totalTickets"].includes(field.name) ? "decimal" : "text"}
                   value={
                    formData[field.name as keyof typeof formData] as string
                  }
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  {...(field.name === "date" ? { min: today } : {})}
                  className="w-full p-3 bg-gray-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-transparent border-[2px] placeholder-gray-500"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-800">Enable Default Pricing Rules</span>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                formData.isDefaultPricingRulesEnabled ? "bg-gradient-to-r from-blue-600 to-orange-400" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform bg-white rounded-full transition ${
                  formData.isDefaultPricingRulesEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-orange-400 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
