import React, { useEffect, useState } from "react";

interface Props {
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  fieldType?: string;
  defaultValue?: string;
}

const TextInput: React.FC<Props> = (props) => {
  const [textValue, setTextValue] = useState<string>("");

  useEffect(() => {
    setTextValue(props.defaultValue || "");
  }, [props.defaultValue]);

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
