import { Provider } from 'react-redux';
import Stacknavigation from './src/navigation/Stacknavigation';
import Toast from 'react-native-toast-message';
import { store } from './src/redux/Store';

const App = () => {
  return (
    <Provider store={store}>
      <Stacknavigation />
      <Toast />
    </Provider>
  )
}

export default App;