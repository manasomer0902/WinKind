import { useEffect, useState } from "react";
import { getMyWinnings, uploadProof } from "../services/winnerService";

const Winnings = () => {
const [winnings, setWinnings] = useState([]);
const [file, setFile] = useState(null);

// ================= FETCH DATA =================
const fetchData = async () => {
const data = await getMyWinnings();
setWinnings(Array.isArray(data) ? data : []);
};

useEffect(() => {
fetchData();
}, []);

// ================= HANDLE UPLOAD =================
const handleUpload = async (id) => {
if (!file) {
alert("Select a file first");
return;
}


await uploadProof(id, file);
alert("Proof uploaded successfully");

setFile(null); // reset file
fetchData();   // refresh data


};

// ================= UI =================
return ( <div className="card"> <h3>🏆 Your Winnings</h3>


  {winnings.length === 0 ? (
    <p>No winnings yet</p>
  ) : (
    winnings.map((w, i) => (
      <div key={i} className="winner-item">

        <p>
          Match: {w.match_count} | ₹{w.prize_amount}
        </p>

        <p>Status: {w.status}</p>

        {/* 🔥 Upload only if pending */}
        {w.status === "pending" && (
          <>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={() => handleUpload(w.id)}>
              Upload Proof
            </button>
          </>
        )}

      </div>
    ))
  )}
</div>


);
};

export default Winnings;
