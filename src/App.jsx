import { useState, useEffect } from "react";
import BallotCard from "./components/BallotCard";
import BallotForm from "./components/BallotForm";
import './App.css'

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (!selectedState) return;

    const filename = selectedState.toLowerCase().replace(/\s+/g, "-");
    setLoading(true);
    setError(null);
    setElectionData(null);
    setSelections({});

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
      return <p className="status-message">No upcoming election at this time. Check back later.</p>;
    }

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    if (ballot.length === 0) {
      return (
        <div>
          <div className="election-badge">
            <div className="election-badge-name">{name}</div>
            <div className="election-badge-date">{formattedDate}</div>
          </div>
          <p className="status-message">Candidates not yet announced. Check back closer to election day.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="split-screen">
          <div className="glass-panel">
            <BallotForm
              ballot={ballot}
              onSelectionChange={(selections) => setSelections(selections)}
            />
          </div>
          <div className="glass-panel">
            <BallotCard
              state={selectedState}
              ballot={ballot}
              electionData={electionData}
              electionName={electionData.name}
              electionDate={electionData.date}
              selections={selections}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header className="app-header">
        <div>
          <div className="app-logo">VOTEAZUL</div>
          <div className="app-tagline">Your voice. Your ballot. Your community.</div>
        </div>
      </header>
      <div className="app-body">
        <div className="app-content-wrapper">
          <div className="state-row">
            <select
              id="state-select"
              className="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">-- Select a state --</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>{renderElectionStatus()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;