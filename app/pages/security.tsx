import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { ShieldIcon } from "~/components/icons/IconComponents";
export function meta() {
  return [
    { title: "امنیت و حریم خصوصی" },
    { name: "description", content: "مدیریت امنیت و حریم خصوصی" },
  ];
}

const SecurityPage = () => {
  return (
    <AppLayout title="امنیت و حریم خصوصی">
      <ComingSoon
        title="امنیت و حریم خصوصی"
        description="در این بخش می‌توانید تنظیمات امنیتی و حریم خصوصی خود را مدیریت کنید، رمز عبور را تغییر دهید و دسترسی‌ها را کنترل کنید."
        icon={<ShieldIcon style={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default SecurityPage;
