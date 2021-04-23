import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MicroFrontedContext from './MicroFrontedContext';

const MicroFrontendProvider = ({ children, keycloak, useMock }) => {
  const [state, setState] = useState({
    info: [],
    error: null,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (keycloak.initialized && keycloak.authenticated) {
      const fetchData = async () => {
        try {
          if (useMock) {
            setState(prev => ({ ...prev }));
          } else {
            // insert call api  and set the state
            // setState(prev => ({ ...prev, info }));
          }
        } catch (e) {
          setState({ error: t('message.error') });
        }
      };
      fetchData();
    }
  }, [keycloak.initialized, keycloak.authenticated]);

  return (
    <MicroFrontedContext.Provider value={[state, setState]}>
      {children}
    </MicroFrontedContext.Provider>
  );
};
MicroFrontendProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  keycloak: PropTypes.shape({
    initialized: PropTypes.bool,
    authenticated: PropTypes.bool,
  }),
  useMock: PropTypes.bool,
};

MicroFrontendProvider.defaultProps = {
  keycloak: {
    initialized: false,
    authenticated: false,
  },
  useMock: false,
};

export default MicroFrontendProvider;
