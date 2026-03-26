import { useEffect, useState } from "react";
import { getLatestDraw } from "../services/drawService";

const DrawResult = () => {
  const [draw, setDraw] = useState(null);

  useEffect(() => {
    const fetchDraw = async () => {
      const data = await getLatestDraw();
      setDraw(data);
    };

    fetchDraw();
  }, []);

  if (!draw) return null;

  return (
    <div className="card">
      <h3>🎯 Latest Draw Result</h3>

      <div style={{ marginTop: "10px" }}>
        {draw.numbers?.map((num, i) => (
          <span
            key={i}
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