import { AiFeaturesPage } from "@/components/AiFeaturePage";
import BentoPage from "@/components/BentoPage";
import FeaturePage from "@/components/FeaturePage";
import { Footer } from "@/components/Footer";
import HomePage from "@/components/HomePage";
import { Navbar } from "@/components/Navbar";
import CalculatorsPage from "./calculators/page";
import OurPartners from "@/components/OurPartners";
import { Faq } from "@/components/Faq";

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      <BentoPage />
      <FeaturePage />
      <AiFeaturesPage />
      <OurPartners />
      <Faq />
      <Footer />
    </div>
  );
}

export default App;
