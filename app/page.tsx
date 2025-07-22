import { AiFeaturesPage } from "@/components/AiFeaturePage";
import BentoPage from "@/components/BentoPage";
import FeaturePage from "@/components/FeaturePage";
import {Footer} from "@/components/Footer";
import HomePage from "@/components/HomePage";
import { Navbar } from "@/components/Navbar";
import CalculatorsPage from "./calculators/page";

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      <BentoPage />
      <FeaturePage />
      <AiFeaturesPage />
      <Footer />
    </div>
  );
}

export default App;
