import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const SideBarContainer = styled.div`
  width: 296px;
  height: 100%;
  background-color: #272727;
  position: absolute;
  top: 40px;
  right: 0;
`;

const SideBarHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 14px;
  padding: 20px 12px;
`;
const TitleText = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
const TitleIcon = styled.div`
  background-color: #7b61ff;
  padding: 2px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 99px;
  margin-left: 4px;
  height: 12px;
  width: 20px;
  margin-top: 4px;
`;
const TitleIconText = styled.div`
  font-size: 8px;
  font-weight: bold;
  color: white;
  height: 8px;
  wight: 8px;
  margin-bottom: 4px;
`;
const SearchBar = styled.div`
  display: flex;
  height: 36px;
  padding: 8px 12px;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid #fff;
  margin: 0px 12px;
`;
const SearchInput = styled.input`
  background-color: #272727;
  border: none;
  font-weight: 400;
  font-size: 12px;
  flex: 1 0 0;
  color: white;
  &::placeholder {
    color: white;
  }
`;
const SearchIcon = styled(FontAwesomeIcon)`
  color: white;
  width: 16px;
  height: 16px;
`;
const OptionsArea = styled.div``;

const RightSideBar: React.FC = () => {
  return (
    <>
      <SideBarContainer>
        <SideBarHeader>
          <TitleText>Custom Detection</TitleText>
          <TitleIcon>
            <TitleIconText>AI</TitleIconText>
          </TitleIcon>
        </SideBarHeader>
        <SearchBar>
          <SearchInput placeholder="텍스트 영역" />
          <SearchIcon icon={faSearch} />
        </SearchBar>
        <OptionsArea></OptionsArea>
      </SideBarContainer>
    </>
  );
};

export default RightSideBar;
