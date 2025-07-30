import React from "react";
import { useMissions } from "@/context/MissionsContext";

interface ConvoyeurTurnoverProps {
  userId: string;
}

const ConvoyeurTurnover: React.FC<ConvoyeurTurnoverProps> = ({ userId }) => {
  // Correction: Appeler directement useMonthlyTurnover depuis useMissions()
  const { turnover: monthlyTurnover, isLoading: isLoadingMonthlyTurnover } = useMissions().useMonthlyTurnover(userId);

  if (isLoadingMonthlyTurnover) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement du chiffre d'affaires...</p>;
  }

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Chiffre d'affaires du mois</h2>
      <p className="text-4xl font-extrabold text-primary dark:text-primary-foreground">
        {monthlyTurnover.toFixed(2)} €
      </p>
    </div>
  );
};

export default ConvoyeurTurnover;