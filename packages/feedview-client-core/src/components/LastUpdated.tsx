import { Typography } from '@material-ui/core';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import useStore from '../core/useStore';

function LastUpdated() {
  const { lastUpdated } = useStore((store) => store);
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000 * 10);
    return () => clearInterval(interval);
  });
  console.log('update');
  return (
    <Typography variant='body1'>
      Last update:{' '}
      {formatDistanceToNow(new Date(lastUpdated || 0), {
        addSuffix: true,
      })}
    </Typography>
  );
}

export default LastUpdated;
