import { useEffect, useState } from "react";
import { getMyWinnings, uploadProof } from "../services/winnerService";

const Winnings = () => {
  const [winnings, setWinnings] = useState([]);
  const [files, setFiles] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    const data = await getMyWinnings();
    setWinnings(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILE CHANGE =================
  const handleFileChange = (id, file) => {
    setFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  // ================= HANDLE UPLOAD =================
  const handleUpload = async (id) => {
    const file = files[id];

    if (!file) {
      alert("Select a file first");
      return;
    }

    try {
      setLoadingId(id);

      await uploadProof(id, file);

      alert("Proof uploaded successfully");

      // remove uploaded file from state
      setFiles((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      fetchData();

    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= UI =================
  return (
    <div className="card">
      <h3>🏆 Your Winnings</h3>

      {winnings.length === 0 ? (
        <p>No winnings yet</p>
      ) : (
        winnings.map((w) => (
          <div key={w.id} className="winner-item">

            <p>
              Match: {w.match_count} | ₹{w.prize_amount}
            </p>

            <p>Status: {w.status}</p>

            {/* ✅ Show uploaded */}
            {w.proof && (
              <p style={{ color: "green" }}>Proof uploaded ✅</p>
            )}

            {/* 🔥 Upload only if pending */}
            {w.status === "pending" && (
              <>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(w.id, e.target.files[0])
                  }
                />

                <button
                  onClick={() => handleUpload(w.id)}
                  disabled={loadingId === w.id}
                >
                  {loadingId === w.id ? "Uploading..." : "Upload Proof"}
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