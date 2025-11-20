import React from "react";
import Icon from "./Icon";
import type { IconProps } from "./Icon";

// کامپوننت خاص برای آیکون Trophy Solid
export interface TrophySolidProps extends Omit<IconProps, "name" | "variant"> {}

export const TrophySolid: React.FC<TrophySolidProps> = (props) => {
  return <Icon name="trophy" variant="solid" {...props} />;
};

// کامپوننت خاص برای آیکون Trophy Regular
export interface TrophyRegularProps extends Omit<IconProps, "name" | "variant"> {}

export const TrophyRegular: React.FC<TrophyRegularProps> = (props) => {
  return <Icon name="trophy" variant="regular" {...props} />;
};

// فانکشن یاردهندۀ برای ساخت کامپوننت‌های آیکون جدید
export const createIconComponent = (name: string, variant: "solid" | "regular" = "solid") => {
  const IconComponent: React.FC<Omit<IconProps, "name" | "variant">> = (props) => {
    return <Icon name={name} variant={variant} {...props} />;
  };
  
  IconComponent.displayName = `${name.charAt(0).toUpperCase() + name.slice(1)}${
    variant === "solid" ? "Solid" : "Regular"
  }`;
  
  return IconComponent;
};