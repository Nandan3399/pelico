import React, { useEffect, useState } from "react";
import {
  useAppState,
  useAppDispatch,
  setSearchResults,
  setSearchQuery,
} from "./AppContext";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, Grid, Typography } from "@mui/material";
import SearchBar from "./components/Search";
import GithubSvg from "./app/assets/GithubSvg";
import RepoCard from "./components/RepoCard";
import { Repo } from "./app/interfaces/repo";
import { STORAGE } from "./app/services/sessionStorage.services";
import { formatNumber } from "./app/utils/number.utils";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/system";

const StyledLink = styled(Link)({
  float: "right",
  cursor: "pointer",
  color: "#009aff",
});

const StyledPaginateButton = styled(Button)({
  "&.Mui-disabled": {
    color: "#958888",
  },
});

const fetchRepositories = async (
  query: string,
  page: number,
  perPage: number,
  after: string | null = null
): Promise<{ items: Repo[]; total_count: number }> => {
  try {
    if (query.trim() === "") {
      return { items: [], total_count: 0 };
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query SearchRepositories($query: String!, $perPage: Int!, $after: String) {
            search(query: $query, type: REPOSITORY, first: $perPage, after: $after) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                    id
                    name
                    description
                    url
                    repositoryTopics(first: 5) {
                      nodes {
                        topic {
                          name
                        }
                      }
                    }      
                    owner {
                      avatarUrl
                    }
                  }
                }
                cursor
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        `,
        variables: {
          query: query,
          perPage: perPage,
          after: after,
        },
      }),
    });

    const responseData = await response.json();
    return {
      items: responseData.data.search.edges.map((edge: any) => edge.node),
      total_count: responseData.data.search.repositoryCount,
    };
  } catch (error) {
    console.error("error: " + error);
    return { items: [], total_count: 0 };
  }
};

const Listing: React.FC = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [repos, setRepos] = useState<{ items: Repo[]; total_count: number }>({
    items: [],
    total_count: 0,
  });
  const [favRepo, setFavRepo] = useState<Repo[]>(
    STORAGE.get("favorite", { parse: true }) || []
  );
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const storedQuery = state.searchQuery;

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  // search for repo
  const handleSearch = async (query: string, isSearch: boolean = false, page?: number) => {
    setLoading(true);
    if (isSearch) {
      const data = await fetchRepositories(query, page ? page : 1, perPage);
      setRepos({
        items: data.items,
        total_count: data.total_count,
      });
      // Dispatching the search results and query to context
      dispatch(setSearchResults(data.items));
      dispatch(setSearchQuery(query));
    } else if (state.searchResults.length > 0 && storedQuery) {
      // Use stored data directly
      setRepos({
        items: state.searchResults,
        total_count: state.searchResults.length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch("", false);
  }, [location.pathname]);

  useEffect(() => {
    handleSearch(storedQuery || "", true, page);
  }, [page]);

  //   handle add to fav
  const handleAddToFav = (item: Repo) => {
    const newFavs = favRepo.some((i) => i.id === item.id)
      ? favRepo.filter((i) => i.id !== item.id)
      : [...favRepo, item];
    setFavRepo(newFavs);
    STORAGE.set("favorite", JSON.stringify(newFavs));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#0e1117", minHeight: "100vh" }} className="main">
          <Box sx={{ marginBottom: "20px" }}>
            <GithubSvg />
          </Box>
          <SearchBar
            handleSearch={handleSearch}
            isLoading={isLoading}
            queryInput={storedQuery}
          />
          {!isLoading && repos.items?.length === 0 && (
            <>
              <Typography sx={{ marginTop: "30px" }}>
                Welcome to the GitHub Repo Finder!
                <br />
                This application allows you to find a repository on Github by
                providing its name. Just type in the repository's name and hit
                enter.
                <br />
              </Typography>
              <div className="img-container">
                <img src="/assets/home-desktop-dark2x.webp" alt="Github Wall" />
              </div>
            </>
          )}

          <Grid
            container
            sx={{
              maxWidth: "960px",
              marginTop: "10px",
            }}
          >
            {!isLoading && repos.total_count !== 0 && (
              <Grid item xs={6}>
                <Typography sx={{ textAlign: "left" }}>
                  Search Results : {formatNumber(repos.total_count)}
                </Typography>
              </Grid>
            )}
            {!isLoading && repos.total_count !== 0 && (
              <Grid item xs={6}>
                <StyledLink to="/favorites">Favourite Repo</StyledLink>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ maxWidth: "960px", marginTop: "20px", marginBottom: "30px" }}
          >
            {!isLoading &&
              repos.items?.length > 0 &&
              repos.items.map((item) => (
                <Grid item xs={4} sm={4} md={6} key={item.id}>
                  <RepoCard
                    item={item}
                    handleAddToFav={handleAddToFav}
                    isFavActive={favRepo
                      .map((item) => item.id)
                      .includes(item.id)}
                    isFavoriteCard={true}
                  />
                </Grid>
              ))}
            {!isLoading && repos.items?.length > 0 ? (
              <>
                <Grid item md={6}>
                  <StyledPaginateButton
                    disabled={page === 1}
                    onClick={handlePreviousPage}
                  >
                    Prev
                  </StyledPaginateButton>
                </Grid>
                <Grid item md={6}>
                  <Button onClick={handleNextPage}>Next</Button>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Listing;
