import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

import MagmelImageList from "./MagmelImageList";

const ProfileCover = ({ magmelNfts, totalSupply }) => {
  const navigate = useNavigate();
  return (
    <>
      <Box display="flex" mb={3}>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            About Magpie Melanges
          </Typography>
          <Typography variant="subtitle2">
            Discover the magic behind our unique NFTs
          </Typography>
        </Box>
      </Box>
      {magmelNfts && <MagmelImageList magmelNfts={magmelNfts} />}
      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          MAGMEL
        </Typography>
        <Typography variant="subtitle2">
          Welcome to Magpie Melanges, where creativity meets technology to bring
          you a unique NFT experience. Our platform allows you to unleash your
          imagination and generate stunning art pieces that are minted as NFTs.
          At Magpie Melanges, we believe that art is for everyone. That's why
          we've created an intuitive platform that's easy to use, even if you're
          not a professional artist. With our innovative AI technology, you can
          create beautiful artwork in just a few clicks. Our platform is packed
          with amazing features that let you explore your creativity and
          generate unique NFTs. From generating prompts from your favorite text,
          to unlocking your imagination with visually creative prompts, our
          platform has everything you need to bring your ideas to life. Whether
          you're an artist looking to create new and exciting works, or a
          collector seeking unique and valuable NFTs, Magpie Melanges has
          something for you. Our platform is built on the latest blockchain
          technology, ensuring that every NFT you mint is secure and immutable.
          So why not join our community today and start creating stunning NFTs
          with Magpie Melanges?
        </Typography>

        <Box
          display={{ xs: "block", md: "flex", marginTop: "10px" }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Button
              onClick={() => navigate("/mint")}
              size="small"
              variant="contained"
            >
              Mint
            </Button>
          </Box>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            onClick={() => navigate("/collection")}
            size="small"
            variant="outlined"
            color="secondary"
            endIcon={<ArrowForwardTwoToneIcon />}
          >
            {` See all ${totalSupply} MAGMEL`}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ProfileCover;
