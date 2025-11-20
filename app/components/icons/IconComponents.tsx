import React, { type FC } from "react";
import Icon from "./Icon";
import type { IconProps, VariantType } from "./Icon";

interface CustomIconProps extends Omit<IconProps, "name" | "variant"> {}

const iconGroups = {
  "jelly-duo-regular": {
    GalleryIcon: "images",
    ImportIcon: "arrow-down-to-line",
    TagIcon: "tag",
    GridIcon: "grid",
    TemplateIcon: "layer-group",
    MenuBars: "bars",
    AngleDown: "angle-down",
    AngleUp: "angle-up",
    AiIcon: "sparkles",
    SpeedIcon: "gauge",
    SearchIcon: "magnifying-glass",
    LoginIcon: "arrow-right-to-bracket",
    CircleCheckIcon: "circle-check",
    QuoteIcon: "quote-left",
    EmailIcon: "envelope",
    PhoneIcon: "phone",
    LocationIcon: "location-dot",
    UserIcon: "user",
    SettingsIcon: "gear",
    NotificationIcon: "bell",
    HelpIcon: "circle-question",
    LogoutIcon: "arrow-right-from-bracket",
    AccountIcon: "circle-user",
    ShieldIcon: "shield",
  },

  "duotone-regular": {
    RocketIcon: "rocket-launch",
    CloudUploadIcon: "cloud-arrow-up",
    TrendUpIcon: "arrow-trend-up",
  },
  brands: {
    TelegramIcon: "telegram",
    WhatsappIcon: "whatsapp",
    InstagramIcon: "instagram",
  },
};

const Icons: Record<string, FC<CustomIconProps>> = {};

// 🔧 ساخت خودکار کامپوننت‌ها
Object.entries(iconGroups).forEach(([variant, icons]) => {
  Object.entries(icons).forEach(([componentName, iconName]) => {
    const Component: FC<CustomIconProps> = (props) => (
      <Icon name={iconName} variant={variant as VariantType} {...props} />
    );
    Icons[componentName] = Component;
  });
});

export const {
  GalleryIcon,
  ImportIcon,
  TagIcon,
  GridIcon,
  TemplateIcon,
  MenuBars,
  AngleDown,
  AngleUp,
  AiIcon,
  SpeedIcon,
  SearchIcon,
  RocketIcon,
  CloudUploadIcon,
  LoginIcon,
  CircleCheckIcon,
  QuoteIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  UserIcon,
  TelegramIcon,
  WhatsappIcon,
  InstagramIcon,
  TrendUpIcon,
  SettingsIcon,
  NotificationIcon,
  HelpIcon,
  LogoutIcon,
  AccountIcon,
  ShieldIcon,
} = Icons;
