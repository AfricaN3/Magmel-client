import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { Typography, Button, Grid, useTheme } from "@mui/material";

const PageTitle = ({
  heading = "",
  subHeading = "",
  buttonAction = null,
  buttonTitle = "",
}) => {
  const theme = useTheme();
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginBottom: "2rem" }}
    >
      <Grid item>
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          color={theme.palette.secondary[100]}
        >
          {heading}
        </Typography>
        <Typography variant="subtitle2" color={theme.palette.secondary[300]}>
          {subHeading}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={buttonAction}
        >
          {buttonTitle}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PageTitle;
