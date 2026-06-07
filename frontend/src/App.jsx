
import React, { useState , useEffect } from "react";
import DirectoryGrid from "./components/DirectoryGrid";

function App() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  // simulation API (garanti marche)
  useEffect(() => {
    setTimeout(() => {
      setAlumni([
        {
          _id: "1",
          fullName: "Jean Yves",
          jobTitle: "Développeur Full Stack",
          company: "Orange Cameroun",
          skills: ["React", "Node.js", "MongoDB"],
          contactEmail: "jean@example.com"
        },
        {
          _id: "2",
          fullName: "Aminou Djoda",
          jobTitle: "Réseaux & Télécom",
          company: "MTN",
          skills: ["Cisco", "4G", "5G"],
          contactEmail: "aminou@example.com"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>
        Annuaire des Alumni
      </h2>
      

      <DirectoryGrid data={alumni} loading={loading} />
    </div>
  );
}

export default App;