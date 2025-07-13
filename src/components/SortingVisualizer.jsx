import React, { useState, useEffect, useRef } from "react";
import "./SortingVisualizer.css";

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20);
  const [activeIndices, setActiveIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  const isSortingRef = useRef(false);
  

  const generateArray = () => {
    const arr = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 400) + 50
    );
    setArray(arr);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSort = async () => {
    setIsSorting(true);
    isSortingRef.current = true;
    const arr = array.slice();
    const n = arr.length;

    if (algorithm === "bubble") {
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (!isSortingRef.current) return cleanup();
          setActiveIndices([j, j + 1]);
          setSwapIndices([]);
          await sleep(speed);
          if (!isSortingRef.current) return cleanup();

          if (arr[j] > arr[j + 1]) {
            setSwapIndices([j, j + 1]);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray(arr.slice());
            await sleep(speed);
            if (!isSortingRef.current) return cleanup();
          }
        }
      }
    } else if (algorithm === "selection") {
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (!isSortingRef.current) return cleanup();
          setActiveIndices([minIdx, j]);
          setSwapIndices([]);
          await sleep(speed);
          if (!isSortingRef.current) return cleanup();

          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          setSwapIndices([i, minIdx]);
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          setArray(arr.slice());
          await sleep(speed);
          if (!isSortingRef.current) return cleanup();
        }
      }
    } else if (algorithm === "insertion") {
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          if (!isSortingRef.current) return cleanup();
          setActiveIndices([j, j + 1]);
          setSwapIndices([j, j + 1]);
          await sleep(speed);
          if (!isSortingRef.current) return cleanup();

          arr[j + 1] = arr[j];
          setArray(arr.slice());
          j--;
        }
        arr[j + 1] = key;
        setArray(arr.slice());
        await sleep(speed);
        if (!isSortingRef.current) return cleanup();
      }
    }

    cleanup();
  };

  const cleanup = () => {
    setActiveIndices([]);
    setSwapIndices([]);
    setIsSorting(false);
    isSortingRef.current = false;
  };

  const handleStop = () => {
    isSortingRef.current = false;
    setIsSorting(false);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div>
      <div className="controls">
        <button onClick={generateArray} disabled={isSorting}>Generate New Array</button>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isSorting}
          style={{ background: "#3333", color: "white",border:"solid grey"}}
        >
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
            disabled={isSorting}
            onChange={(e) => setArraySize(Number(e.target.value))}
            style={{
              width: "70px",
              height: "15px",
              marginLeft: "5px",
              background: "#3333",
              color: "white",
              borderRadius: "10px",
              border: "solid grey",
              padding: "0.4rem 0.6rem"
            }}
          />
        </label>
        Speed
        <input
          type="range"
          min="10"
          max="500"
          value={speed}
          disabled={isSorting}
          onChange={(e) => setSpeed(e.target.value)}
        />
        <button onClick={handleSort} disabled={isSorting}>Start</button>
        <button onClick={handleStop} disabled={!isSorting}>Stop</button>
      </div>
      <h2>Array Visualization</h2>
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
