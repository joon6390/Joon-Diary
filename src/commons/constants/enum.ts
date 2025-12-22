/**
 * Enum Constants
 * 프로젝트에서 사용되는 enum 데이터 정의
 */

import { colors } from "./color";

/**
 * 감정(Emotion) Enum
 */
export enum EmotionType {
  Happy = "HAPPY",
  Sad = "SAD",
  Angry = "ANGRY",
  Surprise = "SURPRISE",
  Etc = "ETC",
}

/**
 * 감정 데이터 인터페이스
 */
export interface EmotionData {
  type: EmotionType;
  label: string;
  images: {
    medium: string;
    small: string;
  };
  color: string;
}

/**
 * 감정별 상세 데이터 맵
 */
export const emotionDataMap: Record<EmotionType, EmotionData> = {
  [EmotionType.Happy]: {
    type: EmotionType.Happy,
    label: "행복해요",
    images: {
      medium: "emotion-happy-m.png",
      small: "emotion-happy-s.png",
    },
    color: colors.red[60],
  },
  [EmotionType.Sad]: {
    type: EmotionType.Sad,
    label: "슬퍼요",
    images: {
      medium: "emotion-sad-m.png",
      small: "emotion-sad-s.png",
    },
    color: colors.blue[60],
  },
  [EmotionType.Angry]: {
    type: EmotionType.Angry,
    label: "화나요",
    images: {
      medium: "emotion-angry-m.png",
      small: "emotion-angry-s.png",
    },
    color: colors.gray[60],
  },
  [EmotionType.Surprise]: {
    type: EmotionType.Surprise,
    label: "놀랐어요",
    images: {
      medium: "emotion-surprise-m.png",
      small: "emotion-surprise-s.png",
    },
    color: colors.yellow[60],
  },
  [EmotionType.Etc]: {
    type: EmotionType.Etc,
    label: "기타",
    images: {
      medium: "emotion-etc-m.png",
      small: "emotion-etc-s.png",
    },
    color: colors.green[60],
  },
} as const;

/**
 * 모든 감정 데이터 배열 (피그마 디자인 순서: 행복해요, 슬퍼요, 놀랐어요, 화나요, 기타)
 */
export const emotionList: EmotionData[] = [
  emotionDataMap[EmotionType.Happy],
  emotionDataMap[EmotionType.Sad],
  emotionDataMap[EmotionType.Surprise],
  emotionDataMap[EmotionType.Angry],
  emotionDataMap[EmotionType.Etc],
];

/**
 * 감정 타입으로 데이터 조회
 */
export const getEmotionData = (type: EmotionType): EmotionData => {
  return emotionDataMap[type];
};
