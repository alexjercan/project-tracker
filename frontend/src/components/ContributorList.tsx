import React, { useEffect, useState } from "react";
import TextInput from "./utils/TextInput";
import querystring from "querystring";
import Contributor from "./Contributor";

interface Props {
    headers: Headers | undefined;
    ownerUsername: string;
    projectName: string;
}

interface IContributor {
    projectName: string;
    ownerUsername: string;
    contributorUsername: string;
}

const getContributors = async (
    ownerUsername: string,
    projectName: string,
    headers: Headers | undefined
): Promise<IContributor[]> => {
    const query = querystring.stringify({ ownerUsername, projectName });
    const url = "/api/contributor?" + query;
    const response = await fetch(url, {
        method: "GET",
        headers: headers,
    });

    if (response.status !== 200) return [];
    return (await response.json()) as IContributor[];
};

const addContributor = async (
    projectName: string,
    contributorUsername: string,
    headers: Headers | undefined
): Promise<IContributor[] | undefined> => {
    const response = await fetch("/api/contributor", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ projectName, contributorUsername }),
    });

    if (response.status !== 200) return undefined;
    return (await response.json()) as IContributor[];
};

const ContributorList: React.FC<Props> = (props) => {
    const [contributors, setContributors] = useState<IContributor[]>([]);
    const [contributorUsername, setContributorUsername] = useState<string>("");

    useEffect(() => {
        getContributors(
            props.ownerUsername,
            props.projectName,
            props.headers
        ).then((response) => setContributors(response));
    }, [props.projectName, props.ownerUsername, props.headers]);

    const addCommentClickedHandler = () => {
        addContributor(
            props.projectName,
            contributorUsername,
            props.headers
        ).then((new_contributors) => {
            if (new_contributors === undefined) return;
            setContributors([...new_contributors, ...contributors]);
            setContributorUsername("");
        });
    };

    return (
        <div>
            <h3>Contributors</h3>
            <div>
                <TextInput setTextValue={setContributorUsername} defaultValue={contributorUsername}/>
                <button onClick={addCommentClickedHandler}>Add Contributor</button>
            </div>
            <ul>
                {contributors?.map((contributor, index) => (
                    <Contributor
                        key={index}
                        headers={props.headers}
                        contributor={contributor}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ContributorList;
