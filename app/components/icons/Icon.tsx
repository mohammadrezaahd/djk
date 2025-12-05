import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

export type VariantType =
  | "solid"
  | "regular"
  | "duotone-regular"
  | "jelly-duo-regular";

export interface IconProps {
  name: string;
  variant?: VariantType;
  size?: string | number | 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Size mapping to match MUI conventions
const sizeMap: Record<string, number> = {
  xs: 16,
  small: 20,
  sm: 20,
  medium: 24,
  md: 24,
  large: 32,
  lg: 32,
  xl: 40,
};

const Icon: React.FC<IconProps> = ({
  name,
  variant = "solid",
  size = 24,
  color = "currentColor",
  className,
  style,
  onClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Convert size to pixel value
  const getSize = (size: string | number | undefined): number => {
    if (typeof size === 'number') return size;
    if (typeof size === 'string' && sizeMap[size]) return sizeMap[size];
    if (typeof size === 'string' && !isNaN(Number(size))) return Number(size);
    return 24; // default
  };

  const pixelSize = getSize(size);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`/icons/${variant}/${name}.svg`);
        if (!response.ok) {
          throw new Error(`Icon not found: ${name}`);
        }

        let svgText = await response.text();

        // Replace fill="currentColor" with the specified color
        if (color !== "currentColor") {
          svgText = svgText.replace(/fill="currentColor"/g, `fill="${color}"`);
        }

        setSvgContent(svgText);
      } catch (err) {
        console.warn(`Failed to load icon: ${name} (${variant})`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [name, variant, color]);

  if (loading) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          backgroundColor: "#f0f0f0",
          borderRadius: "2px",
          ...style,
        }}
        className={className}
      />
    );
  }

  if (error || !svgContent) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          backgroundColor: "#ffebee",
          color: "#c62828",
          fontSize: "8px",
          borderRadius: "2px",
          ...style,
        }}
        className={className}
        title={`Icon not found: ${name}`}
      >
        ?
      </Box>
    );
  }

  return (
    <Box
      component="span"
      className={className}
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        // cursor: onClick ? "pointer" : "default",
        "& svg": {
          width: "100%",
          height: "100%",
          fill: color,
        },
        ...style,
        cursor: "pointer",
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default Icon;
