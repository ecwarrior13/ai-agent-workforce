"use client";
import React, { useState } from "react";

interface TranscriptEntry {
  text: string;
  timestamp: string;
}

function Transcripts() {
  const [transcript, setTranscript] = useState<{
    transcript: TranscriptEntry[];
    cache: string;
  } | null>(null);
  const featureUsageExceeded = false; //tempory need TODO

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 pb-0">
      {/* <Usage featureFlag={FeatureFlag.TRANSCRIPTION} title="Transcription" /> */}

      {!featureUsageExceeded ? (
        <div className="flex max-h-[250px] flex-col gap-2 overflow-y-auto rounded-md p-4">
          {transcript ? (
            transcript.transcript.map((entry, index) => (
              <div className="flex gap-2" key={index}>
                <span className="min-w-[50px] text-sm text-gray-400">
                  {entry.timestamp}
                </span>
                <p className="text-sm text-gray-700">{entry.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No transcription available.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Transcripts;
