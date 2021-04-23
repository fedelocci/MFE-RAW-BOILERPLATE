import { useContext } from 'react';
import MicroFrontedContext from './MicroFrontedContext';

const MicroFrontendManager = () => {
  const [state, setState] = useContext(MicroFrontedContext);

  const clearError = () => setState(prev => ({ ...prev, error: null }));
  return {
    info: state.info,
    error: state.error,
    clearError,
  };
};
export default MicroFrontendManager;
