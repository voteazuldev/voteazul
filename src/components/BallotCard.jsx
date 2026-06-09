import React from "react";
import html2canvas from "html2canvas";
import "./BallotCard.css";

function BallotCard({ state, electionName, electionDate, selections }) {
  const formattedDate = new Date(electionDate + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const handleDownload = () => {
    const card = document.getElementById("ballot-card");
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = "my-ballot.jpeg";
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();
    });
  };

  return (
    <div className="ballot-card-wrapper">
      <div id="ballot-card" className="ballot-card">
        <div className="ballot-card-header">
          <div className="ballot-card-eyebrow">I'm voting in the</div>
          <div className="ballot-card-title">{state} {electionName}</div>
          <div className="ballot-card-date">{formattedDate}</div>
        </div>
        {Object.entries(selections).map(([office, candidate]) => (
          <div key={office} className="ballot-card-row">
            <div className="ballot-card-candidate">{candidate}</div>
            <div className="ballot-card-office">{office}</div>
          </div>
        ))}
        <div className="ballot-card-footer">
          <div className="ballot-card-brand">voteazul.com</div>
        </div>
      </div>
      <button className="ballot-download-btn" onClick={handleDownload}>
        Download JPEG
      </button>
    </div>
  );
}

export default BallotCard;