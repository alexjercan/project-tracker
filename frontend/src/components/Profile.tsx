import React, { useEffect, useState } from "react";
import TextInput from "./utils/TextInput";

interface Props {
  headers: Headers | undefined;
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
  firstName: string,
  lastName: string,
  email: string,
  headers: Headers | undefined
): Promise<IProfile | undefined> => {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ firstName, lastName, email }),
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IProfile;
};

const Profile: React.FC<Props> = (props) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    getProfile(props.headers).then((profile: IProfile | undefined) => {
      if (profile === undefined) return;
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setUsername(profile.username);
      setEmail(profile.email);
    });
  }, [props.headers]);

  const editProfileClickedHandler = async () => {
    const profile = await postProfile(firstName, lastName, email, props.headers);

    if (profile === undefined) return;

    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setUsername(profile.username);
    setEmail(profile.email);
  };

  return (
    <div>
      <h2>Profile {username}</h2>
      <div>First Name</div>
      <TextInput setTextValue={setFirstName} defaultValue={firstName} />
      <div>Last Name</div>
      <TextInput setTextValue={setLastName} defaultValue={lastName} />
      <div>Email</div>
      <TextInput setTextValue={setEmail} defaultValue={email} />
      <br />
      <button onClick={() => editProfileClickedHandler()}>
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
