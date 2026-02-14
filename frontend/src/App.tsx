import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Home } from './Home';
import { DoctorListing } from './DoctorListing';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorListing />} />
      </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
