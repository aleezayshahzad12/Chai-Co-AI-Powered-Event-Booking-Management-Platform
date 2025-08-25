import React from "react";

const About = () => {
  return (
    <div className="relative py-28 px-8 md:py-36 md:px-12 lg:px-24 flex flex-col md:flex-row items-start gap-16">
      
      <div className="relative z-10 text-stone-800 max-w-2xl pl-12 border-l-2 border-pink-300">
        <h2 className="font-vogueBody text-2xl md:text-4xl lg:text-5xl text-pink-900 mb-8 tracking-tight leading-tight font-bold">
          Why Chai & Co. <br className="hidden md:block"/>
        </h2>
        
        <div className="space-y-8">
          <p className="font-vogueBody font-medium text-lg md:text-xl leading-relaxed">
            We’re Iqra and Amna—two friends who believe the best memories are made when people come together. 
            Living in New York taught us the value of pausing in the midst of city life to celebrate with loved ones. 
            With a shared passion for hosting, we turned that belief into Chai & Co.
          </p>

          <p className="font-vogueBody  font-medium text-lg md:text-xl leading-relaxed">
            Why <span className="italic">Chai & Co.</span>? Because chai brings warmth, comfort, and conversation—
            and <span className="italic">Co.</span> is the company we cherish: moments of joy, gathering, and celebration. 
            Our goal is to bring that same spirit into every event we create, designing with intention and curating experiences 
            that feel effortless, personal, and unforgettable.
          </p>

          <p className="font-vogueBody font-semibold text-lg md:text-xl leading-relaxed text-pink-900 italic">
            So here’s a toast—may we spill joy, not stress, into your celebrations.
          </p>
        </div>
      </div>

      <div className="relative md:sticky md:top-40 w-full max-w-md lg:max-w-lg mt-12 md:mt-0">
        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-xl bg-gray-100">
          <img
            src="/founders.jpeg"
            alt="Founders"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-6 text-center text-sm text-pink-900 font-cosen italic">
          Iqra & Amna, Founders
        </div>
      </div>
    </div>
  );
};

export default About;
