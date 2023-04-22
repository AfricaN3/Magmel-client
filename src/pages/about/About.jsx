import { useEffect, useState } from "react";

import { Grid, Container } from "@mui/material";
import axiosInstance from "api";

import { ProfileCover, RecentActivity } from "components";

function About({ magmelNfts, totalSupply }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const getAboutPageStats = async () => {
      try {
        const response = await axiosInstance.get("stats/about/");
        setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAboutPageStats();
  }, []);

  return (
    <>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <ProfileCover magmelNfts={magmelNfts} totalSupply={totalSupply} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity totalSupply={totalSupply} stats={stats} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default About;
