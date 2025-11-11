import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { Help as HelpIcon } from "@mui/icons-material";

export function meta() {
  return [
    { title: "حمل و نقل" },
    { name: "description", content: "مدیریت حمل و نقل" },
  ];
}

const TransportationPage = () => {
  return (
    <AppLayout title="حمل و نقل">
      <ComingSoon
        title="حمل و نقل"
        description="در این بخش می‌توانید اطلاعات مربوط به حمل و نقل را مشاهده و مدیریت کنید."
        icon={<HelpIcon sx={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default TransportationPage;
