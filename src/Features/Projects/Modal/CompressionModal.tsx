import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface FileSize {
  input_file_size: string;
  output_file_size: string;
  percentage: string;
}
interface ModalProps {
  url: string;
  setIsCompressionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaveClicked: React.Dispatch<React.SetStateAction<boolean>>;
  outputImageUrl: string;
  file_size: FileSize | undefined;
  // setIsReponse: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: #272727;
  border-radius: 12px;
  max-width: 1149px;
  max-height: 504px;
  width: 100%;
  height: 100%;
  position: relative;
  color: white;
  padding: 28px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ModalTitle = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  margin-right: auto;
`;

const CloseBtn = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalContents = styled.div`
  margin-top: 30px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImgCompress = styled.img`
  width: 400px;
  height: 400px;
  object-fit: contain;
`;

const ArrowIcon = styled(FontAwesomeIcon)`
  margin: 0 12px;
  width: 16px;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
`;

const RightContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: normal;
`;

const RightBox = styled.div`
  display: flex;
  padding: 24px 36px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #343434;
  max-width: 229px;
  max-height: 170px;
  width: 100%;
`;

const Ratio = styled.div`
  text-align: center;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 20px;
`;

const InteractionBox = styled.div`
  max-width: 157px;
  max-height: 72px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const VolumeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
`;

const VolumeTxt = styled.div`
  margin-top: 8px;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
`;

const LeftBar = styled.div`
  width: 52px;
  height: 56px;
  border-radius: 4px 4px 0px 0px;
  background-color: #7d7d7d;
`;

const RightBar = styled.div<{ percentage: number }>`
  width: 52px;
  min-height: 8px;
  height: ${({ percentage }) => 56 * percentage * 0.01}px;
  border-radius: 4px 4px 0px 0px;
  background-color: #13ed0e;
`;

const TxtBox = styled.div`
  display: flex;
  padding: 0px 4px;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
  height: 138px;
  margin-top: 24px;
`;

const Txt = styled.div`
  display: flex;
  align-items: center;
  font-family: Pretendard;
  font-size: 14px;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  width: 14px;
  height: 14px;
  margin-right: 8px;
`;

const SaveButton = styled.button`
  padding: 12px 100px;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: #272727;
  border: 0.4px solid #fff;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #fff;
    color: black;
  }
`;

const CompressionModal: React.FC<ModalProps> = ({
  url,
  setIsCompressionModal,
  setIsSaveClicked,
  outputImageUrl,
  file_size,
  // setIsReponse,
}) => {
  console.log(file_size);
  const [croppedBefore, setCroppedBefore] = useState<string>("");
  const [croppedAfter, setCroppedAfter] = useState<string>("");
  // 퍼센티지를 소수점 없이 표시
  const percentage = Math.floor(Number(file_size?.percentage.replace("%", "")));
  // 파일 크기를 소수점 첫째자리까지 표시
  const inputFileSize = (
    Number(file_size?.input_file_size.replace(" KB", "")) / 1024
  ).toFixed(1);
  const outputFileSize = (
    Number(file_size?.output_file_size.replace(" KB", "")) / 1024
  ).toFixed(1);

  //Compression 전 이미지의 가운데 부분을 임의로 잘라서 정사각형 형태로 캔버스를 그리고 그 잘린 정사각형 이미지를 모달에 띄움
  // 이미지를 크롭하는 함수
  const cropImage = (
    imageUrl: string,
    setCroppedImage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const image = new Image();

    image.src = imageUrl;
    image.crossOrigin = "anonymous"; // crossOrigin 설정
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) return;

      const centerX = image.width / 2;
      const centerY = image.height / 2;
      const cropSize = Math.min(image.width, image.height);
      const startX = centerX - cropSize / 2;
      const startY = centerY - cropSize / 2;

      canvas.width = 400;
      canvas.height = 400;
      context.drawImage(
        image,
        startX,
        startY,
        cropSize,
        cropSize,
        0,
        0,
        400,
        400
      );

      setCroppedImage(canvas.toDataURL("image/png"));
    };

    image.onerror = (error) => {
      console.error("Image failed to load", error);
    };
  };

  useEffect(() => {
    if (url) cropImage(url, setCroppedBefore);
  }, [url]);

  useEffect(() => {
    if (outputImageUrl) cropImage(outputImageUrl, setCroppedAfter);
  }, [outputImageUrl]);

  // useEffect(() => {
  //   setIsReponse(false);
  // }, []);

  const handleSaveClick = () => {
    //이미지를 blob객체로 만들고 url 생성
    fetch(outputImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = "compressed_image.png";
        link.click();
        URL.revokeObjectURL(url);
        setIsCompressionModal(false);
        setIsSaveClicked(true);
        setTimeout(() => {
          setIsSaveClicked(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error downloading the image", error);
      });
  };
  return (
    <ModalBackground onClick={() => setIsCompressionModal(false)}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Export</ModalTitle>
          <CloseBtn onClick={() => setIsCompressionModal(false)}>X</CloseBtn>
        </ModalHeader>
        <ModalContents>
          <ImgContainer>
            <ImgCompress src={croppedBefore} alt="Screenshot" />
            <ArrowIcon icon={faArrowRight} />
            <ImgCompress src={croppedAfter} alt="Screenshot" />
          </ImgContainer>
          <RightContents>
            <RightBox>
              <Ratio>{percentage}%</Ratio>
              <InteractionBox>
                <LeftBar />
                <ArrowIcon icon={faArrowRight} />
                <RightBar percentage={percentage} />
              </InteractionBox>
              <VolumeBox>
                <VolumeTxt>{inputFileSize}MB</VolumeTxt>
                <VolumeTxt>{outputFileSize}MB</VolumeTxt>
              </VolumeBox>
            </RightBox>
            <TxtBox>
              <Txt>
                <CheckIcon icon={faCheck} />
                Capacity is down
              </Txt>
              <Txt>
                <CheckIcon icon={faCheck} />
                The picture quality is the same
              </Txt>
            </TxtBox>
            <SaveButton onClick={handleSaveClick}>Save</SaveButton>
          </RightContents>
        </ModalContents>
      </ModalContainer>
    </ModalBackground>
  );
};

export default CompressionModal;
