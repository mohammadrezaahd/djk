import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";

import { ThemeProvider } from "./theme";
import { store } from "./store";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { IconButton, Box, Typography, Button, Container } from "@mui/material";
import { NotFoundPage, ErrorPage } from "./components/common";
import { CloseIcon } from "./components/icons/IconComponents";
export const links = () => [
  { rel: "icon", href: "/Hoshmarket.ico", type: "image/x-icon" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              maxSnack={5}
              autoHideDuration={4000}
              action={(snackbarId) => (
                <IconButton
                  onClick={() => closeSnackbar(snackbarId)}
                  size="small"
                  sx={{ color: "primary.contrastText" }}
                >
                  <CloseIcon size={"small"} />
                </IconButton>
              )}
            >
              <ThemeProvider>{children}</ThemeProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <NotFoundPage />
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      );
    }

    // Handle other HTTP errors
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ErrorPage
              errorCode={error.status}
              subtitle={
                error.statusText || `خطای HTTP ${error.status} رخ داده است.`
              }
              showRefreshButton={true}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  // Handle other errors (development)
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "calc(100vh - 200px)",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  fontWeight: "bold",
                  color: "error.main",
                  mb: 2,
                  fontFamily: "Vazirmatn",
                }}
              >
                خطای سیستم
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: 4,
                  maxWidth: 500,
                  lineHeight: 1.6,
                  fontFamily: "Vazirmatn",
                }}
              >
                {error instanceof Error
                  ? error.message
                  : "خطای غیرمنتظره‌ای رخ داده است."}
              </Typography>

              {import.meta.env.DEV && error instanceof Error && error.stack && (
                <Box
                  component="pre"
                  sx={{
                    width: "100%",
                    p: 2,
                    backgroundColor: "grey.100",
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    mb: 3,
                    maxHeight: 300,
                  }}
                >
                  <code>{error.stack}</code>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={() => (window.location.href = "/")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontFamily: "Vazirmatn",
                }}
              >
                بازگشت به خانه
              </Button>
            </Box>
          </Container>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
