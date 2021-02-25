import { Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';

interface LastUpdatedProps {
  lastUpdated: string | null;
  variant?: Variant;
}

function LastUpdated({ lastUpdated, variant = 'body2' }: LastUpdatedProps) {
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000 * 10);
    return () => clearInterval(interval);
  });

  return (
    <Typography variant={variant}>
      {formatDistanceToNow(new Date(lastUpdated || 0), {
        addSuffix: true,
      })}
    </Typography>
  );
}

export default LastUpdated;
