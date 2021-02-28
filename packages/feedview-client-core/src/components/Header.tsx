import React, { SyntheticEvent, useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import useStore from "../core/useStore";
import useSocket from "../core/useSocket";

function Header() {
  const { sendQuery } = useSocket();
  const { setQuery, getQuery } = useStore((store) => store);

  useEffect(() => {
    const query = getQuery();
    if (query) {
      setValue(query);
    }
  }, [getQuery]);

  const [value, setValue] = useState("");

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setQuery(value);
    sendQuery(value);
  }

  function handleClear() {
    setQuery("");
    setValue("");
  }

  return (
    <Box className="header container">
      <Box className="logo">
        <DynamicFeedIcon fontSize="large" />
        <Typography variant="h4" style={{ fontWeight: 600 }}>
          Feedview
        </Typography>
      </Box>
      <Box>
        <form className="form" onSubmit={handleSubmit}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target?.value as string)}
          />
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleSubmit}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleClear}
          >
            Clear
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Header;
