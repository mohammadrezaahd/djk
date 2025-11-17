import { Card, CardContent, Typography } from "@mui/material";
import type { CardProps } from "@mui/material";
import type { ReactNode } from "react";

interface SectionCardProps extends CardProps {
  title: string;
  children: ReactNode;
}

const SectionCard = ({ title, children, ...props }: SectionCardProps) => (
  <Card sx={{ p: 2, ...props.sx }} {...props}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;
