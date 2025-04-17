import { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";

const ReviewToast = ({ isInstalled }) => {
  const [showToast, setShowToast] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { API_URL } = useContext(AppContext);

  useEffect(() => {
    localStorage.removeItem("reviewOptionSeen"); //just removing
    const hasSeen = localStorage.getItem("reviewOptionSeen1");
    if (!hasSeen) {
      setTimeout(
        () => {
          setShowToast(true);
        },
        isInstalled ? 5000 : 10000 // if user is installed show after 5 sec else show after 10 sec
      ); //show after 5s
    }
    console.log("isinstalled:", isInstalled);
  }, []);

  const handleSubmit = async () => {
    if (feedback.trim() === "") return;

    //send to backend
    try {
      await fetch(`${API_URL}/send-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedback }),
      });
      localStorage.setItem("reviewOptionSeen1", true);
      setSubmitted(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error sending feedback:", err);
    }
  };
  const handleClose = () => setShowToast(false);

  if (!showToast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        background: "#1f2937",
        color: "#fff",
        padding: "1rem",
        borderRadius: "12px",
        zIndex: 1000,
        maxWidth: "300px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif",
      }}
    >
      {/* ❌ Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "-20px",
          left: "-10px",
          background: "transparent",
          color: "red",

          borderRadius: "50px",

          fontSize: "30px",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        X
      </button>

      <p
        style={{
          position: "absolute",
          top: "-10px",
          right: "0",
          background: "#6110af",
          color: "white",
          borderRadius: "0 10px 0 10px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        <em>👋 Hello, I'm your classmate Imran!</em>
      </p>
      {!submitted ? (
        <>
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "1rem",
              textAlign: "justify",
            }}
          >
            <em>
              {" "}
              Could you please give me feedback on whether this app is helpful
              to you or not? (Please specify your name)
            </em>
          </p>
          <textarea
            rows="3"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #444",
              marginBottom: "0.5rem",
              resize: "none",
            }}
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.4rem 0.8rem",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </>
      ) : (
        <p>🎉 Thank you so much for your feedback!</p>
      )}
    </div>
  );
};
export default ReviewToast;
