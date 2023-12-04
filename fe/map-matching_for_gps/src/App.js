import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./style.css";

function App() {
  const appTitle = "Map matching for GPS";
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectValue, setSelectValue] = useState("option1");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      console.log("Accepted");
      setIsFlipped(true);
      setFile(acceptedFiles[0]);
    },
  });

  const handleRunClick = async () => {
    const formData = new FormData();
    formData.append("file", file);

    formData.append("selectValue", selectValue);
    formData.append("checkboxValue", checkboxValue);

    try {
      const response = await fetch("/api/process_csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      // visualization
      //if (checkboxValue) setShowPopup(true);
      setShowPopup(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    setIsFlipped(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSelectChange = (event) => {
    setSelectValue(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxValue(event.target.checked);
  };

  return (
    <div className="container">
      <header>
        <h1>{appTitle}</h1>
      </header>

      <div className="content">
        <div className="instructions">
          <h2>Instructions</h2>
          <p>Select a CSV file with GPS coordinates </p>
          <p>
            Choose what type of traffic are you looking for, or let it be
            determined by algorithm <i>(recommended)</i>
          </p>
          <p>
            Choose whether or not you want to have the resulting path be
            visualized on a map
          </p>
          <p>...</p>
        </div>

        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          <div className="card__side card__side--front">
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the CSV file here ...</p>
              ) : (
                <p>Drag 'n' drop a CSV file here, or click to select it</p>
              )}
            </div>
          </div>
          <div className="card__side card__side--back">
            <div className="card__details">
              <div className="parameter-container">
                <label htmlFor="parameter-select">Choose transport type:</label>
                <select
                  id="parameter-select"
                  value={selectValue}
                  onChange={handleSelectChange}
                >
                  <option value="option1">
                    <i>Default</i>
                  </option>
                  <option value="option2">Car</option>
                  <option value="option3">Public transport</option>
                  <option value="option4">Walking</option>
                  <option value="option5">Bicycle</option>
                </select>
              </div>

              <div className="parameter-container">
                <label htmlFor="parameter-checkbox">
                  Enable Visualization:
                </label>
                <input
                  id="parameter-checkbox"
                  type="checkbox"
                  checked={checkboxValue}
                  onChange={handleCheckboxChange}
                />
              </div>

              <button onClick={handleRunClick} className="button">
                RUN
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup hidden">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>
              X
            </button>
            <h2>Map Matched Path Visualization</h2>
            <div id="mapVisualization">
              {/* Visualization will be displayed here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
