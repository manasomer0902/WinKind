import "../styles/How.css";

const steps = [
  {
    id: 1,
    icon: "💳",
    title: "Subscribe",
    desc: "Choose a monthly or yearly plan to participate.",
  },
  {
    id: 2,
    icon: "🎯",
    title: "Enter Scores",
    desc: "Submit your 5 numbers (1–45).",
  },
  {
    id: 3,
    icon: "🎲",
    title: "Monthly Draw",
    desc: "System generates 5 random numbers.",
  },
  {
    id: 4,
    icon: "🏆",
    title: "Win Rewards",
    desc: "Match 3 or more numbers to win prizes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how container">
      <h2>How It Works</h2>

      <div className="steps">
        {steps.map((step) => (
          <div key={step.id} className="step">

            <div className="icon">{step.icon}</div>

            <h4>{step.title}</h4>

            <p>{step.desc}</p>

          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;