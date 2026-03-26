import "../styles/Charities.css";
import smileImg from "../assets/charities/smile.jpg";
import helpageImg from "../assets/charities/helpage.jpg";
import goonjImg from "../assets/charities/goonj.jpg";

/*
Public Charities Section
*/

const charities = [
  {
    name: "Smile Foundation",
    desc: "Supports education for underprivileged Children",
    img: smileImg,
  },
  {
    name: "HelpAge India",
    desc: "Works for elderly care and support",
    img: helpageImg,
  },
  {
    name: "Goonj",
    desc: "Rural development and disaster relief",
    img: goonjImg,
  },
];

const Charities = () => {
return ( 
  <section className="charity-section container"> 
  <h2>❤️ Supported Charities</h2>

  <div className="charity-grid">
    {charities.map((c, index) => (
      <div key={index} className="charity-card">

        <img src={c.img} alt={c.name} />

        <div className="charity-content">
          <h3>{c.name}</h3>
          <p>{c.desc}</p>
        </div>

      </div>
    ))}
  </div>
</section>

);
};

export default Charities;
