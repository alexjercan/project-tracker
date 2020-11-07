import React, { useEffect, useState } from "react";
import AutosizeInput from 'react-input-autosize';

interface Props {
    setTextValue: React.Dispatch<React.SetStateAction<string>>;
    fieldType?: string;
    defaultValue?: string;
}

const TextAreaInput: React.FC<Props> = (props) => {
    const [textValue, setTextValue] = useState<string>("");

    useEffect(() => {
        setTextValue(props.defaultValue || "");
    }, [props.defaultValue]);

    const textChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextValue(event.target.value);
        props.setTextValue(event.target.value);
    };

    return (
        <AutosizeInput
            className="input"
            type={"text"}
            onChange={textChangedHandler}
            value={textValue}
        />
    );
};

export default TextAreaInput;
