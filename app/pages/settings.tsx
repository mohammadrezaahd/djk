import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { SettingsIcon } from "~/components/icons/IconComponents";
export function meta() {
  return [
    { title: "تنظیمات" },
    { name: "description", content: "تنظیمات سیستم" },
  ];
}

const SettingsPage = () => {
  return (
    <AppLayout title="تنظیمات">
      <ComingSoon
        title="تنظیمات سیستم"
        description="در این بخش می‌توانید تنظیمات مختلف سیستم را مدیریت کنید. این قابلیت به زودی در دسترس خواهد بود."
        icon={<SettingsIcon style={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default SettingsPage;
