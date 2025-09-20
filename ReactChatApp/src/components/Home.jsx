import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  BookOpen,
  Target,
  Star,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  // Study images array
  const studyImages = [
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Students collaborating",
    },
    {
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Online learning",
    },
    {
      url: "https://images.unsplash.com/photo-1581726690015-c9861fa5057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Study group",
    },
    {
      url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Library study",
    },
    {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Digital learning",
    },
  ];

  // Entrance animations
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.transform = "translateX(-50px)";
      textRef.current.style.opacity = "0";

      setTimeout(() => {
        textRef.current.style.transition =
          "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease";
        textRef.current.style.transform = "translateX(0)";
        textRef.current.style.opacity = "1";
      }, 300);
    }

    if (buttonRef.current) {
      buttonRef.current.style.transform = "translateY(30px)";
      buttonRef.current.style.opacity = "0";

      setTimeout(() => {
        buttonRef.current.style.transition =
          "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease";
        buttonRef.current.style.transform = "translateY(0)";
        buttonRef.current.style.opacity = "1";
      }, 600);
    }

    if (swiperRef.current) {
      swiperRef.current.style.transform = "translateX(50px)";
      swiperRef.current.style.opacity = "0";

      setTimeout(() => {
        swiperRef.current.style.transition =
          "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease";
        swiperRef.current.style.transform = "translateX(0)";
        swiperRef.current.style.opacity = "1";
      }, 900);
    }
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 pt-20">
    {/* Main Hero Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div ref={textRef} className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>Trusted by 10+ Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Perfect{" "}
              <span className="text-orange-600">
                Study Partner
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Learning alone is challenging. Connect with motivated study
              partners who share your goals, skills, and schedule for better
              results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/auth/signup")}
              className="group px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-orange-500">
                10+
              </div>
              <div className="text-sm text-gray-300">Active Students</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-orange-500">
                95%
              </div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-orange-500">
                24/7
              </div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
          </div>
        </div>

        {/* Right Swiper */}
        <div ref={swiperRef} className="relative">
          <div className="relative w-full max-w-lg mx-auto">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="relative rounded-full overflow-hidden shadow-2xl w-64 h-64 sm:w-80 sm:h-80 md:w-115 md:h-115 mx-auto"
            >
              {studyImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-115 md:h-115 mx-auto">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>

    {/* Features Preview */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-orange-500 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
          <p className="text-gray-300">
            Our AI finds study partners based on your learning style,
            schedule, and academic goals.
          </p>
        </div>

        <div className="text-center p-6 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-orange-500 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Goal Tracking</h3>
          <p className="text-gray-300">
            Set and track learning objectives together with built-in progress
            monitoring tools.
          </p>
        </div>

        <div className="text-center p-6 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-orange-500 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Study Resources</h3>
          <p className="text-gray-300">
            Access shaorange notes, practice tests, and collaborative study
            materials in one place.
          </p>
        </div>
      </div>
    </div>
  </section>

  );
};

export default Home;