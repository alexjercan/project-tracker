import React, {useEffect, useState} from "react";
import Project from "./Project";
import TextInput from "./utils/TextInput";

interface Props {
    headers: Headers | undefined;
}

interface IProject {
    projectName: string;
    ownerUsername: string;
}

const getProjects = async (
    headers: Headers | undefined
): Promise<IProject[]> => {
    const response = await fetch("/api/project", {
        method: "GET",
        headers: headers,
    });

    if (response.status !== 200) return [];
    return (await response.json()) as IProject[];
};

const addProject = async (projectName: string, headers: Headers | undefined): Promise<IProject | undefined> => {
    const response = await fetch("/api/project", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({projectName}),
    });

    if (response.status !== 200) return undefined;
    return (await response.json()) as IProject;
};

const ProjectList: React.FC<Props> = (props) => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [projectName, setProjectName] = useState<string>("");

    useEffect(() => {
        getProjects(props.headers).then((response) => setProjects(response));
    }, [props.headers]);

    const addProjectClickedHandler = async () => {
        const project = await addProject(projectName, props.headers);
        if (project === undefined) return;
        setProjects([...projects, project]);
    };

    return (
        <div>
            <h3>Projects</h3>
            <div>Project Name
                <TextInput setTextValue={setProjectName}/>
                <button onClick={addProjectClickedHandler}>Add Project</button>
            </div>
            <ul>
                {projects?.map((project) => (
                    <Project
                        key={project.ownerUsername + "/" + project.projectName}
                        headers={props.headers}
                        project={project}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
