import React, { useState } from "react";

const Catalogs = () => {
  const [clickedPicture, setClickedPicture] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const catalogItems = [
    { 
      id: 1, 
      img: "/birthday.JPG", 
      title: "Birthdays",
     
      cta: "SPILL MORE",
      gallery: ["/birthdayone.JPG",
         "/birthdaytwo.JPG", "/BIRTH.JPG", "/BIRTH2.JPG",
         "/birthday.JPG", "/birthdaythree.JPG", "/BIRTH3.JPG", "/birhtdayfive.JPG", "/RR5.jpeg", "/RR.jpeg", "/RR1.jpeg", "/RR2.jpeg", "/RR4.jpeg" ] 
    },
    { 
      id: 2, 
      img: "/cop.jpeg", 
      title: "Corporate",
     
      cta: "SPILL MORE",
      gallery: ["/copfour.JPG","/coptwo.jpeg","/copthree.jpeg","/copfive.JPG","/copsix.JPG","/copseven.JPG", "/copeight.jpeg", "/copten.jpeg", "/copele.jpeg"] 
    },
    { 
      id: 3, 
      img: "/BB.JPG", 
      title: "Baby Showers",
     
      cta: "SPILL MORE", 
      gallery: ["/SS.jpg","/BB3.JPG","/BB2.JPG","/BB4.JPG","/BB5.JPG","/BB6.JPG", "/BB7.JPG"] 
    },
    { 
      id: 4, 
      img: "/FF3.jpeg", 
      title: "Food",
     
      cta: "SPILL MORE", 
      gallery: ["/FF3.jpeg","/FF6.jpeg","/FF4.jpeg","/FF20.jpeg","/FF2.jpg", "/FF9.JPG","/FF12.jpg", "/FF14.jpg" ] 
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % clickedPicture.gallery.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + clickedPicture.gallery.length) % clickedPicture.gallery.length);
  };

  return (
    <div className="w-full bg-white -mb-8">
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-16">
      
        <div className="mb-16 text-center">
          <h2 className="font-vogueHeading text-3xl md:text-4xl text-pink-900 tracking-tight mb-1">
            EVENT COLLECTION
          </h2>
          <p className="font-vogueBody text-xs tracking-[0.4em] text-pink-700/80 border-t border-b border-pink-600 py-2 inline-block mb-1">
            • NEW YORK • 
          </p>
        </div>

      
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="relative h-64 rounded-t-[80px] overflow-hidden">
                <div className="h-full w-full" style={{ clipPath: 'ellipse(120% 100% at 50% 0%)' }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                
               
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/75 to-transparent">
                  <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                    <p className="font-vogueBody text-[0.6rem] tracking-[0.3em] text-pink-200 mb-2">{item.subtitle}</p>
                    <h3 className="font-vogueHeading text-lg tracking-wide text-white mb-3">{item.title}</h3>
                    <button 
                      onClick={() => { setClickedPicture(item); setCurrentIndex(0); }}
                      className="text-white border border-pink-200/50 px-4 py-1.5 text-[0.65rem] tracking-[0.2em] hover:bg-pink-900/30 hover:border-pink-200 transition-all duration-300 w-max font-vogueBody"
                    >
                      {item.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        {clickedPicture && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 overflow-hidden">
            <div className="relative w-full max-w-3xl flex items-center justify-center overflow-hidden">
            
              <button
                onClick={() => setClickedPicture(null)}
                className="absolute top-4 right-4 text-pink-50 text-7xl font-bold z-50"
              >
                ×
              </button>

             
              <button
                onClick={handlePrev}
                className="absolute left-2 text-pink-50 text-4xl font-bold z-50 px-2 py-1 hover:bg-black/30 rounded transition"
              >
                ←
              </button>

            
              <div className="w-full h-[90vh] flex items-center justify-center relative">
                {clickedPicture.gallery.map((img, idx) => {
                  let translateClass = "";
                  let zIndex = "z-0";
                  let hiding = "opacity-0";

                  if (idx === currentIndex) {
                    translateClass = "translate-x-0";
                    zIndex = "z-30";
                    hiding = "opacity-100";
                  } else if (idx < currentIndex) {
                    translateClass = "-translate-x-full";
                    zIndex = "z-10";
                  } else {
                    translateClass = "translate-x-full";
                    zIndex = "z-10";

                  }

                  return (
                    <img
                      key={idx}
                      src={img}
                      alt={`${clickedPicture.title} ${idx}`}
                      className={`absolute w-auto max-h-[90vh] object-contain transition-all duration-500 ease-in-out ${translateClass} ${zIndex} ${hiding} `}
                    />
                  );
                })}
              </div>

            
              <button
                onClick={handleNext}
                className="absolute right-2 text-pink-50 text-4xl font-bold z-50 px-2 py-1 hover:bg-black/30 rounded transition"
              >
                →
              </button>
            </div>
          </div>
        )}

       
      
      </div>
    </div>
  );
};

export default Catalogs;