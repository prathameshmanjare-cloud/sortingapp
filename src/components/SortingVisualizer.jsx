import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(30);
  const [activeIndices, setActiveIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);

  const generateArray = () => {
    const arr = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 400) + 50
    );
    setArray(arr);
  };

  const handleSort = async () => {
    const arr = array.slice();
    const n = arr.length;

    if (algorithm === "bubble") {
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          setActiveIndices([j, j + 1]);
          setSwapIndices([]);
          await sleep(speed);

          if (arr[j] > arr[j + 1]) {
            setSwapIndices([j, j + 1]);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray(arr.slice());
            await sleep(speed);
          }
        }
      }
    } else if (algorithm === "selection") {
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          setActiveIndices([minIdx, j]);
          setSwapIndices([]);
          await sleep(speed);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          setSwapIndices([i, minIdx]);
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          setArray(arr.slice());
          await sleep(speed);
        }
      }
    } else if (algorithm === "insertion") {
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          setActiveIndices([j, j + 1]);
          setSwapIndices([j, j + 1]);
          await sleep(speed);
          arr[j + 1] = arr[j];
          setArray(arr.slice());
          j--;
        }
        arr[j + 1] = key;
        setArray(arr.slice());
        await sleep(speed);
      }
    }

    setActiveIndices([]);
    setSwapIndices([]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div>
      <div className="controls">
        <button onClick={generateArray}>Generate New Array</button>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>
        <label>
          Size:
          <input
            type="number"
            min="5"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>
        <input
          type="range"
          min="10"
          max="500"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        />
        <button onClick={handleSort}>Sort</button>
      </div>
      <div className="bar-container">
        {array.map((value, idx) => (
          <div key={idx} className="bar-wrapper">
  <div
    className={`bar
      ${activeIndices.includes(idx) ? "bar-active" : ""}
      ${swapIndices.includes(idx) ? "bar-swap" : ""}
    `}
    style={{ height: `${value}px` }}
  />
  <span className="bar-label">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SortingVisualizer;
