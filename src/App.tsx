import { RecoilRoot } from "recoil";
import "./App.css";
import NAuthLayout from "./Layout/NAuthLayout";
import AuthLayout from "./Layout/AuthLayout";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <NAuthLayout /> -- 로그인 로그아웃 로직 생략 */}
      <AuthLayout />
    </div>
  );
};

export default App;
