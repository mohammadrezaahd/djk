import { useState, useEffect } from "react";

export interface IconMetadata {
  name: string;
  variant: "solid" | "regular";
  available: boolean;
}

export const useIconLoader = (name: string, variant: "solid" | "regular" = "solid") => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/icons/${variant}/${name}.svg`);
        if (!response.ok) {
          throw new Error(`Icon not found: ${name} (${variant})`);
        }
        
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.warn(`Failed to load icon: ${name} (${variant})`, err);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      loadIcon();
    }
  }, [name, variant]);

  return { svgContent, loading, error };
};

// Hook برای دریافت لیست آیکون‌های موجود
export const useAvailableIcons = () => {
  const [icons, setIcons] = useState<IconMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailableIcons = async () => {
      try {
        setLoading(true);
        
        // چون ما به صورت استاتیک لیست آیکون‌ها را نداریم، 
        // می‌توانیم آیکون‌های شناخته شده را به صورت دستی تعریف کنیم
        // یا از API دریافت کنیم
        
        const knownIcons = [
          { name: "trophy", variant: "solid" as const, available: true },
          { name: "trophy", variant: "regular" as const, available: true },
        ];

        // بررسی موجود بودن هر آیکون
        const iconPromises = knownIcons.map(async (icon) => {
          try {
            const response = await fetch(`/icons/${icon.variant}/${icon.name}.svg`);
            return { ...icon, available: response.ok };
          } catch {
            return { ...icon, available: false };
          }
        });

        const results = await Promise.all(iconPromises);
        setIcons(results);
      } catch (err) {
        console.error("Failed to load available icons", err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailableIcons();
  }, []);

  return { icons, loading };
};

export default useIconLoader;