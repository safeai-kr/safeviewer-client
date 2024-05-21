import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

  .focused {
    background-color: #58595b;
    color: white;
  }
`;
const TabRemoveBtn = styled.div`
  color: white;
  width: 16px;
  height: 16px;
  cursor: pointer;
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
interface tabProps {
  tabs: { name: string; content: string }[];
  setTabs: React.Dispatch<
    React.SetStateAction<
      { name: string; content: string; longitude: number; latitude: number }[]
    >
  >;
  currentTab: number;
  setCurrentTab: (index: number) => void;
}
export const Tab: React.FC<tabProps> = ({
  tabs,
  setTabs,
  currentTab,
  setCurrentTab,
}) => {
  const navigate = useNavigate();

  //선택된 탭 바뀔 때마다 다른 view로 라우팅
  const selectMenuHandler = (index: number) => {
    setCurrentTab(index + 1);
    navigate(`/auth/projects/${index + 1}`);
  };

  const removeTab = (index: number) => {
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    //현재 탭을 지우면 첫번째 탭 선택되도록
    if (currentTab === index + 1) {
      setCurrentTab(1);
      navigate("/auth/projects/1");
    }
  };
  return (
    <>
      <TabMenu>
        {tabs.map((item, index) => (
          <li
            key={index + 1}
            className={index + 1 === currentTab ? "submenu focused" : "submenu"}
            onClick={() => selectMenuHandler(index)}
          >
            <TabContent>
              <IndexBox>#{index + 1}</IndexBox>
              {item.name}
            </TabContent>
            <TabRemoveBtn
              onClick={(e) => {
                //부모 요소 클릭 이벤트 막기
                e.stopPropagation();
                removeTab(index);
              }}
            >
              X
            </TabRemoveBtn>
          </li>
        ))}
      </TabMenu>
    </>
  );
};
