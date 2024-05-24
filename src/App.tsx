import { RecoilRoot } from "recoil";
import "./App.css";
import NAuthLayout from "./Layout/NAuthLayout";
import AuthLayout from "./Layout/AuthLayout";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <NAuthLayout /> */}
      <AuthLayout />
    </div>
  );
};

export default App;
