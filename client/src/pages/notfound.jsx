import React from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-50">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => (window.location.href = "/")}
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;