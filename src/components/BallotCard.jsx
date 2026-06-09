import React from "react";
import html2canvas from "html2canvas";
import "./BallotCard.css";

function BallotCard({ state, ballot, electionData, electionName, electionDate, selections }) {
    const formattedDate = new Date(electionDate + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    const handleDownload = () => {
        const allSelected = ballot.every((item) => selections[item.office]);
        if (!allSelected) {
            alert("Please select a candidate for every office before downloading.");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, "#003366");
        gradient.addColorStop(1, "#3c1478");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);

        const pad = 80;
        const usableWidth = 1080 - pad * 2;

        const wrapText = (text, fontSize, maxWidth) => {
            ctx.font = `700 ${fontSize}px Inter, sans-serif`;
            const words = text.split(" ");
            const lines = [];
            let line = "";
            words.forEach((word) => {
                const test = line + word + " ";
                if (ctx.measureText(test).width > maxWidth && line !== "") {
                    lines.push(line.trim());
                    line = word + " ";
                } else {
                    line = test;
                }
            });
            lines.push(line.trim());
            return lines;
        };

        const titleText = `${state} ${electionName}`;
        const titleLines = wrapText(titleText, 48, usableWidth);

        const entries = Object.entries(selections);
        const twoCol = entries.length > 6;
        const rowCount = twoCol ? Math.ceil(entries.length / 2) : entries.length;
        const rowH = twoCol ? 100 : 90;
        const candidateH = rowCount * rowH;

        const eyebrowH = 36;
        const titleH = titleLines.length * 60;
        const dateH = 44;
        const dividerH = 40;
        const footerH = 80;

        const totalH = eyebrowH + titleH + dateH + dividerH + candidateH + footerH;
        let y = (1080 - totalH) / 2;

        // Eyebrow
        ctx.font = "500 26px Inter, sans-serif";
        ctx.fillStyle = "#99ccff";
        ctx.letterSpacing = "3px";
        ctx.fillText("MY ENDORSEMENTS FOR THE", pad, y += eyebrowH);
        ctx.letterSpacing = "0px";

        // Title
        ctx.font = "700 48px Inter, sans-serif";
        ctx.fillStyle = "#ffffff";
        titleLines.forEach((line) => {
            y += 60;
            ctx.fillText(line, pad, y);
        });

        // Date
        ctx.font = "400 30px Inter, sans-serif";
        ctx.fillStyle = "rgba(153, 204, 255, 0.7)";
        ctx.fillText(formattedDate, pad, y += dateH);

        // Divider
        y += dividerH;
        ctx.strokeStyle = "rgba(153, 204, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(1080 - pad, y);
        ctx.stroke();

        // Candidates
        const colWidth = (usableWidth - 40) / 2;
        const colRightX = pad + colWidth + 40;

        if (twoCol) {
            const leftEntries = entries.filter((_, i) => i % 2 === 0);
            const rightEntries = entries.filter((_, i) => i % 2 === 1);

            for (let i = 0; i < rowCount; i++) {
                const rowY = y + i * rowH;

                if (leftEntries[i]) {
                    const [office, candidate] = leftEntries[i];
                    ctx.font = "700 36px Inter, sans-serif";
                    ctx.fillStyle = "#ffffff";
                    ctx.letterSpacing = "0px";
                    ctx.fillText(candidate, pad, rowY + 44);
                    ctx.font = "500 20px Inter, sans-serif";
                    ctx.fillStyle = "rgba(153, 204, 255, 0.75)";
                    ctx.letterSpacing = "2px";
                    ctx.fillText(office.toUpperCase(), pad, rowY + 72);
                    ctx.letterSpacing = "0px";
                }

                if (rightEntries[i]) {
                    const [office, candidate] = rightEntries[i];
                    ctx.font = "700 36px Inter, sans-serif";
                    ctx.fillStyle = "#ffffff";
                    ctx.letterSpacing = "0px";
                    ctx.fillText(candidate, colRightX, rowY + 44);
                    ctx.font = "500 20px Inter, sans-serif";
                    ctx.fillStyle = "rgba(153, 204, 255, 0.75)";
                    ctx.letterSpacing = "2px";
                    ctx.fillText(office.toUpperCase(), colRightX, rowY + 72);
                    ctx.letterSpacing = "0px";
                }
            }
            y += candidateH;
        } else {
            entries.forEach(([office, candidate]) => {
                ctx.font = "700 40px Inter, sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.letterSpacing = "0px";
                ctx.fillText(candidate, pad, y += 52);
                ctx.font = "500 22px Inter, sans-serif";
                ctx.fillStyle = "rgba(153, 204, 255, 0.75)";
                ctx.letterSpacing = "2px";
                ctx.fillText(office.toUpperCase(), pad, y += 32);
                ctx.letterSpacing = "0px";
                y += 6;
            });
        }

        // Footer divider
        y += 20;
        ctx.strokeStyle = "rgba(153, 204, 255, 0.3)";
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(1080 - pad, y);
        ctx.stroke();

        // Brand line
        ctx.font = "500 28px Inter, sans-serif";
        ctx.fillStyle = "#99ccff";
        ctx.letterSpacing = "1px";
        const brandText = "Make a difference at VoteAzul.com";
        const brandWidth = ctx.measureText(brandText).width;
        ctx.fillText(brandText, (1080 - brandWidth) / 2, y += footerH - 20);

        const link = document.createElement("a");
        link.download = "my-ballot.jpeg";
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
    };

    return (
        <div className="ballot-card-wrapper">
            <div id="ballot-card" className="ballot-card">
                <div className="ballot-card-header">
                    <div className="ballot-card-eyebrow">My endorsements for the</div>
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
                    <div className="ballot-card-brand">Make a difference at VoteAzul.com</div>
                </div>
            </div>
            <button className="ballot-download-btn" onClick={handleDownload}>
                Download JPEG
            </button>
        </div>
    );
}

export default BallotCard;