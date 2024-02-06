import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Repo } from "../app/interfaces/repo";

const StyledCard = styled(Card)({
  borderRadius: "16px",
  position: "relative",
  "& .MuiListItem-root": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "115px",
  },
  "& .MuiListItemAvatar-root": {
    margin: "0 10px 0 0",
  },
  "& .MuiAvatar-root": {
    width: "48px!important",
    height: "48px!important",
  },
  "& .MuiStack-root": {
    marginTop: "10px",
  },
  "& .MuiListItemText-primary": {
    fontWeight: "600",
  },
  "& .closeIcon": {
    position: "absolute",
    top: "3px",
    right: "4px",
    zIndex: "1",
  },
});

interface RepoProps {
  item: Repo;
  handleAddToFav?: (item: Repo) => void;
  isFavActive?: boolean;
  isFavoriteCard?: boolean;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  handleRemoveFav?: (itemId: number) => void;
}

const labels: { [index: string]: string } = {
  1: "Useless",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const RepoCard: React.FC<RepoProps> = (props) => {
  const {
    item,
    handleAddToFav = () => {},
    isFavActive,
    isFavoriteCard,
    onRatingChange,
    handleRemoveFav,
  } = props;

  const [rating, setRating] = useState<number | null>(props.rating || null);
  useEffect(() => {
    if (props.rating !== undefined) {
      setRating(props.rating);
    }
  }, [props.rating]);

  return (
    <StyledCard>
      {handleRemoveFav && (
        <IconButton className="closeIcon">
          <CloseIcon onClick={() => handleRemoveFav(item.id)} />
        </IconButton>
      )}
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={item?.name} src={item?.owner?.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={item?.name}
          secondary={
            <React.Fragment>
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "300px",
                  display: "block",
                }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item?.description || ""}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: "scroll" }}>
                {/* console.log(item?.repositoryTopics?.nodes[0]?.topic?.name); */}
                {item?.repositoryTopics?.nodes?.map((topic: any) => (
                  <Chip key={topic.topic.name} label={topic.topic.name} />
                ))}
              </Stack>
            </React.Fragment>
          }
        />
        {isFavoriteCard ? (
          <IconButton>
            {!isFavActive ? (
              <FavoriteBorderIcon onClick={() => handleAddToFav(item)} />
            ) : (
              <FavoriteIcon
                sx={{ color: "#ff2537e8" }}
                onClick={() => handleAddToFav(item)}
              />
            )}
          </IconButton>
        ) : (
          <Rating
            name={`rating-${item.id}`}
            value={rating}
            onChange={(event, newValue) => {
              newValue !== null && onRatingChange?.(newValue);
              setRating(newValue);
            }}
            getLabelText={getLabelText}
          />
        )}

        {rating !== null && rating !== undefined && (
          <Box sx={{ ml: 2 }}>{labels[rating]}</Box>
        )}
      </ListItem>
    </StyledCard>
  );
};

export default RepoCard;
