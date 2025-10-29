"use client";

import { useState } from "react";
import { createEvent } from "../../lib/api";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    // Allow only digits and one dot for numeric fields
    if (
      ["basePrice", "floorPrice", "ceilingPrice", "totalTickets"].includes(name)
    ) {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleToggle() {
    setFormData((prev) => ({
      ...prev,
      isDefaultPricingRulesEnabled: !prev.isDefaultPricingRulesEnabled,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const base = parseFloat(formData.basePrice);
    const floor = parseFloat(formData.floorPrice);
    const ceiling = parseFloat(formData.ceilingPrice);

    if (ceiling < base || floor > base) {
      alert(
        "Invalid pricing: Ceiling Price must be LOWER than Base Price, and Floor Price must be HIGHER than Base Price."
      );
      setLoading(false);
      return;
    }

    if (
      ceiling < base * Number(process.env.NEXT_PUBLIC_MIN_CEILING_WEIGHT) ||
      floor > base * Number(process.env.NEXT_PUBLIC_MIN_FLOOR_WEIGHT)
    ) {
      alert(
        `Invalid pricing: Ceiling must be at least ${
          base * Number(process.env.NEXT_PUBLIC_MIN_CEILING_WEIGHT)
        }, and Floor must be at most ${
          base * Number(process.env.NEXT_PUBLIC_MIN_FLOOR_WEIGHT)
        }.`
      );
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
  }

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-orange-400 bg-clip-text text-transparent">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              label: "Event Name",
              name: "name",
              type: "text",
              placeholder: "Enter event name",
            },
            {
              label: "Venue",
              name: "venue",
              type: "text",
              placeholder: "Enter venue",
            },
            {
              label: "Date",
              name: "date",
              type: "datetime-local",
              placeholder: "Select event date",
            },
            {
              label: "Description",
              name: "description",
              type: "textarea",
              placeholder: "Enter event description",
            },
            {
              label: "Total Tickets",
              name: "totalTickets",
              type: "text",
              placeholder: "Total tickets available",
            },
            {
              label: "Base Price",
              name: "basePrice",
              type: "text",
              placeholder: "Enter base price",
            },
            {
              label: "Floor Price",
              name: "floorPrice",
              type: "text",
              placeholder: "Enter higher floor price",
            },
            {
              label: "Ceiling Price",
              name: "ceilingPrice",
              type: "text",
              placeholder: "Enter lower ceiling price",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={
                    formData[field.name as keyof typeof formData] as string
                  }
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-3 bg-gray-100 text-black rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-transparent 
                    [background:linear-gradient(#f3f4f6,#f3f4f6)_padding-box,linear-gradient(to_right,#2563eb,#fb923c)_border-box] 
                    border-[2px] placeholder-gray-500"
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  inputMode={
                    [
                      "basePrice",
                      "floorPrice",
                      "ceilingPrice",
                      "totalTickets",
                    ].includes(field.name)
                      ? "decimal"
                      : "text"
                  }
                  value={
                    formData[field.name as keyof typeof formData] as string
                  }
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  {...(field.name === "date" ? { min: today } : {})}
                  className="w-full p-3 bg-gray-100 text-black rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-transparent 
                    [background:linear-gradient(#f3f4f6,#f3f4f6)_padding-box,linear-gradient(to_right,#2563eb,#fb923c)_border-box] 
                    border-[2px] placeholder-gray-500"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-800">
              Enable Default Pricing Rules
            </span>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition 
                ${
                  formData.isDefaultPricingRulesEnabled
                    ? "bg-gradient-to-r from-blue-600 to-orange-400"
                    : "bg-gray-400"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform bg-white rounded-full transition 
                  ${formData.isDefaultPricingRulesEnabled ? "translate-x-6" : "translate-x-1"}`}
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
