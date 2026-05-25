import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameShell } from './components/layout/GameShell';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/play" element={<GameShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
