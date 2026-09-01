
import React from 'react';

// Bu SVG'yi kendi logonuzla veya resminizle değiştirebilirsiniz.
// Örneğin: <img src="/path/to/your/logo.png" alt="Logo" className="w-36 h-36" />
const CatFigure = () => (
    <svg 
        width="150" 
        height="150" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-teal-400"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M16 16c0 .552 -.448 1 -1 1s-1 -.448 -1 -1s.448 -1 1 -1s1 .448 1 1z" fill="currentColor" />
        <path d="M10 16c0 .552 -.448 1 -1 1s-1 -.448 -1 -1s.448 -1 1 -1s1 .448 1 1z" fill="currentColor" />
        <path d="M12 3c-1.333 .667 -2 2.333 -2 5c0 2.667 2 5 2 5s2 -2.333 2 -5c0 -2.667 -.667 -4.333 -2 -5" />
        <path d="M12 3c1.333 .667 2 2.333 2 5c0 2.667 -2 5 -2 5s-2 -2.333 -2 -5c0 -2.667 .667 -4.333 2 -5" transform="rotate(180 12 8)" />
        <path d="M3 12c0 -4 3 -6 6 -6" />
        <path d="M21 12c0 -4 -3 -6 -6 -6" />
        <path d="M12 13c-2.667 0 -4 1.333 -4 4" />
        <path d="M12 13c2.667 0 4 1.333 4 4" />
    </svg>
);


const SplashScreen: React.FC = () => {
  // Figürü değiştirmek için yukarıdaki CatFigure bileşenini düzenleyebilir
  // veya aşağıdaki <CatFigure /> etiketini kendi resminizle değiştirebilirsiniz.
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-900">
      <div className="animate-pulse">
        <CatFigure />
      </div>
      <h1 className="text-3xl font-bold text-teal-400 mt-6">İş Takip Asistanı</h1>
      <p className="text-gray-500 mt-2">Yükleniyor...</p>
    </div>
  );
};

export default SplashScreen;