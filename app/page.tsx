import { AiFeaturesPage } from "@/components/AiFeaturePage";
// import BentoPage from "@/components/BentoPage";
import FeaturePage from "@/components/FeaturePage";
import { Footer } from "@/components/Footer";
import HomePage from "@/components/HomePage";
import { Navbar } from "@/components/Navbar";
import OurPartners from "@/components/OurPartners";
import { Faq } from "@/components/Faq";
import TaglinePage from "@/components/TaglinePage";
import TopPerformingFunds from "@/components/topPerformingFunds";
import { NewsPage } from "@/components/NewsPage";

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      <TaglinePage />
      {/* <BentoPage /> */}
      <FeaturePage />
      <AiFeaturesPage />
      <TopPerformingFunds/>
      <NewsPage />
      <OurPartners />
      <Faq />
      <Footer />
    </div>
  );
}

export default App;
