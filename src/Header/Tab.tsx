import { useState } from "react";
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
interface DataProps {
  name: string;
}
export const Tab = ({ name }: DataProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [menuArr, setMenuArr] = useState([
    { name },
    { name: "Custom detection" },
    { name: "Super resolution" },
    { name: "Compression" },
    { name: "Inpainting" },
  ]);

  const selectMenuHandler = (index: number) => {
    setCurrentTab(index);
  };
  const removeTab = (index: number) => {
    setMenuArr(menuArr.filter((_, i) => i !== index));
    //선택되어 있던 탭 제거되면 첫번째 탭 선택
    if (currentTab === index && menuArr.length > 0) {
      setCurrentTab(0);
    }
  };
  return (
    <>
      <TabMenu>
        {menuArr.map((item, index) => (
          <li
            key={index}
            className={index === currentTab ? "submenu focused" : "submenu"}
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
