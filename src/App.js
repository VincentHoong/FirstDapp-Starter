import React, { useEffect, useState } from "react";
import { ConnectButton, Modal } from "web3uikit";
import "./App.css";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin";
import { abouts } from "./about";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const App = () => {
  const { Moralis, isInitialized } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [btc, setBtc] = useState(38);
  const [eth, setEth] = useState(50);
  const [link, setLink] = useState(74);
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState("");
  const [modalPrice, setModalPrice] = useState();

  const getRatio = async (ticker, setPerc) => {
    const query = new Moralis.Query("Votes");
    query.equalTo("ticker", ticker);
    query.descending("createdAt");

    const results = await query.first();

    const up = Number(results.attributes.up);
    const down = Number(results.attributes.down);
    const ratio = Math.round(up / (up + down) * 100);
    setPerc(ratio);
  }

  useEffect(() => {
    if (isInitialized) {
      getRatio("BTC", setBtc);
      getRatio("ETH", setEth);
      getRatio("LINK", setLink);

      const createLiveQuery = async () => {
        const query = new Moralis.Query("Votes");
        const subscription = await query.subscribe();
        subscription.on("update", (object) => {
          switch (object.attributes.ticker) {
            case "BTC":
              getRatio("BTC", setBtc);
              break;
            case "ETH":
              getRatio("ETH", setEth);
              break;
            case "LINK":
              getRatio("LINK", setLink);
              break;
          }
        })
      }

      createLiveQuery();
    }
  }, [isInitialized]);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      const price = await Web3Api.token.getTokenPrice({
        address: abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      });
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if (modalToken) {
      fetchTokenPrice();
    }
  }, [modalToken]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50px" />
          Sentiment
        </div>
        <ConnectButton />
      </div>
      <div className="instructions">
        Where do you think this token are going?
        Up or Down?
      </div>
      <div className="list">
        <Coin
          perc={btc}
          setPerc={setBtc}
          token={"BTC"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={eth}
          setPerc={setEth}
          token={"ETH"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={link}
          setPerc={setLink}
          token={"LINK"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
      </div>
      <Modal
        title={modalToken}
        hasFooter={false}
        isVisible={visible}
        onCloseButtonPressed={() => {
          setVisible(false);
        }}
      >
        <div>
          <span>Price: </span>
          ${modalPrice}
        </div>
        <div>
          <span>About</span>
        </div>
        <div>
          {modalToken && abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>
      </Modal>
    </>
  );
};

export default App;
