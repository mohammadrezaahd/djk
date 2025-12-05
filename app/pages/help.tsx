import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { HelpIcon } from "~/components/icons/IconComponents";

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
        icon={<HelpIcon style={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default HelpPage;
