import { useState } from "react";
import '/src/components/BallotForm.css'

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
            <button className="ballot-submit-btn" onClick={handleSubmit}>
                Generate My Ballot →
            </button>
        </div>
    );
}

export default BallotForm;