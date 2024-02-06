import React, { useState, ChangeEvent, FormEvent, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, LinearProgress } from "@mui/material";

interface SearchBarProps {
  handleSearch: (query: string, isSearch:boolean) => void;
  isLoading: boolean;
  queryInput:string;
}

const CustomTextField = styled(TextField)({
  width: "100%",
  "& .Mui-focused": {
    "&:hover fieldset": {
      borderColor: "#fff", // Set the border color on hover
    },
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#1f2429", // Set the border color
    },
    "&:hover fieldset": {
      borderColor: "#1976d2",
    },
    "& input::placeholder": {
      color: "rgb(125, 133, 144)", // Set the placeholder color
    },
  },
  "& .MuiSvgIcon-root": {
    color: "rgb(125, 133, 144)", // Set the search icon color
  },
});

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch, isLoading, queryInput }) => {
  const [searchInput, setSearchInput] = useState<string>(queryInput || "");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      handleSearch(value,true);
    }, 300),
    [handleSearch]
  );

  const handleClearClick = () => {
    setSearchInput("");
    handleSearch("",true); // Clear search on clear button click
  };

  const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
  };

  return (
    <Box component="div" sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        component="form"
        noValidate
        sx={{ width: "69%" }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <CustomTextField
          id="search-input"
          value={searchInput}
          onChange={handleOnChangeInput}
          placeholder="Search Github"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear input"
                  onClick={handleClearClick}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isLoading && <LinearProgress />}
      </Box>
    </Box>
  );
};

export default SearchBar;
