import React, { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { STORAGE } from "./app/services/sessionStorage.services";
import RepoCard from "./components/RepoCard";
import { Repo } from "./app/interfaces/repo";
import GithubSvg from "./app/assets/GithubSvg";

const FavoriteRepo: React.FC = () => {
    const [favRepo, setFavRepo] = useState<Repo[]>(STORAGE.get("favorite", { parse: true }) || []);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Fetch stored ratings on component mount
    const storedRatings = STORAGE.get("ratings", { parse: true }) || {};
    setRatings(storedRatings);
  }, []);

  const handleRatingChange = (repoId: number, rating: number) => {
    const updatedRatings = {
      ...ratings,
      [repoId]: rating,
    };
    setRatings(updatedRatings);
    STORAGE.set("ratings", JSON.stringify(updatedRatings));
  };

  const handleRemoveFav = (itemId: number) => {
    const updatedFavRepo = favRepo?.filter((repo) => repo.id !== itemId) || [];
    setFavRepo(updatedFavRepo);

    // Remove the associated rating from storage
    const updatedRatings = { ...ratings };
    delete updatedRatings[itemId];
    setRatings(updatedRatings);

    STORAGE.set("favorite", JSON.stringify(updatedFavRepo));
    STORAGE.set("ratings", JSON.stringify(updatedRatings));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#0e1117", minHeight: "100vh" }} className="main">
          <Box sx={{ marginBottom: "20px" }}>
            <GithubSvg />
            <Typography variant="h5">Favorite Repository</Typography>
          </Box>
          <Grid
            container
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ padding: "0 20px", marginBottom: "30px" }}
          >
            {favRepo &&
              favRepo.length > 0 &&
              favRepo.map((item) => (
                <Grid item xs={4} sm={4} md={6} key={item.id}>
                  <RepoCard
                    item={item}
                    isFavoriteCard={false}
                    rating={ratings[item.id]}
                    handleRemoveFav={handleRemoveFav}
                    onRatingChange={(rating) =>
                      handleRatingChange(item.id, rating)
                    }
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default FavoriteRepo;
