import React, { useState } from "react";

interface Props {
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  fieldType?: string;
}

const TextInput: React.FC<Props> = (props) => {
  let [textValue, setTextValue] = useState<string>("");

  const textChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
    props.setTextValue(event.target.value);
  };

  return (
    <input
      className="input"
      type={props.fieldType || "text"}
      onChange={textChangedHandler}
      value={textValue}
    />
  );
};

export default TextInput;
