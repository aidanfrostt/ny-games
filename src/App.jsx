import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StrandsPage from "./pages/Strands";
import CrosswordPage from "./pages/Crossword";
import ConnectionsPage from "./pages/Connections";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/strands" element={<StrandsPage />} />
      <Route path="/crossword" element={<CrosswordPage />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
