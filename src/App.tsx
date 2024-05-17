import { RecoilRoot } from "recoil";
import "./App.css";
import NAuthLayout from "./InitialLayout/NAuthLayout";
import AuthLayout from "./InitialLayout/AuthLayout";

const App: React.FC = () => {
  return (
    <div className="App">
      <NAuthLayout />
      <AuthLayout />
    </div>
  );
};

export default App;
