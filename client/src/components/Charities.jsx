import "../styles/Charities.css";
import smileImg from "../assets/charities/smile.jpg";
import helpageImg from "../assets/charities/helpage.jpg";
import goonjImg from "../assets/charities/goonj.jpg";

const charities = [
  {
    id: "smile",
    name: "Smile Foundation",
    desc: "Supports education for underprivileged children",
    img: smileImg,
  },
  {
    id: "helpage",
    name: "HelpAge India",
    desc: "Works for elderly care and support",
    img: helpageImg,
  },
  {
    id: "goonj",
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
        {charities.map((c) => (
          <div key={c.id} className="charity-card">

            <img src={c.img} alt={`${c.name} charity`} />

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