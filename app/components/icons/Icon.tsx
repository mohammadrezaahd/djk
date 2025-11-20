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
  size?: string | number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

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
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
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
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
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
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
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
