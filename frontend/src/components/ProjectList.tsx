import React, {useEffect, useState} from "react";
import Project from "./Project";

interface Props {
    headers: Headers | undefined;
}

interface IProject {
    projectName: string;
    ownerUsername: string;
}

const getProjects = async (
    headers: Headers | undefined
): Promise<IProject[] | undefined> => {
    const response = await fetch("/api/project", {
        method: "GET",
        headers: headers,
    });

    if (response.status !== 200) return undefined;
    return (await response.json()) as IProject[];
};

const ProjectList: React.FC<Props> = (props) => {
    const [projects, setProjects] = useState<IProject[] | undefined>();
    
    useEffect(() => {
        getProjects(props.headers).then((response) => setProjects(response));
    }, [props.headers]);


    return <div>{projects?.map((project) => (
        <Project
            key={project.ownerUsername + "/" + project.projectName}
            headers={props.headers}
            project={project}
        />
    ))}</div>;
};

export default ProjectList;