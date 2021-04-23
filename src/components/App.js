import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import appStyle from './style/AppStyle';

const App = () => {
  const css = appStyle();
  const { t } = useTranslation();
  return (
    <Box width={1}>
      <Card className={css.root}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {t('message.hello')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Click</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default App;
