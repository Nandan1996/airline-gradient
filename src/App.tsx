import AirlineManager from "./components/AirlineManager";
import StopsConfig from "./components/StopsConfig";
import GradientPreview from "./components/GradientPreview";
import { AppProvider, useApp } from "./context";

function Layout() {
  const { ready } = useApp();
  if (!ready) return <div className="hint">Loading...</div>;

  return (
    <main>
      <div className="left-col">
        <AirlineManager />
        <StopsConfig />
      </div>
      <div className="right-col">
        <GradientPreview />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <header>
          <h1>Airline Gradient Playground</h1>
        </header>
        <Layout />
      </div>
    </AppProvider>
  );
}
