import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const Typingtest = () => {
  const paragraph =
    "Under the silver glow of the moon, the ancient forest whispered secrets to those who listened closely. The tall, gnarled trees stood as silent sentinels, their leaves rustling with stories of old. A gentle breeze carried the scent of pine and earth, wrapping around the wanderer who ventured into this mystical realm. The soft hoot of an owl echoed through the canopy, adding to the symphony of nature's night song. Somewhere in the distance, a brook murmured over smooth stones, its voice a soothing lullaby. In this tranquil embrace, time seemed to pause, allowing the spirit to reconnect with the wonder and wisdom of the wild.";

  const maxTime = 60;
  const [TimeLeft, setTimeLeft] = useState(maxTime);
  const [Mistakes, setMistakes] = useState(0);
  const [charIndex, setcharIndex] = useState(0);
  const [isTyping, setisTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);
  const charRefs = useRef([]);
  const [correctwrong, setcorrectwrong] = useState([]);

  useEffect(() => {
    console.log("use effect called ");
    inputRef.current.focus();
    setcorrectwrong(Array(charRefs.current.length).fill(""));
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && TimeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(TimeLeft - 1);
        let correctChars = charIndex - Mistakes;
        let totalTime = maxTime - TimeLeft;

        let cpm = correctChars * (60 / totalTime);
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm, 10));

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 60 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);
      }, 1000);
    } else if (TimeLeft === 0) {
      clearInterval(interval);
      setisTyping(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, TimeLeft]);

  const resetGame = () => {
    setisTyping(false);
    setTimeLeft(maxTime);
    setcharIndex(0);
    setMistakes(0);
    setCPM(0);
    setWPM(0);
    setcorrectwrong(Array(charRefs.current.length).fill(""));
    inputRef.current.focus();
  };

  const handleChange = (e) => {
    const characters = charRefs.current;
    console.log("handleChange called");
    let currentChar = charRefs.current[charIndex];
    let typedChar = e.target.value.slice(-1);
    console.log(`charIndex: ${charIndex}, typedChar: ${typedChar}`);
    if (charIndex < characters.length && TimeLeft > 0) {
      if (!isTyping) {
        setisTyping(true);
      }
      if (typedChar === currentChar.textContent) {
        setcharIndex(charIndex + 1);
        correctwrong[charIndex] = "correct";
      } else {
        setcharIndex(charIndex + 1);
        setMistakes(Mistakes + 1);
        correctwrong[charIndex] = "wrong";
      }
      if (charIndex === characters.length - 1) setisTyping(false);
    } else {
      setisTyping(false);
    }
  };

  return (
    <div className="container">
      <div className="test">
        <input
          type="text"
          className="input-field"
          ref={inputRef}
          onChange={handleChange}
        />
        {paragraph.split("").map((char, index) => (
          <span
            className={`char ${index === charIndex ? " active" : ""} ${
              correctwrong[index]
            }`}
            ref={(e) => (charRefs.current[index] = e)}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="result">
        <p>
          Time left : <strong>{TimeLeft}</strong>
        </p>
        <p>
          Mistakes : <strong>{Mistakes}</strong>
        </p>
        <p>
          WPM : <strong>{WPM}</strong>
        </p>
        <p>
          CPM : <strong>{CPM}</strong>
        </p>
        <button className="btn" onClick={resetGame}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Typingtest;
