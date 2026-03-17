import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Project } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete, onEdit }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(project);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project._id);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: '16px!important', // Override theme borderRadius
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)!important', // Override theme shadow
        border: '1px solid',
        borderColor: 'divider',
        height: '320px',
        width: '100%',
        minWidth: '320px', // Increased minimum width
        maxWidth: '420px', // Increased maximum width
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'none!important', // Remove theme gradient
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)!important',
          borderColor: 'primary.main',
          '& .project-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '& .view-indicator': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        },
      }}
      onClick={onClick}
    >
      {/* Status Indicator Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: project.status === 'active' ? 'success.main' : 'warning.main',
        }}
      />
      
      <CardContent sx={{ 
        p: 4, // Increased padding
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        '&:last-child': { pb: 4 }
      }}>
        {/* Header with Title and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 3,
          minHeight: '60px',
          gap: 2
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.35rem', // Larger font
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {project.title}
          </Typography>
          
          <Box 
            className="project-actions"
            sx={{ 
              display: 'flex', 
              gap: 1,
              opacity: 0,
              transform: 'translateY(-8px)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {onEdit && (
              <Tooltip title="Edit project">
                <IconButton
                  size="medium"
                  onClick={handleEditClick}
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'rgba(148, 129, 127, 0.1)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete project">
              <IconButton
                size="medium"
                onClick={handleDeleteClick}
                sx={{
                  color: 'error.main',
                  bgcolor: 'rgba(212, 117, 110, 0.1)',
                  '&:hover': {
                    bgcolor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ 
          flexGrow: 1, 
          mb: 3,
          minHeight: '100px'
        }}>
          <Typography
            variant="body1" // Changed to body1 for better readability
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '1rem',
            }}
          >
            {project.description || 'No description provided for this project. Click to add more details.'}
          </Typography>
        </Box>

        {/* Footer with Status and View Indicator */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto',
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Chip
            label={project.status === 'active' ? 'Active' : 'Completed'}
            size="medium"
            color={project.status === 'active' ? 'success' : 'warning'}
            variant="filled"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'capitalize',
              fontSize: '0.85rem',
              height: '32px',
              px: 1,
            }}
          />
          
          <Box 
            className="view-indicator"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: 'primary.main',
              opacity: 0,
              transform: 'translateX(-8px)',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            View Details
            <ArrowForwardIosIcon sx={{ fontSize: '0.8rem', ml: 1 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;