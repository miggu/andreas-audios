import { useState } from "react";
import andreaLogo from "/andrea.png";
import { AssemblyAI } from "assemblyai";
import "./App.css";

const KEY = import.meta.env.VITE_ASSEMBLY_API_KEY;

const client = new AssemblyAI({
  apiKey: KEY,
});

function App() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(KEY);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setTranscript("");

    try {
      // Create transcript using the uploaded file URL
      const params = {
        audio: file,
        language_detection: true,
        expected_languages: ["en", "es"],
        speech_model: "universal",
      };
      const result = await client.transcripts.transcribe(params);

      // result.text may be empty initially; polling or webhook recommended for long jobs.
      setTranscript(
        result.text || "Transcript created. Poll for updates or use webhooks."
      );
      console.log(result);
    } catch (err) {
      console.error(err);
      setTranscript("Error: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={andreaLogo} className="logo" alt="Andrea logo" />
        </a>
      </div>
      <h1>Andrea's Audios</h1>
      <div className="card">
        <p className="explanation">Drop the audio file from whatsapp</p>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        {loading ? (
          <p>Transcribing...</p>
        ) : (
          <p>{transcript || "Choose an audio file to transcribe."}</p>
        )}
      </div>
    </>
  );
}

export default App;
