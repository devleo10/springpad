import { ArrowRight, BarChart3, Shield, TrendingUp, Users } from "lucide-react";
import React from "react";
import DemoMutualFunds from "./DemoMutualFunds";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-transparent relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Video */}
        <div className="relative w-4/5 max-w-4xl aspect-video flex items-center justify-center overflow-hidden rounded-lg">
          <video
            className="w-full h-full object-cover"
            src="/heroVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
