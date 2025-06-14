import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConcessionnaireDashboard from "@/components/concessionnaire/ConcessionnaireDashboard";

const Concessionnaire = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        <ConcessionnaireDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Concessionnaire;