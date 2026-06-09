import { useState } from "react";

function BallotForm({ ballot, onSubmit }) {
  const [selections, setSelections] = useState({});

  const handleChange = (office, candidate) => {
    setSelections((prev) => ({ ...prev, [office]: candidate }));
  };

  const handleSubmit = () => {
    const allSelected = ballot.every((item) => selections[item.office]);
    if (!allSelected) {
      alert("Please select a candidate for every office before submitting.");
      return;
    }
    onSubmit(selections);
  };

  return (
    <div>
      <h2>Make Your Selections</h2>
      {ballot.map(({ office, candidates }) => (
        <div key={office} style={{ marginBottom: "1.5rem" }}>
          <label><strong>{office}</strong></label>
          <br />
          <select
            value={selections[office] || ""}
            onChange={(e) => handleChange(office, e.target.value)}
            style={{ marginTop: "0.5rem", fontSize: "1rem", padding: "0.5rem" }}
          >
            <option value="">-- Select a candidate --</option>
            {candidates.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={handleSubmit} style={{ marginTop: "1rem", fontSize: "1rem", padding: "0.5rem 1.5rem" }}>
        Submit
      </button>
    </div>
  );
}

export default BallotForm;