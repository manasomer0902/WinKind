import "../styles/How.css";

const HowItWorks = () => {
return ( <section className="how container"> <h2>How It Works</h2>


  <div className="steps">

    <div className="step">
      <div className="icon">💳</div>
      <h4>Subscribe</h4>
      <p>Choose a monthly or yearly plan to participate.</p>
    </div>


    <div className="step">
      <div className="icon">🎯</div>
      <h4>Enter Scores</h4>
      <p>Submit your 5 numbers (1–45).</p>
    </div>


    <div className="step">
      <div className="icon">🎲</div>
      <h4>Monthly Draw</h4>
      <p>System generates 5 random numbers.</p>
    </div>


    <div className="step">
      <div className="icon">🏆</div>
      <h4>Win Rewards</h4>
      <p>Match 3+ numbers to win prizes.</p>
    </div>

  </div>
</section>


);
};

export default HowItWorks;
