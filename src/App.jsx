import { useState, useEffect } from "react";
import BallotCard from "./components/BallotCard";
import BallotForm from "./components/BallotForm";

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selections, setSelections] = useState(null);

  useEffect(() => {
    if (!selectedState) return;

    const filename = selectedState.toLowerCase().replace(/\s+/g, "-");
    setLoading(true);
    setError(null);
    setElectionData(null);

    fetch(`/data/${filename}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No data found for this state.");
        return res.json();
      })
      .then((data) => {
        setElectionData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedState]);

  const renderElectionStatus = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>No upcoming election data for this state. Check back later.</p>;
    if (!electionData) return null;

    const { name, date, ballot } = electionData;

    if (!date) {
      return <p>No upcoming election at this time. Check back later.</p>;
    }

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    if (ballot.length === 0) {
      return (
        <p>
          <strong>{name}</strong> — {formattedDate}<br />
          Candidates not yet announced. Check back closer to election day.
        </p>
      );
    }

    return (
      <div>
        <p><strong>{name}</strong> — {formattedDate}</p>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          <BallotForm
            ballot={ballot}
            onSubmit={(selections) => setSelections(selections)}
          />
          {selections &&
            <BallotCard
              state={selectedState}
              electionName={electionData.name}
              electionDate={electionData.date}
              selections={selections}
            />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>VoteAzul</h1>
      <label htmlFor="state-select"><strong>Select your state:</strong></label>
      <br />
      <select
        id="state-select"
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        style={{ marginTop: "0.5rem", fontSize: "1rem", padding: "0.5rem" }}
      >
        <option value="">-- Select a state --</option>
        {STATES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div style={{ marginTop: "1.5rem" }}>
        {renderElectionStatus()}
      </div>
    </div>
  );
}

export default App;