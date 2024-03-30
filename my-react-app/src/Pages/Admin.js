import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";
import { Link } from "react-router-dom";
function Admin() {
  const [label, setLabel] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [message, setMessage] = useState("");

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    setFile3(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("File1", file1);
    formData.append("File2", file2);
    formData.append("File3", file3);
    formData.append("label", label);

    try {
      const response = await axios.post(
        `${window.location.origin}/post-face`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading face data:", error);
      setMessage("Error uploading face data");
    }
  };

  return (
    <div className="container">
      <div className="inner-container">
        <h1>Upload Face Data</h1>
        <div className="form"></div>
        <form onSubmit={handleSubmit}>
          <div className="label">
            <label htmlFor="label">Label : </label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={handleLabelChange}
            />
          </div>
          <div className="upload">
            <label htmlFor="file1">File 1:</label>
            <input type="file" id="file1" onChange={handleFile1Change} />
          </div>
          <div className="upload">
            <label htmlFor="file2">File 2:</label>
            <input type="file" id="file2" onChange={handleFile2Change} />
          </div>
          <div className="upload">
            <label htmlFor="file3">File 3:</label>
            <input type="file" id="file3" onChange={handleFile3Change} />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}

        <Link to="/" className="add-user-link">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Admin;
