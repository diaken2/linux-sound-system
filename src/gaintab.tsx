import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { AddButton, MdiButton, MinusButton } from "./utilities/ui-components";
import { mdiVolumeOff } from "@mdi/js";
interface SoundInfo {
  [key: string]: number;
}

interface State {
  Mute: SoundInfo;
  Volume: SoundInfo;
}

interface IRenderChannel {
  keyOfSet: string;
  inform: State;
  channel: number;
  setInform: React.Dispatch<React.SetStateAction<State>>;
}

const RenderChannel: React.FC<IRenderChannel> = ({
  keyOfSet,
  inform,
  channel,
  setInform,
}) => {
  const handlePlusClick = useCallback(() => {
    const newValue = Math.min(inform.Volume[keyOfSet] + 1, 0);

    setInform((prevState) => {
      const localStorageObject = {
        ...prevState,
        Volume: {
          ...prevState.Volume,
          [keyOfSet]: newValue,
        },
      };
      localStorage.setItem("inform", JSON.stringify(localStorageObject));

      return localStorageObject;
    });
  }, [inform, keyOfSet, setInform]);
  useEffect(() => {
    fetch("/api/testingfunction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inform: inform,
      }),
    });
  }, [inform]);
  const handleToggleMute = useCallback(() => {
    setInform((prevState) => {
      const localStorageObject = {
        ...prevState,
        Mute: {
          ...prevState.Mute,
          [keyOfSet]: prevState.Mute[keyOfSet] === 0 ? 1 : 0,
        },
      };
      localStorage.setItem("inform", JSON.stringify(localStorageObject));

      return localStorageObject;
    });
  }, [keyOfSet, setInform]);

  const handleMinusClick = useCallback(() => {
    const newValue = Math.max(inform.Volume[keyOfSet] - 1, -10);

    setInform((prevState) => {
      const localStorageObject = {
        ...prevState,
        Volume: {
          ...prevState.Volume,
          [keyOfSet]: newValue,
        },
      };

      localStorage.setItem("inform", JSON.stringify(localStorageObject));

      return localStorageObject;
    });
  }, [inform, keyOfSet, setInform]);

  return (
    <div className="gaind-channel-container" key={channel}>
      <span className="gaind-channel-name">{`Channel ${channel}`}</span>
      <MinusButton
        tooltip={"Turn down the volume"}
        onClick={handleMinusClick}
      />
      <input
        type="text"
        value={inform.Volume[keyOfSet]}
        readOnly
        className="gaind-input"
      />
      <AddButton tooltip={"Add volume"} onClick={handlePlusClick} />

      <MdiButton
        icon={mdiVolumeOff}
        tooltip={"Mute this destination channel"}
        buttonSize="small"
        highlighted={inform.Mute[keyOfSet] === 1}
        onClick={handleToggleMute}
      />
    </div>
  );
};

const initialState: State = {
  Mute: {
    leftHi: 1,
    leftLow: 1,
    leftMid: 1,
    leftSub: 1,
    rightHi: 1,
    rightLow: 1,
    rightMid: 1,
    rightSub: 1,
  },
  Volume: {
    leftHi: -10,
    leftLow: -10,
    leftMid: -10,
    leftSub: -10,
    rightHi: -10,
    rightLow: -10,
    rightMid: -10,
    rightSub: -10,
  },
};
const GaindTab: React.FC = () => {
  const [inform, setInform] = useState<State>(() => {
    const savedInform = localStorage.getItem("inform");
    return savedInform ? JSON.parse(savedInform) : initialState;
  });

  return (
    <div className="gaind-tab-container">
      <div className="gaind-header-container">
        <div>DOWN</div>
        <div className="gainbutton">GAIN</div>
        <div className="gainupbutton">UP</div>
        <div>MUTE</div>
      </div>
      <div className="gaind-channels-container">
        {Object.keys(inform.Volume).map((ch, index) => (
          <RenderChannel
            keyOfSet={ch}
            inform={inform}
            setInform={setInform}
            channel={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default GaindTab;
