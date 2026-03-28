import "../styles/Highlights.css";

const highlights = [
  {
    id: 1,
    title: "🔍 Easy Access",
    desc: "Explore the platform without any login.",
  },
  {
    id: 2,
    title: "🎯 Transparent Draw",
    desc: "Fair and automated draw system every month.",
  },
  {
    id: 3,
    title: "❤️ Real Impact",
    desc: "Support real charities while you play.",
  },
];

const Highlights = () => {
  return (
    <section className="highlights container">
      <h2>✨ Why WinKind?</h2>

      <div className="highlight-grid">
        {highlights.map((item) => (
          <div key={item.id} className="highlight-card">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;