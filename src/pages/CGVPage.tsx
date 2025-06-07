import React from 'react';

const CGVPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Conditions Générales de Vente (CGV)</h1>
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-md overflow-hidden">
        <iframe
          src="/CGV AUTOMEDON.pdf"
          title="Conditions Générales de Vente Automédon"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        >
          Ce navigateur ne supporte pas les iframes. Veuillez télécharger le PDF pour le consulter.
          <a href="/CGV AUTOMEDON.pdf" download className="text-blue-500 hover:underline ml-2">Télécharger le PDF</a>
        </iframe>
      </div>
    </div>
  );
};

export default CGVPage;