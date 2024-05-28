import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface tabProps {
  tabs?: {
    locationName: string;
    projectName: string;
    longitude: number;
    latitude: number;
  }[];
  setTabs?: React.Dispatch<
    React.SetStateAction<
      {
        locationName: string;
        projectName: string;
        longitude: number;
        latitude: number;
      }[]
    >
  >;
  currentTab: number;
  setCurrentTab: (index: number) => void;
}

const TabMenu = styled.ul`
  background-color: #3e3e3e;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;

  .submenu {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 256px;
    height: 40px;
    width: calc(100% / 4);
    padding: 10px 10px 10px 12px;
    font-size: 15px;
    transition: 0.5s;
  }

  .selected {
    background-color: #58595b;
    color: white;
  }
`;

const TabCheckedIcon = styled(FontAwesomeIcon)`
  color: white;
  width: 16px;
  height: 16px;
`;
const IndexBox = styled.div`
  display: flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  color: #58595b;
  background-color: white;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  margin-right: 4px;
`;
const TabContent = styled.div`
  display: flex;
  align-items: center;
`;

const Tab: React.FC<tabProps> = ({
  tabs,
  setTabs,
  currentTab,
  setCurrentTab,
}) => {
  const navigate = useNavigate();

  //선택된 탭 바뀔 때마다 다른 view로 라우팅
  const selectMenuHandler = (index: number) => {
    setCurrentTab(index + 1);
    navigate(`/projects/${index + 1}`);
  };

  return (
    <>
      {/* <TabMenu>
        {tabs.map((item, index) => (
          <li
            key={index + 1}
            className={
              index + 1 === currentTab ? "submenu selected" : "submenu"
            }
            onClick={() => selectMenuHandler(index)}
          >
            <TabContent>
              <IndexBox>#{index + 1}</IndexBox>
              {item.projectName}({item.locationName})
            </TabContent>
            <TabCheckedIcon icon={faCheck} />
          </li>
        ))}
      </TabMenu> */}
    </>
  );
};

export default Tab;
