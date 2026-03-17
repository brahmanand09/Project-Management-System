import React from 'react';
import { Box, Typography } from '@mui/material';
import ProjectCard from './ProjectCard';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onEditProject?: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onSelectProject, 
  onDeleteProject, 
  onEditProject 
}) => {
  if (projects.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 12,
          px: 2,
          bgcolor: 'background.default',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            mb: 2,
            fontWeight: 500,
          }}
        >
          No projects found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
          }}
        >
          Create your first project to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(4, 1fr)'
        },
        gap: 4,
        width: '100%',
        justifyItems: 'center'
      }}
    >
      {projects.map((project) => (
        <Box 
          key={project._id}
          sx={{
            width: '100%',
            maxWidth: '380px',
            minWidth: '320px'
          }}
        >
          <ProjectCard
            project={project}
            onClick={() => onSelectProject(project)}
            onDelete={onDeleteProject}
            onEdit={onEditProject}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProjectList;