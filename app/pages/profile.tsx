import React from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ComingSoon } from "~/components/common";
import { Person as PersonIcon } from "@mui/icons-material";

export function meta() {
  return [
    { title: "پروفایل من" },
    { name: "description", content: "مشاهده و ویرایش اطلاعات پروفایل" },
  ];
}

const ProfilePage = () => {
  return (
    <AppLayout title="پروفایل من">
      <ComingSoon
        title="پروفایل من"
        description="در این بخش می‌توانید اطلاعات پروفایل خود را مشاهده و ویرایش کنید. این بخش به زودی فعال خواهد شد."
        icon={<PersonIcon sx={{ fontSize: 60, color: "white" }} />}
      />
    </AppLayout>
  );
};

export default ProfilePage;
