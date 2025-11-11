import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { Help as HelpIcon } from "@mui/icons-material";

export function meta() {
  return [
    { title: "مرکز راهنما" },
    { name: "description", content: "راهنمای استفاده از سیستم" },
  ];
}

const HelpPage = () => {
  return (
    <AppLayout title="مرکز راهنما">
      <ComingSoon
        title="مرکز راهنما و پشتیبانی"
        description="در این بخش می‌توانید راهنماهای کامل استفاده از سیستم، سوالات متداول و اطلاعات تماس با پشتیبانی را مشاهده کنید."
        icon={<HelpIcon sx={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default HelpPage;
