import { useState } from "react";
import "./BallotForm.css";

function BallotForm({ ballot, onSelectionChange }) {
  const [selections, setSelections] = useState({});

  const handleChange = (office, candidate) => {
    const updated = { ...selections, [office]: candidate };
    setSelections(updated);
    onSelectionChange(updated);
  };

  return (
    <div className="ballot-form">
      <h2>Make Your Selections</h2>
      {ballot.map(({ office, candidates }) => (
        <div key={office} className="ballot-form-field">
          <label>{office}</label>
          <select
            value={selections[office] || ""}
            onChange={(e) => handleChange(office, e.target.value)}
          >
            <option value="">-- Select a candidate --</option>
            {candidates.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default BallotForm;