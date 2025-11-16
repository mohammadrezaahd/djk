import { Box, Button, Typography, Paper } from "@mui/material";
import React, { useRef } from "react";
import AppLayout from "../components/layout/AppLayout";
import Editor from "../components/editor";

const Test = () => {
  const ref = useRef<any>(null);

  const handleLog = () => {
    //
  };

  return (
    <AppLayout title="تست">
      <Paper>
        <Typography>test</Typography>
        <Editor ref={ref} />
        <Button onClick={handleLog}>log</Button>
      </Paper>
    </AppLayout>
  );
};

export default Test;