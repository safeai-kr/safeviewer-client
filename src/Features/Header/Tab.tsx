import { faCheck, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled, { css } from "styled-components";
import { CurrentProject } from "../Map/Data/CurrentProject";
import { colors } from "../../Utils/colors";
import { ReactComponent as HomeMap } from "../../Icons/default/home_map.svg";
import { ReactComponent as IndexBox1 } from "../../Icons/default/tap_project1.svg";
import { ReactComponent as IndexBox2 } from "../../Icons/default/tap_project2.svg";
import { ReactComponent as IndexBox3 } from "../../Icons/default/tap_project3.svg";
import { ReactComponent as IndexBox4 } from "../../Icons/default/tap_project4.svg";
import { ReactComponent as IndexBox5 } from "../../Icons/default/tap_project5.svg";
import { Icon } from "ol/style";

const indexBoxArr = [IndexBox1, IndexBox2, IndexBox3, IndexBox4, IndexBox5];
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
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabMenu = styled.ul`
  background-color: ${colors.default900};
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

    cursor: pointer;
  }

  .selected {
    background-color: ${colors.default700};
    color: white;
  }
  .disabled {
    pointer-events: none;
  }
`;

const TabMainIcon = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
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

const Tab: React.FC<tabProps> = ({ tabs, currentTab, setCurrentTab }) => {
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] =
    useRecoilState<string>(CurrentProject);
  return (
    <>
      <TabMenu>
        <TabMainIcon
          onClick={() => {
            navigate("/");
          }}
        >
          <HomeMap />
        </TabMainIcon>
        {tabs.map((item, index) => {
          const IconComponent = indexBoxArr[index];

          const isDisabled = item === "Inpainting";
          return (
            <li
              onClick={() => {
                navigate(
                  `/project/${item.replace(/(\s*)/g, "").toLowerCase()}`
                );
                setCurrentTab(item);
                setCurrentProject(item);
              }}
              key={index + 1}
              className={`${
                item === currentTab ? "submenu selected" : "submenu"
              } ${isDisabled ? "disabled" : ""}`}
            >
              <TabContent>
                <IconComponent
                  style={{ marginRight: "8px" }}
                  fill={item === currentTab ? "white" : "#555660"}
                />
                {item}
              </TabContent>
            </li>
          );
        })}
      </TabMenu>
    </>
  );
};

export default Tab;
