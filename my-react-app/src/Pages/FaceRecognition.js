
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import loadingGif from "../Assets/loading3.gif";
import "./FaceRecognition.css";
import ResultPage from "./ResultPage"; // Import the ResultPage component
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function FaceRecognition() {
  const webcamRef = useRef(null);
  const [file, setFile] = useState(null);
  const [webcamActive, setWebcamActive] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);

  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  }, [file]);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = dataURItoBlob(imageSrc);
    const imageFile = new File([blob], "image.jpg", { type: "image/jpeg" });
    setFile(imageFile);
    setWebcamActive(false);
    setImageCaptured(true);
  };

  const retakePicture = () => {
    setFile(null);
    setWebcamActive(true);
    setImageCaptured(false);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please capture an image first.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("File1", file);

    try {
      const response = await axios.post(
        `${window.location.origin}/check-face`,
        // "http://localhost:5001/check-face",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data.result);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  // Render the ResultPage component if result is available and not empty, else render FaceRecognition component
  return result && Object.keys(result).length !== 0 ? (
    <ResultPage result={result} />
  ) : (
    <div className="container">
      <div className="inner-container">
        <h1>Face-Match</h1>
        <div className="webcam-container">
          {webcamActive && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={425}
              height={320}
            />
          )}
        </div>
        {imageCaptured ? (
          <button className="capture-btn" onClick={retakePicture}>
            Retake Picture
          </button>
        ) : (
          <>
            <button className="capture-btn" onClick={captureImage}>
              Login
            </button>
            <Link to="/admin" className="add-user-link">
              Add new user
            </Link>
          </>
        )}

        {file && (
          <div className="preview-container">
            <h2>Preview</h2>
            <img src={URL.createObjectURL(file)} alt="Captured" width={320} />
          </div>
        )}
        {loading ? (
          <div className="loading-container">
            <h2 className="loading-text">Loading...</h2>
            <img className="loading-gif" src={loadingGif} alt="Loading" />
          </div>
        ) : null}
        {result && Object.keys(result).length === 0 && (
          <div className="message-container">
            <p>Face not recognised</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaceRecognition;
