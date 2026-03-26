import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Charities from "../components/Charities";
import SubscriptionInfo from "../components/SubscriptionInfo";
import Highlights from "../components/Highlights";
import "../styles/Home.css";

const Home = () => {
return (
<>
  {/* HERO */} 
  <div className="section section-green"> 
    <Hero /> 
  </div>

  {/* WHY WIN KIND (LIGHT BG) */}
  <div className="section alt">
    <Highlights />
  </div>

  {/* HOW IT WORKS */}
  <div className="section">
    <HowItWorks />
  </div>

  {/* SUBSCRIPTION */}
  <div className="section alt">
    <SubscriptionInfo />
  </div>

  {/* CHARITIES */}
  <div className="section">
    <Charities />
  </div>

  {/* FINAL CTA (GREEN) */}
  <div className="section section-green">
    <CTA />
  </div>
</>


);
};

export default Home;
