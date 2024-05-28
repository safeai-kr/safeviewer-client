import { faCheck, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

interface tabProps {
  tabs: string[];
  // setTabs?: React.Dispatch<
  //   React.SetStateAction<
  //     {
  //       locationName: string;
  //       projectName: string;
  //       longitude: number;
  //       latitude: number;
  //     }[]
  //   >
  // >;
  currentTab: string;
  // setCurrentTab: (index: number) => void;
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
    border-right: 0.2px solid #fff;
    border-bottom: 0.2px solid #fff;
  }

  .selected {
    background-color: #58595b;
    color: white;
  }
`;

const TabMainIcon = styled(FontAwesomeIcon)`
  display: flex;
  width: 16px;
  height: 16px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: white;
  cursor: pointer;
  border-right: 0.2px solid #fff;
  border-bottom: 0.2px solid #fff;
`;
const IndexBox = styled.div<{ isSelected: boolean }>`
  display: flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  margin-right: 4px;
  ${(props) =>
    props.isSelected
      ? css`
          color: black;
          background-color: white;
        `
      : css`
          color: #58595b;
          background-color: rgba(255, 255, 255, 0.3);
        `}
`;
const TabContent = styled.div`
  display: flex;
  align-items: center;
`;

const Tab: React.FC<tabProps> = ({ tabs, currentTab }) => {
  const navigate = useNavigate();
  return (
    <>
      <TabMenu>
        <TabMainIcon
          icon={faGlobe}
          onClick={() => {
            navigate("/");
          }}
        />
        {tabs.map((item, index) => (
          <li
            key={index + 1}
            className={item === currentTab ? "submenu selected" : "submenu"}
          >
            <TabContent>
              <IndexBox isSelected={item === currentTab}>#{index + 1}</IndexBox>
              {item}
            </TabContent>
          </li>
        ))}
      </TabMenu>
    </>
  );
};

export default Tab;
