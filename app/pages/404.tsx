import React from 'react';
import { NotFoundPage } from '~/components/common';
import AppLayout from '~/components/layout/AppLayout';

const NotFoundPageWithLayout = () => {
  return (
    <AppLayout title="صفحه یافت نشد">
      <NotFoundPage />
    </AppLayout>
  );
};

export default NotFoundPageWithLayout;