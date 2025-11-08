import { Paper, Typography } from "@mui/material";

interface TitleCardProps {
  title: string;
  description?: string;
}

const TitleCard: React.FC<TitleCardProps> = ({ title, description }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Paper>
  );
};

export default TitleCard;
