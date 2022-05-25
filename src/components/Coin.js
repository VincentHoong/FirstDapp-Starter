import React, { useEffect, useState } from "react";
import { Button } from "web3uikit";
import "./Coin.css";
import MarketSentimentAbi from "../abis/MarketSentimentAbi.json";
import { useMoralis } from "react-moralis";


function Coin({ perc, setPerc, token, setModalToken, setVisible }) {
  const { Moralis, isAuthenticated } = useMoralis();
  const [color, setColor] = useState();

  const vote = async (upDown) => {
    try {
      if (isAuthenticated) {
        await Moralis.executeFunction({
          contractAddress: "0x32D8151Be03f7f31aF9bC491FF3A051C20331fcD",
          abi: MarketSentimentAbi,
          functionName: "vote",
          params: {
            _ticker: token,
            _vote: upDown,
          }
        });

        console.log("Vote Successful");
      } else {
        alert("Authenticate to Vote");
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    if (perc < 50) {
      setColor("#c43d08");
    } else {
      setColor("green");
    }
  }, [perc]);

  return (
    <>
      <div>
        <div className="token">
          {token}
        </div>
        <div
          className="circle"
          style={{
            boxShadow: `0 0 20px ${color}`,
          }}
        >
          <div
            className="wave"
            style={{
              marginTop: `${100 - perc}%`,
              boxShadow: `0 0 20px ${color}`,
              backgroundColor: `${color}`,
            }}>
          </div>
          <div className="percentage">
            {perc}%
          </div>
        </div>
        <div className="votes">
          <Button
            text="Up"
            theme="primary"
            type="button"
            onClick={() => {
              vote(true);
            }}
          />
          <Button
            text="Down"
            theme="colored"
            type="button"
            color="red"
            onClick={() => {
              vote(false);
            }}
          />
        </div>
        <div className="votes">
          <Button
            text="INFO"
            theme="translucent"
            type="button"
            onClick={() => {
              setModalToken(token);
              setVisible(true);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Coin;
