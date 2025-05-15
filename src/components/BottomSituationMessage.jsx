import React, { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../constants";
import "./BottomSituationMessage.css";

const MIN_HEIGHT = 40; // px
const MAX_HEIGHT = window.innerHeight * 0.5; // 50% of screen
const DEFAULT_HEIGHT = window.innerHeight * 0.12; // 12vh

const BottomSituationMessage = () => {
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const fetchMessage = () => {
      fetch(`${SERVER_URL}/situation-report`)
        .then(res => res.text())
        .then(text => {
          if (isMounted) setMessage(text);
        })
        .catch(() => {
          if (isMounted) setMessage("");
        });
    };
    fetchMessage();
    const interval = setInterval(fetchMessage, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Drag handlers
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const delta = startY.current - e.clientY;
      let newHeight = startHeight.current + delta;
      newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
      setHeight(newHeight);
    };
    const onMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      className="bottom-situation-message"
      style={{ height: height, maxHeight: height }}
    >
      <div
        className="resize-handle"
        onMouseDown={e => {
          dragging.current = true;
          startY.current = e.clientY;
          startHeight.current = height;
        }}
      >
        <div className="resize-bar" />
      </div>
      {message.split('\n').map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default BottomSituationMessage; 