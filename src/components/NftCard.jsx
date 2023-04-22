import {
  CardMedia,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { truncate } from "utils";

const NftCard = ({ name, description, attributes, image }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[400]}
          gutterBottom
        >
          {attributes[0]?.value}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <CardMedia
          sx={{
            // position: "absolute",
            zIndex: 5,
            width: "100%",
            height: "150px",
            borderRadius: "0.5rem",
            marginBottom: 1,
          }}
          image={image}
          title={name}
        />

        <Typography variant="body2">{truncate(description, 100)}</Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Button
          variant="primary"
          size="small"
          onClick={() => console.log("Going to GM page")}
        >
          See More
        </Button>
      </CardActions>
    </Card>
  );
};

export default NftCard;
