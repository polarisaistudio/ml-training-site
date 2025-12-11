"use client";

import { useState } from "react";

export function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      // Store in localStorage for now (can be upgraded to database later)
      const subscribers = JSON.parse(localStorage.getItem("email_subscribers") || "[]");

      if (subscribers.includes(email)) {
        setStatus("success");
        setMessage("You're already subscribed!");
        return;
      }

      subscribers.push(email);
      localStorage.setItem("email_subscribers", JSON.stringify(subscribers));

      setStatus("success");
      setMessage("Thanks for subscribing! I'll notify you when new questions are added.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Get New Interview Questions
      </h2>
      <p className="text-gray-600 mb-6">
        I add real interview questions weekly. Subscribe to get notified.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {status === "success" && (
          <p className="mt-3 text-green-600 text-sm">{message}</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-red-600 text-sm">{message}</p>
        )}
      </form>

      <p className="mt-4 text-xs text-gray-500">
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
