import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  height: 48px;
  padding: 12px;
`;
const TitleText = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
const TitleIcon = styled.div`
  background-color: #00ff94;
  padding: 2px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-left: 4px;
  height: 12px;
  width: 17px;
`;
const TitleIconText = styled.div`
  font-size: 8px;
  font-weight: bold;
  color: #272727;
  height: 8px;
  width: 8px;
  margin-bottom: 4px;
`;
const SearchBar = styled.div<{ isActive: boolean }>`
  display: flex;
  height: 36px;
  padding: 8px 12px;
  align-items: center;
  align-self: stretch;
  border-radius: 99px;
  border: 1px solid ${({ isActive }) => (isActive ? "#00FF94" : "#58595b")};
  margin: 0px 12px;
`;
const SearchInput = styled.input`
  background-color: #272727;
  border: none;
  outline: none;
  font-weight: 400;
  font-size: 12px;
  flex: 1 0 0;
  caret-color: white;
  color: white;
  padding-right: 20px;
  &::placeholder {
    color: #58595b;
  }
`;
const SearchIcon = styled(FontAwesomeIcon)`
  color: #58595b;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
const OptionsArea = styled.div`
  gap: 10px;
  margin: 20px 12px;
  max-width: 272px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #d1d1d1;

  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
`;
const Option = styled.div`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background-color: #3e3e40;
  cursor: pointer;
`;
const CustomRightSideBar: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { register, setValue } = useForm();
  const options = [
    "Find the white cars",
    "Select all objects in this area",
    "How many containers are there in this area?",
    "Select all cars in this area",
  ];
  const handleOptionClick = (text: string) => {
    setValue("searchInput", text);
  };
  const handleSubmit = () => {};
  return (
    <>
      <SideBarContainer>
        <SideBarHeader>
          <TitleText>Custom Detection</TitleText>
          <TitleIcon>
            <TitleIconText>AI</TitleIconText>
          </TitleIcon>
        </SideBarHeader>
        <SearchBar
          isActive={isActive}
          onClick={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        >
          <SearchInput
            placeholder="Search by specifying an area"
            {...register("searchInput")}
          />
          <SearchIcon onClick={() => handleSubmit()} icon={faSearch} />
        </SearchBar>
        <OptionsArea>
          {options.map((option, index) => (
            <Option key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </Option>
          ))}
        </OptionsArea>
      </SideBarContainer>
    </>
  );
};

export default CustomRightSideBar;
