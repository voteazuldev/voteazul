import React from "react";
import html2canvas from "html2canvas";
import "./BallotCard.css";

function BallotCard({ state, ballot, electionData, electionName, electionDate, selections }) {
    const formattedDate = new Date(electionDate + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    const isMobile = () => {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    const handleDownload = async () => {
        const allSelected = ballot.every((item) => selections[item.office]);
        if (!allSelected) {
            alert("Please select a candidate for every office before downloading.");
            return;
        }

        const original = document.getElementById("ballot-card");
        const clone = original.cloneNode(true);
        clone.removeAttribute("id");
        clone.classList.add("ballot-card-download");

        const entries = Object.entries(selections);
        if (entries.length > 6) {
            const candidatesEl = clone.querySelector(".ballot-card-candidates");
            candidatesEl.classList.add("ballot-card-candidates-grid");
        }

        clone.style.position = "fixed";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";

        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            width: 1080,
            height: 1080,
            scale: 1,
            useCORS: true,
        });

        document.body.removeChild(clone);

        canvas.toBlob(async (blob) => {
            const file = new File([blob], "my-endorsements.png", { type: "image/png" });

            if (isMobile() && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: "My Endorsements",
                    });
                    return;
                } catch (err) {
                    // user cancelled or share failed, fall through to download
                }
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "my-endorsements.png";
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <div className="ballot-card-wrapper">
            <div id="ballot-card" className="ballot-card">
                <div className="ballot-card-header">
                    <div className="ballot-card-eyebrow">My endorsements for the</div>
                    <div className="ballot-card-title">{state} {electionName}</div>
                    <div className="ballot-card-date">{formattedDate}</div>
                </div>
                <div className="ballot-card-candidates">
                    {Object.entries(selections).map(([office, candidate]) => (
                        <div key={office} className="ballot-card-row">
                            <div className="ballot-card-candidate">{candidate}</div>
                            <div className="ballot-card-office">{office}</div>
                        </div>
                    ))}
                </div>
                <div className="ballot-card-footer">
                    <div className="ballot-card-wordmark">
                        <div>
                            <div className="ballot-card-brand-name">VoteAzul.com</div>
                        </div>
                        <img src="/vote_azul_logo.svg" alt="VoteAzul" className="ballot-card-logo" />
                        <div>
                            <div className="ballot-card-brand-tagline">Endorse your Candidates.</div>
                            <div className="ballot-card-brand-tagline">Make a Difference.</div>
                        </div>
                    </div>
                </div>
            </div>
            <button className="ballot-download-btn" onClick={handleDownload}>
                Download Endorsements
            </button>
        </div>
    );
}

export default BallotCard;