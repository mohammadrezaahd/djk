import { Grid, Card, CardActions, Button } from "@mui/material";

interface ActionButtonsProps {
  onSubmit: () => void;
  onReset: () => void;
  isFormValid: boolean;
  loading: boolean;
  isEditMode?: boolean;
}

const ActionButtons = ({
  onSubmit,
  onReset,
  isFormValid,
  loading,
  isEditMode = false,
}: ActionButtonsProps) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onReset}>
            {isEditMode ? "بازنشانی تغییرات" : "شروع مجدد"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!isFormValid || loading}
          >
            {loading
              ? "در حال ذخیره..."
              : isEditMode
              ? "ذخیره تغییرات"
              : "ذخیره قالب"}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ActionButtons;
