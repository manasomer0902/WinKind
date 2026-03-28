const DrawResult = ({ draw }) => {

  if (!draw) {
    return (
      <div className="card">
        <h3>🎯 Latest Draw Result</h3>
        <p>No draw available yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>🎯 Latest Draw Result</h3>

      <div style={{ marginTop: "10px" }}>
        {draw.numbers?.map((num) => (
          <span
            key={num}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              background: "#0a7f3f",
              color: "white",
              borderRadius: "50%",
            }}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DrawResult;