import { FaBars, FaTimes, FaLock } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ConsultationForm from "./ConsultationForm";
import About from "./About";
import BookingAppointment from "./BookingAppointment";
import Catalogs from "./catalogs";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const aboutSection = useRef(null);
  const buttonRef = useRef(null);
  const eventSection = useRef(null);
  const processSection = useRef(null);
  const [showButton, setShowButton] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);


  // all of the scroll functions allow the user to click on the navbar compoments and the page will automatically go to the clicked secions. 
  const scrollToSection = (section) => {
    if (section === "about") {
      if (aboutSection.current) {
        aboutSection.current.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    } else if (section === "events") {
      if (eventSection.current) {
        eventSection.current.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    } else if (section === "process") {
      if (processSection.current) {
        processSection.current.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    } else if (section === "contact") {
      const contactSection = document.querySelector("section:last-of-type");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    }
  };
  
//the booking portal needs a verification process so only the accepted users have access to the booking appointments. hence in order to achieve this 
//the provided code must be verified by the system to filter out unwanted users. 
  const verifyAccessCode = async (e) => {
    e.preventDefault();
    if (!accessCode.trim()) {// this ensures that eh trailing space doesnt invailied the correct code
      alert("Please enter an access code.");
      return;
    }
    setIsLoading(true);
    try { // taking the form from the backend, verifiying the code and closing the portal. while keeping track of the timeout, the custom calendermust allow the user to set the slot keeping the loading off alerting the portal is opn
      const response = await fetch(`http://localhost:3000/api/validate-code/${accessCode.trim()}`);
      const { valid } = await response.json();
      if (valid) {
        setBookingOpen(false);
        setTimeout(() => {
          setCalendarOpen(true);
          setIsLoading(false);
        }, 300);
      } else {
        alert("Access Code invalid. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      alert("Error verifying code. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => { //the funciton allows the the first event form to get of the screen once the user moves past the event section. 
      //must functionality : if not made, the user will have harder time to read the content of the website. 
      if (aboutSection.current && eventSection.current) {
        const aboutTop = eventSection.current.getBoundingClientRect().top;//calculating the lenght of the sections. 
        if (aboutTop > window.innerHeight) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // ensures he funcationality of off on of the button on the screen. 
  
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
//here starts the building the branding of the website. 
  return (
    <div className="bg-transparent font-vogueBody">
      <header className="fixed top-0 z-50 mx-auto flex w-full items-center justify-between py-0 px-4">
        <h3 className="text-pink-950 font-vogueBody font-extrabold w-32 h-32 rounded-full flex items-center justify-center text-center text-3xl tracking-wider">
          Chai&Co.
        </h3>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("events")} className="text-pink-950 no-underline font-vogueBody hover:text-pink-700 text-2xl font-bold tracking-wide">
              Events
            </button>
            <button onClick={() => scrollToSection("process")} className="text-pink-950 no-underline font-bold font-vogueBody hover:text-pink-700 text-2xl tracking-wide">
              Our Process
            </button>
            <button onClick={() => scrollToSection("about")} className="text-pink-950 no-underline font-bold font-vogueBody hover:text-pink-700 text-2xl tracking-wide">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-pink-950 no-underline font-bold font-vogueBody hover:text-pink-700 text-2xl tracking-wide">
              Contact
            </button>
          </nav>

          <div className="hidden md:block">
            <button 
              onClick={() => setBookingOpen(true)} 
              className="bg-pink-950 text-white px-4 py-1.5 rounded-lg font-medium font-vogueBody hover:bg-pink-800 text-lg tracking-wide"
            >
              Book Consultation
            </button>
          </div>
        </div>
{/** this end the styling of the top na bar of the website */}

{/** the code below is allowing the hamburger menu to open and close */}
        <button onClick={() => 
          setMenuOpen(!menuOpen)} 
          className="text-pink-950  md:hidden  p-2  z-50" 
          aria-label={(menuOpen && "Close menu") || "Open menu"}
          type="button">
          {menuOpen ? <FaTimes size={30} 
          className="text-white" /> : <FaBars size={30} className="text-pink-950" />}
        </button>
      </header>
          {/**this the toggle funcationality of the website which makes the inquirfy form button that will vanish once user scrolled move past the event section */}
      {showButton && (
        <div 
        ref={buttonRef} 
        className="fixed left-1/2 bottom-4 transform -translate-x-1/2 transition-all duration-300 z-30" 
        style={{ width: 'max-content' }}>
          <button
            onClick={() => setConsultationOpen(!consultationOpen)}
            className="group bg-pink-950 text-white px-12 py-5 rounded-full font-vogueBody text-xl hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-pink-900/40 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto mb-8"
            aria-label={consultationOpen && "Close Consultation" || "Open Consultation"}
            type="button"
          >
            {consultationOpen && <>
              <FaTimes />
              Close Consultation
            </> || "Event Inquiry Form"}

          </button>
        </div>
      )}
{/**his par tof the code takes care of the access code portal made? while verifying the code the website must commiunicate the rendering witht eh users. the portal enures the behavoir of the portal changes as the correct access code is enetered */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col items-center" 
          onClick={(e) => e.stopPropagation()}>           {/**this ensures that the portals dont close the moment the user clicks on the portal */}

            <button 
            onClick={() => setBookingOpen(false)} 
            className="self-end text-gray-500 hover:text-pink-900 mb-2" 
            aria-label="Close Meeting">
              <FaTimes size={20} />
            </button>
            <h1 className="text-2xl font-vogueBody font-bold mb-6 w-full text-center text-pink-800">Booking Access Locked</h1>
            <div className="flex items-center justify-center w-full h-48 mb-6">
              <FaLock 
              className="text-pink-900 text-9xl animate-spin-slow" />
            </div>
            <form onSubmit={verifyAccessCode} className="w-full">
              <div className="mb-4">
                <label htmlFor="accessCode" className="block text-base font-light text-pink-900 text-center mb-1 font-vogueBody">
                  We have sent you the access code. If not in your inbox, check your spam folder.
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 font-vogueBody"
                  placeholder="Spill your code"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`group bg-pink-950 text-white px-12 py-10 rounded-full font-vogueBody text-xl hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-900/40 transform hover:scale-105 flex items-center justify-center gap-3 
                    ${isLoading && 'opacity-70 cursor-not-allowed'}`}
                  disabled={isLoading}
                >
                  {isLoading && 'Verifying...' || 'Verify Code'}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {calendarOpen && (
        <div className="fixed mx-auto inset-0 z-[60] bg-white/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="flex justify-end mb-36">
            <button 
            onClick={() => setCalendarOpen(false)} 
            className="p-2 text-pink-900 hover:bg-pink-100 rounded-full transition-colors">
              <FaTimes 
              size={24} />
            </button>
          </div>
          <div className="max-w-md mx-auto">
            <BookingAppointment 
            accessCode={accessCode} />
          </div>
        </div>
      )}

      {consultationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col items-center" 
          onClick={e => e.stopPropagation()}>
            <button 
            onClick={() => setConsultationOpen(false)} 
            className="self-end text-gray-500 hover:text-pink-900 mb-2"
             aria-label="Close Consultation">
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 w-full text-center font-vogueBody">Consultation</h2>
            <ConsultationForm onClose={() => setConsultationOpen(false)}
            onCompleted={() => {
              alert("Form submitted successfully!");
            }}
            />
          </div>
        </div>
      )}
{/**handles the functionality of the hamburger menu when teh uer is opening the website on the phone */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-[50vw] sm:w-[80vw] h-full bg-pink-950 border-l rounded-l-2xl border-pink-200 shadow-lg flex flex-col items-center gap-4 p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setMenuOpen(false)} className="self-end">
              <FaTimes size={24} className="text-pink-950" />
            </button>
            <button onClick={() => scrollToSection("events")} className="text-white no-underline font-normal font-poppins hover:text-pink-300 text-xl tracking-wide">
              Events
            </button>
            <button onClick={() => scrollToSection("process")} className="text-white no-underline font-bold font-vogueBody hover:text-pink-300 text-xl tracking-wide">
              Our Process
            </button>
            <button onClick={() => scrollToSection("about")} className="text-white no-underline font-bold font-vogueBody hover:text-pink-300 text-xl tracking-wide">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-white no-underline font-bold font-vogueBody hover:text-pink-300 text-xl tracking-wide">
              Contact
            </button>
            <button onClick={() => { 
              setBookingOpen(true); 
              setMenuOpen(false); }} 
              className="text-white no-underline font-bold font-vogueBody hover:text-pink-300 text-xl tracking-wide">
              Book Consultation
            </button>
          </div>
        </div>
      )}

{/** the tailwind used below is used to make the editorial style page which is right belwo the main picture.  */}
<section 
  className="h-[100vh] bg-cover bg-center" 
  style={{ 
    backgroundImage: "url('/rosenew.jpeg')",
    imageRendering: 'crisp-edges'
  }} 
/>
<section className="w-full py-24 flex justify-center px-4 md:px-8 lg:px-12 perspective-[2000px] bg-gradient-to-b mt-20">
  <div className="relative max-w-7xl w-full flex justify-center group">
    
    {/**Left side of the editrioal */}
    <div className="w-1/2 p-8 md:p-12 bg-white rounded-l-2xl shadow-lg border border-neutral-100/70 transform -rotate-y-3 origin-right transition-all duration-700 group-hover:-rotate-y-5 group-hover:shadow-xl">
      <span className="font-vogueBody text-xs tracking-widest text-neutral-400 mb-2 block">CHAPTER I · THE WELCOME</span>
      <h2 className="text-4xl md:text-5xl font-vogueHeading font-light text-pink-950 mb-6 leading-tight">
        Where Luxury is <br /><span className="italic">Imagined, and Memories are Made</span>
      </h2>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8"></div>
      <p className="text-pink-900 text-base md:text-lg leading-relaxed mb-8 font-vogueBody tracking-wide">
        At Chai&Co, we don't just plan events—we craft unforgettable atmospheres. Each tablescape is designed with care, combining elegant linens, curated florals, and refined details that reflect your vision. From the first consultation, we work closely with you to bring your ideas to life, creating a seamless, personalized experience from start to finish.
      </p>
    </div>

    {/**Right side of the editorial*/}
    <div className="w-1/2 p-8 md:p-12 bg-white rounded-r-2xl shadow-lg border border-neutral-100/70 transform rotate-y-3 origin-left transition-all duration-700 group-hover:rotate-y-5 group-hover:shadow-xl ml-[-1px]">
      <p className="text-pink-900 text-base md:text-lg leading-relaxed mb-6 font-vogueBody tracking-wide">
        Our culinary team designs menus that are both artful and memorable, pairing flavors with precision and style. Every detail—from décor to service to cleanup—is handled by our team, so you can relax, enjoy the celebration, and focus on making memories. With Chai&Co, luxury is effortless and every moment is thoughtfully curated.
      </p>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8"></div>
      <p className="text-pink-950 text-lg md:text-xl mb-8 font-vogueBody italic tracking-wide">
        We don't plan events, <span className="font-medium">we craft atmospheres</span> — Iqra & Amna
      </p>
      <div className="overflow-hidden rounded-lg aspect-[4/3] transition-all duration-1000">
        <img 
          src="/red.jpg" 
          className="object-cover w-full h-full transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-105" 
          alt="ChaiNCo event setup"
        />
      </div>
    </div>

   
    <div className="absolute left-1/2 top-0 h-full w-[0.5px] bg-gradient-to-b from-transparent via-neutral-300/70 to-transparent -translate-x-1/2"></div>
    
    {/** must ensure shadows in order to make it look like 3d  */}
    <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.03)]"></div>
  </div>
</section>

{/**Event */}
<div ref={eventSection} className="w-full py-16 relative bg-white">
  <div className="relative mx-auto max-w-7xl">
    <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4">
      <div className="w-full h-full bg-gradient-to-br from-gray-200/50 to-gray-100/30 rounded-xl shadow-2xl"></div>
    </div>

          
          <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <Catalogs />
          </div>
        </div>
      </div>

      <div className="h-28 w-full"></div>
      
{/**this is the our ptocess banner */}
<section ref={processSection} className="w-full py-24 relative bg-white max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
  <div className="text-center mb-16">
    <h3 className="text-4xl font-vogueHeading text-pink-950 font-bold tracking-tight mb-4">
      Our Process
    </h3>
    <p className="text-pink-700 text-lg md:text-xl font-vogueBody">
      From inquiry to consultation, we guide you every step of the way.
    </p>
  </div>

  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {[
      {
        number: "1",
        title: "Share Your Vision",
        text: "Submit the Event Inquiry Form to introduce your ideas and aspirations. Every submission is received with thoughtfulness, ensuring your vision is fully understood."
      },
      {
        number: "2",
        title: "Thoughtful Review & Confirmation",
        text: "Our team carefully evaluates each submission. Those selected receive a confirmation email with an access code, reflecting the dedication and care given to every potential collaboration."
      },
      {
        number: "3",
        title: "Book Your Consultation",
        text: "The access code unlocks the consultation scheduling, giving you a dedicated space to discuss your event in detail. Each appointment is organized to provide focused, meaningful dialogue."
      },
      {
        number: "4",
        title: "Personalized Planning & Execution",
        text: "Consultations occur over Zoom, allowing us to connect and collaborate closely. From this conversation, we begin a deliberate planning process, ensuring each event receives the attention, creativity, and precision it deserves."
      }
    ].map((step) => (
      <div
        key={step.number}
        className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.25)] 
                   flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-3 "
      >
        <div className="w-16 h-16 flex items-center justify-center bg-pink-950 text-white rounded-full mb-4 text-xl font-bold font-vogueHeading">
          {step.number}
        </div>
        <h4 className="text-pink-900 font-vogueBody font-extrabold text-xl mb-2">
          {step.title}
        </h4>
        <p className="text-pink-700 font-vogueBody font-semibold text-pretty leading-relaxed">
          {step.text}
        </p>
      </div>
    ))}
  </div>
</section>
{/**making a bannar enusring the users get the form one more time without scrolling all the way up to the top of the website */}
      <div className="w-full py-24 bg-pink-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        
       
        <div className="max-w-2xl mx-auto px-4 relative z-10">
         
          <h3 className="text-4xl font-vogueHeading text-white tracking-tight mb-1">
            Build Your Own Experience
          </h3>
          
          <p className="text-pink-200 text-xl mb-8 font-vogueBody">
            Begin your journey to an extraordinary event. Share your ideas and let us handle the magic.
          </p>
    {/**use same logic as the first button made that hides as the user moves belwo the event section */}
          <button
            onClick={() => 
              setConsultationOpen(!consultationOpen)}
            className="group bg-white text-pink-900 px-12 py-5 rounded-full font-vogueHeading text-xl hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-pink-900/40 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto mb-8"
          >
            <span>Event Inquiry Form</span>
          </button>

          <p className="text-pink-300 text-sm font-vogueBody">
            Premium service guaranteed • Personalized approach • Attention to every detail
          </p>
        </div>
      </div>
{/**there must the a extra space betweent eh banners and the about section */}
      <div className="h-44 w-full"></div>
{/**this add the about section to the website */}
      <div ref={aboutSection}
       className="w-full relative">
        <div className="relative mx-auto max-w-7xl">
          <div className="absolute inset-0 -z-10 transform translate-x-4 translate-y-4">
            <div className="w-full h-full bg-gradient-to-br from-gray-200/50 to-gray-100/30 rounded-xl shadow-2xl"></div>
          </div>
          
          <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <About />
          </div>
        </div>
      </div>
      <section className="w-full py-24 bg-pink-950 text-center relative overflow-hidden">
  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>

  {/**this starts the contact section of the website and amke the end of the website */ }
  <div className="max-w-2xl mx-auto px-4 relative z-10">
    <h3 className="text-4xl font-vogueHeading text-white tracking-tight mb-1">
      Get in Touch
    </h3>
    <p className="text-pink-200 text-xl mb-8 font-vogueBody">
      Have any questions or need help with the process?  
      Reach out to us directly below.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <a
        href="https://www.instagram.com/chaiandcoevents/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group bg-white text-pink-900 px-12 py-5 rounded-full font-vogueHeading text-xl hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-pink-900/40 transform hover:scale-105 flex items-center justify-center gap-3"
      >
        Instagram
      </a>

      <a
        href="mailto:yourname@gmail.com"
        className="group bg-white text-pink-900 px-12 py-5 rounded-full font-vogueHeading text-xl hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-pink-900/40 transform hover:scale-105 flex items-center justify-center gap-3"
      >
        chaiandcoevents@gmail.com
      </a>
    </div>
  </div>
</section>

    </div>  
  );
};

export default Navbar;