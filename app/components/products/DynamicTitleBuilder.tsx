import React, { useRef, useMemo, useEffect } from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import type {
  ICategoryAttr,
  IAttr,
} from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface AttributeTag {
  id: number;
  title: string;
  type: "attribute";
}

interface DetailTag {
  id: string;
  title: string;
  type: "detail";
}

type TagItem = AttributeTag | DetailTag;

interface DynamicTitleBuilderProps {
  value: string;
  onChange: (value: string) => void;
  attributesData?: ICategoryAttr[];
  detailsData?: ICategoryDetails[];
  placeholder?: string;
  label?: string;
}

const DynamicTitleBuilder: React.FC<DynamicTitleBuilderProps> = ({
  value,
  onChange,
  attributesData = [],
  detailsData = [],
  placeholder = "عنوان محصول را وارد کنید...",
  label = "عنوان محصول",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Extract unique attributes from all selected templates
  const badges = useMemo((): TagItem[] => {
    const allBadges: TagItem[] = [];

    // Extract attributes
    const uniqueAttributes = new Map<number, AttributeTag>();
    attributesData.forEach((templateData) => {
      if (templateData?.category_group_attributes) {
        Object.values(templateData.category_group_attributes).forEach(
          (categoryData) => {
            Object.values(categoryData.attributes).forEach((attr: IAttr) => {
              if (!uniqueAttributes.has(attr.id)) {
                uniqueAttributes.set(attr.id, {
                  id: attr.id,
                  title: attr.title,
                  type: "attribute",
                });
              }
            });
          }
        );
      }
    });
    allBadges.push(...Array.from(uniqueAttributes.values()));

    return allBadges;
  }, [attributesData, detailsData]);

  // Convert value to HTML and update the contentEditable div
  useEffect(() => {
    if (!ref.current) return;

    // Only update if the current content doesn't match the value
    const currentText = ref.current.innerText || "";
    const valueText = value.replace(/\{[^}]+\}/g, ""); // Remove tags for comparison
    
    // Parse the value and create HTML
    const parts = value.split(/(\{[^}]+\})/g);
    const html = parts.map((part) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const id = part.slice(1, -1);
        const badge = badges.find((b) => b.id.toString() === id);
        if (badge) {
          return `<span style="display: inline-flex; align-items: center; background: #E3F2FD; border-radius: 8px; padding: 2px 6px; margin: 0 2px; cursor: pointer;" contenteditable="false" data-id="${id}"><span style="margin-right: 4px;">${badge.title}</span><span style="font-size: 14px; font-weight: bold; cursor: pointer; padding: 0 2px; border-radius: 50%; line-height: 1;" class="badge-close" title="حذف">×</span></span>`;
        }
        return part;
      }
      return part;
    }).join("");

    // Only update if content is different
    if (ref.current.innerHTML !== html) {
      const currentSelection = window.getSelection();
      const currentRange = currentSelection && currentSelection.rangeCount > 0 ? currentSelection.getRangeAt(0) : null;
      
      ref.current.innerHTML = html;
      
      // Re-attach event listeners to close buttons
      const closeButtons = ref.current.querySelectorAll('.badge-close');
      closeButtons.forEach((btn) => {
        const badgeContainer = btn.parentElement;
        if (badgeContainer) {
          // Add hover effect
          btn.addEventListener('mouseenter', () => {
            (btn as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.1)';
          });
          btn.addEventListener('mouseleave', () => {
            (btn as HTMLElement).style.backgroundColor = 'transparent';
          });
          
          // Add click to remove
          const removeBadge = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            badgeContainer.remove();
            handleInput();
          };
          
          btn.addEventListener('click', removeBadge);
          badgeContainer.addEventListener('click', removeBadge);
        }
      });
    }
  }, [value, badges]);

  // Get currently used tags
  const usedTags = useMemo(() => {
    const tagRegex = /\{([^}]+)\}/g;
    const matches = [];
    let match;

    while ((match = tagRegex.exec(value)) !== null) {
      const id = match[1]; // Keep as string to handle both number and string IDs
      matches.push(id);
    }

    return matches;
  }, [value]);

  const insertBadge = (badge: TagItem) => {
    if (!ref.current) return;

    // Focus the contentEditable div first
    ref.current.focus();

    // Get selection
    const sel = window.getSelection();
    if (!sel) return;

    // Create a range at the end of the contentEditable div
    const range = document.createRange();
    
    // Check if we have existing content
    if (ref.current.childNodes.length > 0) {
      // Move to the end of the content
      const lastNode = ref.current.childNodes[ref.current.childNodes.length - 1];
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
    } else {
      // Empty content, select inside the div
      range.selectNodeContents(ref.current);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    // Create badge container
    const badgeContainer = document.createElement("span");
    badgeContainer.style.display = "inline-flex";
    badgeContainer.style.alignItems = "center";
    badgeContainer.style.background = "#E3F2FD";
    badgeContainer.style.borderRadius = "8px";
    badgeContainer.style.padding = "2px 6px";
    badgeContainer.style.margin = "0 2px";
    badgeContainer.style.cursor = "pointer";
    badgeContainer.contentEditable = "false";
    badgeContainer.setAttribute("data-id", badge.id.toString());
    badgeContainer.className = "badge-item";

    // Create badge text
    const badgeText = document.createElement("span");
    badgeText.textContent = ` ${badge.title} `;
    badgeText.style.marginRight = "4px";

    // Create close icon
    const closeIcon = document.createElement("span");
    closeIcon.innerHTML = "×";
    closeIcon.style.fontSize = "14px";
    closeIcon.style.fontWeight = "bold";
    closeIcon.style.cursor = "pointer";
    closeIcon.style.padding = "0 2px";
    closeIcon.style.borderRadius = "50%";
    closeIcon.style.lineHeight = "1";
    closeIcon.className = "badge-close";
    closeIcon.title = "حذف";

    // Add hover effect to close icon
    closeIcon.addEventListener("mouseenter", () => {
      closeIcon.style.backgroundColor = "rgba(0,0,0,0.1)";
    });
    closeIcon.addEventListener("mouseleave", () => {
      closeIcon.style.backgroundColor = "transparent";
    });

    // Append text and icon to container
    badgeContainer.appendChild(badgeText);
    badgeContainer.appendChild(closeIcon);

    // Add click to remove badge
    const removeBadge = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      badgeContainer.remove();
      handleInput(); // Update value after removal
    };

    badgeContainer.addEventListener("click", removeBadge);
    closeIcon.addEventListener("click", removeBadge);

    range.insertNode(badgeContainer);

    // move caret after the badge
    range.setStartAfter(badgeContainer);
    range.setEndAfter(badgeContainer);
    sel.removeAllRanges();
    sel.addRange(range);

    // Update value immediately after adding badge
    handleInput();
  };

  const handleInput = () => {

    if (!ref.current) return;

    // Extract value from content
    let newValue = "";
    const children = Array.from(ref.current.childNodes);

    children.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        newValue += node.textContent || "";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const dataId = element.getAttribute("data-id");
        if (dataId) {
          newValue += `{${dataId}}`;
        }
      }
    });

    onChange(newValue);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {label}
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
          "&:empty:before": {
            content: `"${placeholder}"`,
            color: "#999",
            fontStyle: "italic",
          },
        }}
      />
      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {badges
          .filter((b) => !usedTags.includes(b.id.toString()))
          .map((b) => (
            <Chip
              key={`${b.type}-${b.id}`}
              label={b.title}
              size="small"
              onClick={() => insertBadge(b)}
              variant="outlined"
              color="primary"
            />
          ))}
      </Box>
    </Box>
  );
};

export default DynamicTitleBuilder;
