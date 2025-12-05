import React, { useState } from "react";
import { Box, useTheme, Typography, Paper, Container } from "@mui/material";
import AppLayout from "~/components/layout/AppLayout";
import {
  TicketingSidebar,
  TicketChat,
  NewTicketForm,
} from "~/components/ticketing";

type TicketingView = "chat" | "newTicket" | "empty";

const TicketingPage: React.FC = () => {
  const theme = useTheme();
  const [selectedTicketId, setSelectedTicketId] = useState<number>();
  const [currentView, setCurrentView] = useState<TicketingView>("empty");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketSelect = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setCurrentView("chat");
  };

  const handleNewTicketClick = () => {
    setSelectedTicketId(undefined);
    setCurrentView("newTicket");
  };

  const handleCloseTicket = () => {
    setSelectedTicketId(undefined);
    setCurrentView("empty");
  };

  const handleTicketCreated = (ticketId: number) => {
    // First trigger refresh of sidebar to reload tickets list
    setRefreshTrigger((prev) => prev + 1);

    // Then select the newly created ticket and switch to chat view
    setTimeout(() => {
      setSelectedTicketId(ticketId);
      setCurrentView("chat");
    }, 500); // Small delay to allow sidebar to refresh first
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "chat":
        return selectedTicketId ? (
          <TicketChat ticketId={selectedTicketId} onClose={handleCloseTicket} />
        ) : null;

      case "newTicket":
        return (
          <NewTicketForm
            onClose={handleCloseTicket}
            onTicketCreated={handleTicketCreated}
          />
        );

      case "empty":
      default:
        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[50],
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                سامانه پشتیبانی
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                برای شروع، یک تیکت از فهرست انتخاب کنید یا تیکت جدیدی ایجاد کنید
              </Typography>
              <Typography variant="body2" color="text.secondary">
                تیم پشتیبانی ما آماده پاسخگویی به سوالات و حل مشکلات شما است
              </Typography>
            </Paper>
          </Box>
        );
    }
  };

  return (
    <AppLayout title="پشتیبانی">
      <Container maxWidth="lg">
        <Box sx={{ height: "calc(100vh - 64px)", display: "flex" }}>
          {/* Sidebar */}
          <TicketingSidebar
            selectedTicketId={selectedTicketId}
            onTicketSelect={handleTicketSelect}
            onNewTicketClick={handleNewTicketClick}
            width={400}
            refreshTrigger={refreshTrigger}
          />

          {/* Main Content */}
          <Box sx={{ flex: 1, height: "100%" }}>{renderMainContent()}</Box>
        </Box>
      </Container>
    </AppLayout>
  );
};

export default TicketingPage;
