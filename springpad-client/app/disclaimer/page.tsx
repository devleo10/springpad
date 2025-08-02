import DisclaimerPage from "@/components/DisclaimerPage";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import React from "react";

function page() {
  return (
    <div>
      <Navbar />
      <DisclaimerPage />
      <Footer />
    </div>
  );
}

export default page;
