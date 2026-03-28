import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Charities from "../components/Charities";
import SubscriptionInfo from "../components/SubscriptionInfo";
import Highlights from "../components/Highlights";
import "../styles/Home.css";

const Home = () => {
  return (
    <main className="home">

      <section className="section section-green">
        <Hero />
      </section>

      <section className="section alt">
        <Highlights />
      </section>

      <section className="section">
        <HowItWorks />
      </section>

      <section className="section alt">
        <SubscriptionInfo />
      </section>

      <section className="section">
        <Charities />
      </section>

      <section className="section section-green">
        <CTA />
      </section>

    </main>
  );
};

export default Home;