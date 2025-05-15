import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import "./BottomSituationMessage.css";

const BottomSituationMessage = () => {
  const [message, setMessage] = useState("");

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

  if (!message) return null;

  return (
    <div className="bottom-situation-message">
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