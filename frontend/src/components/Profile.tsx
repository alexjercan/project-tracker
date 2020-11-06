import React, { useEffect, useState } from "react";
import TextInput from "./utils/TextInput";

interface Props {
  headers: Headers | undefined;
}

interface IProfileInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface IProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

const getProfile = async (
  headers: Headers | undefined
): Promise<IProfile | undefined> => {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IProfile;
};

const postProfile = async (
    headers: Headers | undefined
): Promise<IProfile | undefined> => {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IProfile;
};

const Profile: React.FC<Props> = (props) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userInput, setUserInput] = useState<IProfileInput>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    getProfile(props.headers).then((profile: IProfile | undefined) => {
      if (profile === undefined) return;
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setUsername(profile.username);
      setEmail(profile.email);
    });
  }, []);

  useEffect(() => {
    setUserInput({
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
  }, [firstName, lastName, email]);

  return (
    <div>
      <h2>Profile {username}</h2>
      <div>First Name</div>
      <TextInput setTextValue={setFirstName} defaultValue={firstName} />
      <div>Last Name</div>
      <TextInput setTextValue={setLastName} defaultValue={lastName} />
      <div>Email</div>
      <TextInput setTextValue={setEmail} defaultValue={email} />
    </div>
  );
};

export default Profile;
