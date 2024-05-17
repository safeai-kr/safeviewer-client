import { useState } from "react";
import styled from "styled-components";

const TabMenu = styled.ul`
  background-color: #272727;
  color: #58595b;
  font-weight: bold;
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;

  .submenu {
    display: flex;
    justify-content: space-between;
    width: 380px;
    heigth: 40px;
    width: calc(100% / 4);
    padding: 10px 10px 10px 16px;
    font-size: 15px;
    transition: 0.5s;
  }

  .focused {
    background-color: #58595b;
    color: white;
  }
`;

const Desc = styled.div``;

export const Tab = () => {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    { name: "Ship detection", content: "Ship detection contents" },
    { name: "Custom detection", content: "Custom detection contents" },
    { name: "Super resolution", content: "Super resolution contents" },
    { name: "Compression", content: "asdfdsaf" },
    { name: "Inpainting", content: "asdasd" },
  ];

  const selectMenuHandler = (index: number) => {
    // parameter로 현재 선택한 인덱스 값을 전달해야 하며, 이벤트 객체(event)는 쓰지 않는다
    // 해당 함수가 실행되면 현재 선택된 Tab Menu 가 갱신.
    clickTab(index);
  };

  return (
    <>
      <TabMenu>
        {menuArr.map((item, index) => (
          <li
            className={index === currentTab ? "submenu focused" : "submenu"}
            onClick={() => selectMenuHandler(index)}
          >
            {item.name}
          </li>
        ))}
      </TabMenu>
    </>
  );
};
