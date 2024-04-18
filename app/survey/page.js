'use client'

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";

function LIFFPage() {

  const [profile, setProfile] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);

  useEffect(() => {
    liff.use(new LiffMockPlugin());

    async function initLIFF() {
      try {
        await liff.init({ liffId: process.env.LIFF_ID, mock: true, });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        const userProfile = await liff.getProfile();
        if (!userProfile.pictureUrl) {
          userProfile.pictureUrl = 'https://winterbear.in/wp-content/uploads/2023/02/LF-CHARACTERS-01.webp';
        }
        setProfile(userProfile);
      } catch (error) {
        console.error("Liff initialize failed:", error);
      }
    };
    initLIFF();

  }, []);

   const qrScan = async () => {
    try {
      // const result = await liff.scanCode();
      // const response = await fetch(`${result}`);
      const response = await fetch(`http://127.0.0.1:8000/api/survey/1`);
      const data = await response.json();
      setSurveyData(data);
      setQrScanned(true);
    } catch (error) {
      console.error("QR scan failed:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.userId = profile.userId;
    data.displayName = profile.displayName;
    data.survey_id = surveyData.id;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/survey/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        alert('Survey submitted successfully');
      } else {
        alert('Failed to submit survey');
      }
    } catch (error) {
      console.error("Survey submission failed:", error);
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Survey</h1>
        {profile && (
          <div className="bg-gray-200 p-4 rounded">
            <img
              src={profile.pictureUrl}
              alt="picture"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
            <p className="text-lg">Name: {profile.displayName}</p>
            <p className="text-lg">User ID: {profile.userId}</p>
          </div>
        )}
      </div>
      <div className="container mx-auto">
        <button
          onClick={qrScan}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Scan QR
        </button>
      </div>
      {qrScanned && (<div className="container mx-auto bg-gray-200 p-4 rounded">
        <form className="mt-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">{surveyData.name}</h2>
          <p className="mb-4">{surveyData.description}</p>
          {surveyData.questions.map((item) => (
            <div key={item.id} className="mb-4">
              <label className="block text-lg font-bold">{item.label}</label>
              {item.type === 'scale' ? (
                <input
                  type="range"
                  name={item.name}
                  required={item.required}
                  className="w-full"
                />
              ) : (
                <input
                  type="text"
                  name={item.name}
                  required={item.required}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </form>
      </div>)}
      <div className="container mx-auto">
        <button
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        type='submit'>
          Submit
        </button>
      </div>
    </>
  );

};

export default LIFFPage;
