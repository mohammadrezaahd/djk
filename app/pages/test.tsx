import React, { useRef } from "react";
import { Box, Chip, Typography, Paper, Stack, Button, Divider } from "@mui/material";
import { Icon, TrophySolid, TrophyRegular, useAvailableIcons } from "../components/icons";

const badges = [
  { id: "name", label: "نام" },
  { id: "job", label: "شغل" },
  { id: "city", label: "شهر" },
];

export default function TestPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { icons, loading: iconsLoading } = useAvailableIcons();

  const insertBadge = (badge: { id: string; label: string }) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();

    const span = document.createElement("span");
    span.textContent = ` ${badge.label} `;
    span.contentEditable = "false";
    span.style.background = "#E3F2FD";
    span.style.borderRadius = "8px";
    span.style.padding = "2px 6px";
    span.style.margin = "0 2px";
    span.style.cursor = "pointer";
    span.setAttribute("data-id", badge.id);

    range.insertNode(span);

    // move caret after the badge
    range.setStartAfter(span);
    range.setEndAfter(span);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleInput = () => {
    console.log("content:", ref.current?.innerText);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        صفحه تست - آیکون‌ها و Badge ها
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      {/* نمایش آیکون‌های مختلف */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          تست سیستم آیکون‌ها
        </Typography>
        
        <Stack spacing={4}>
          {/* آیکون‌های با سایزهای مختلف */}
          <Box>
            <Typography variant="h6" gutterBottom>
              سایزهای مختلف
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <TrophySolid size={16} color="#FF5722" />
              <TrophySolid size={24} color="#2196F3" />
              <TrophySolid size={32} color="#4CAF50" />
              <TrophySolid size={48} color="#FF9800" />
              <TrophySolid size="64px" color="#9C27B0" />
            </Box>
          </Box>

          {/* آیکون‌های با انواع مختلف */}
          <Box>
            <Typography variant="h6" gutterBottom>
              انواع مختلف
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <TrophySolid size={32} color="#FFD700" />
              <TrophyRegular size={32} color="#FFD700" />
              <Icon name="trophy" variant="solid" size={32} color="#C0C0C0" />
              <Icon name="trophy" variant="regular" size={32} color="#CD7F32" />
            </Box>
          </Box>

          {/* استفاده با دکمه‌ها */}
          <Box>
            <Typography variant="h6" gutterBottom>
              استفاده در دکمه‌ها
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button 
                variant="contained" 
                startIcon={<TrophySolid size={20} />}
                color="primary"
              >
                جایزه طلا
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<TrophyRegular size={20} />}
                color="secondary"
              >
                جایزه نقره
              </Button>
              <Button 
                variant="text" 
                endIcon={<Icon name="trophy" variant="solid" size={18} />}
              >
                مشاهده جوایز
              </Button>
            </Box>
          </Box>

          {/* آیکون‌های موجود */}
          <Box>
            <Typography variant="h6" gutterBottom>
              آیکون‌های موجود در سیستم
            </Typography>
            {iconsLoading ? (
              <Typography>در حال بارگذاری...</Typography>
            ) : (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {icons.filter(icon => icon.available).map((icon, index) => (
                  <Paper key={index} sx={{ p: 2, textAlign: "center", minWidth: 120 }}>
                    <Icon 
                      name={icon.name} 
                      variant={icon.variant} 
                      size={32} 
                      color="#1976d2" 
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {icon.name} ({icon.variant})
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>

          {/* تست آیکون غیرموجود */}
          <Box>
            <Typography variant="h6" gutterBottom>
              تست آیکون غیرموجود
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Icon name="nonexistent" variant="solid" size={32} />
              <Typography variant="body2">آیکون غیرموجود (باید علامت سوال نمایش دهد)</Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* ادیتور قدیمی */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          ادیتور متن با Badge ها
        </Typography>
        
        <Box
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            minHeight: "80px",
            cursor: "text",
            "&:focus": { outline: "2px solid #1976d2" },
          }}
        />
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {badges.map((b) => (
            <Chip
              key={b.id}
              label={b.label}
              size="small"
              onClick={() => insertBadge(b)}
              variant="outlined"
              color="primary"
              icon={<TrophySolid size={16} />}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
