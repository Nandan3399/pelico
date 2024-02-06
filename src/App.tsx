import './App.css';
import AppRoutes from './app/routes';
import { AppProvider } from "./AppContext";
function App() {
  return (
    <div className="App">
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </div>
  );
}

export default App;
