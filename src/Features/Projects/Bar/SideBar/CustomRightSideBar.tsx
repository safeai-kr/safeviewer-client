import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { colors } from "../../../../Utils/colors";

interface BarProps {
  setSearchTxt: React.Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  modelOutput: ModelOutput | null;
  searchTxt: string;
}

interface FormInputs {
  searchInput: string;
}

interface ModelOutput {
  image_url: string;
  results: string;
  status: string;
  status_message: string;
}

interface Result {
  label: number;
  score: number;
  oriented_bbox: [number, number][];
}

const SideBarContainer = styled.div`
  width: 296px;
  height: 100%;
  background-color: ${colors.default900};
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
  color: ${colors.default900};
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
  background-color: ${colors.default900};
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

const ResultContainer = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ResultTotal = styled.div`
  color: #cdced7;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
`;

const ResultContents = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ResultTxt = styled.div`
  color: #cdced7;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  margin-left: 6px;
`;

const ResultAmount = styled.div`
  color: #cdced7;
  text-align: right;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  background-color: ${({ color }) => color};
  border-radius: 2px;
`;

const CustomRightSideBar: React.FC<BarProps> = ({
  setSearchTxt,
  searchTxt,
  isLoading,
  modelOutput,
}) => {
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!modelOutput) return;

    const results: Result[] = JSON.parse(modelOutput.results);
    let filtered: Result[] = [];

    switch (searchTxt) {
      case "Find the cars":
        filtered = results.filter(
          (result) => result.label === 9 || result.label === 10
        );
        break;
      case "How many containers are there in this area?":
        filtered = results.filter((result) => result.label === 2);
        break;
      case "Select all objects in this area":
      default:
        filtered = results;
        break;
    }

    setFilteredResults(filtered);
  }, [modelOutput, searchTxt]);

  const labelColorMap: { [key: number]: string } = {
    0: "#FF9635",
    1: "#16E78F",
    2: "#FF42EC",
    9: "#E1FF27",
    10: "#E1FF27",
  };

  const labelNameMap: { [key: number]: string } = {
    0: "Plane",
    1: "Ship",
    2: "Storage Tank",
    9: "Vehicle",
    10: "Vehicle",
  };

  const options = [
    "Find the cars",
    "How many containers are there in this area?",
    "Select all objects in this area",
  ];

  const [isActive, setIsActive] = useState<boolean>(false);
  const { register, setValue, handleSubmit } = useForm<FormInputs>();

  const handleOptionClick = (text: string) => {
    setValue("searchInput", text);
  };

  const onSubmit: SubmitHandler<FormInputs> = (data: {
    searchInput: string;
  }) => {
    setSearchTxt(data.searchInput);
  };

  useEffect(() => {
    if (!isLoading) setValue("searchInput", "");
  }, [isLoading]);

  const labelCounts = filteredResults.reduce(
    (acc: { [key: number]: number }, result) => {
      acc[result.label] = (acc[result.label] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCount = filteredResults.length;

  return (
    <>
      <SideBarContainer>
        <SideBarHeader>
          <TitleText>Custom Detection</TitleText>
          <TitleIcon>
            <TitleIconText>AI</TitleIconText>
          </TitleIcon>
        </SideBarHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SearchBar
            isActive={isActive}
            onClick={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          >
            <SearchInput
              placeholder="Search by specifying an area"
              {...register("searchInput")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <SearchIcon onClick={handleSubmit(onSubmit)} icon={faSearch} />
          </SearchBar>
        </form>
        {!modelOutput && (
          <OptionsArea>
            {options.map((option, index) => (
              <Option key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </Option>
            ))}
          </OptionsArea>
        )}
        {modelOutput && (
          <ResultContainer>
            <ResultTotal>{totalCount} results</ResultTotal>
            {Object.entries(labelCounts).map(([label, count]) => (
              <ResultContents key={label}>
                <LabelContainer>
                  <ColorBox color={labelColorMap[parseInt(label, 10)]} />
                  <ResultTxt>{labelNameMap[parseInt(label, 10)]}</ResultTxt>
                </LabelContainer>
                <ResultAmount>{count}</ResultAmount>
              </ResultContents>
            ))}
          </ResultContainer>
        )}
      </SideBarContainer>
    </>
  );
};

export default CustomRightSideBar;
