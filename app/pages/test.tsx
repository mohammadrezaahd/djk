import React, { useRef } from "react";
import { Box, Chip } from "@mui/material";

const badges = [
  { id: "name", label: "نام" },
  { id: "job", label: "شغل" },
  { id: "city", label: "شهر" },
];

export default function EditableInputWithBadges() {
  const ref = useRef<HTMLDivElement | null>(null);

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
    <Box sx={{ p: 2 }}>
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
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        {badges.map((b) => (
          <Chip
            key={b.id}
            label={b.label}
            size="small"
            onClick={() => insertBadge(b)}
            variant="outlined"
            color="primary"
          />
        ))}
      </Box>
    </Box>
  );
}
