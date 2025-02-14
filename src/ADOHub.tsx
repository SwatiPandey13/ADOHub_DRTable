import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
}

interface Pipeline {
  id: string;
  name: string;
}

const ADOHub: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Replace with your actual PAT
  const pat = '8fgERXzUbdj42Ro2apjiBPmIqwSfeGAW17hAByutjteEoPaEspYYJQQJ99BBACAAAAAAAAAAAAASAZDO3N0P';
  const authHeader = {
    Authorization: `Basic ${btoa(`:${pat}`)}`,
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'https://dev.azure.com/MSSAP/_apis/projects?api-version=6.0',
          {
            headers: authHeader,
          }
        );
        const data = await response.json();
        setProjects(data.value);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch pipelines when a project is selected
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchPipelines = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://dev.azure.com/MSSAP/${selectedProjectId}/_apis/pipelines?api-version=6.0-preview.1`,
          {
            headers: authHeader,
          }
        );
        const data = await response.json();
        setPipelines(data.value);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipelines();
  }, [selectedProjectId]);

  // Handle dropdown change
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(event.target.value);
  };

  return (
    <div>
      <h1>ADO Hub</h1>

      {/* Project Dropdown */}
      <div>
        <label htmlFor="projectDropdown">Select a Project: </label>
        <select
          id="projectDropdown"
          value={selectedProjectId}
          onChange={handleProjectChange}
          disabled={isLoading}
        >
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pipelines Table */}
      {isLoading ? (
        <p>Loading pipelines...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pipeline ID</th>
              <th>Pipeline Name</th>
            </tr>
          </thead>
          <tbody>
            {pipelines.map((pipeline) => (
              <tr key={pipeline.id}>
                <td>{pipeline.id}</td>
                <td>{pipeline.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ADOHub;