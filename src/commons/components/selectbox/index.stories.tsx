import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectBox } from "./index";
import { useState } from "react";

const meta = {
  title: "Commons/Components/SelectBox",
  component: SelectBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "선택 가능한 옵션 목록",
    },
    value: {
      control: "text",
      description: "현재 선택된 값",
    },
    onChange: {
      action: "changed",
      description: "값이 변경될 때 호출되는 콜백",
    },
    placeholder: {
      control: "text",
      description: "선택되지 않았을 때 표시되는 텍스트",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "셀렉트박스의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "셀렉트박스의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "셀렉트박스의 테마",
    },
    disabled: {
      control: "boolean",
      description: "셀렉트박스 비활성화 여부",
    },
  },
} satisfies Meta<typeof SelectBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 옵션 데이터
const sampleOptions = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2" },
  { value: "option3", label: "옵션 3" },
  { value: "option4", label: "옵션 4" },
];

const categoryOptions = [
  { value: "all", label: "전체" },
  { value: "electronics", label: "전자제품" },
  { value: "fashion", label: "패션" },
  { value: "food", label: "식품" },
  { value: "books", label: "도서" },
];

// 기본 스토리
export const Default: Story = {
  args: {
    options: sampleOptions,
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "선택하세요",
  },
};

// Primary 셀렉트박스 - Light Theme
export const PrimaryLight: Story = {
  args: {
    options: categoryOptions,
    variant: "primary",
    theme: "light",
    placeholder: "카테고리 선택",
  },
};

// Primary 셀렉트박스 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    options: categoryOptions,
    variant: "primary",
    theme: "dark",
    placeholder: "카테고리 선택",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 셀렉트박스 - Light Theme
export const SecondaryLight: Story = {
  args: {
    options: categoryOptions,
    variant: "secondary",
    theme: "light",
    placeholder: "카테고리 선택",
  },
};

// Secondary 셀렉트박스 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    options: categoryOptions,
    variant: "secondary",
    theme: "dark",
    placeholder: "카테고리 선택",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 셀렉트박스 - Light Theme
export const TertiaryLight: Story = {
  args: {
    options: categoryOptions,
    variant: "tertiary",
    theme: "light",
    placeholder: "카테고리 선택",
  },
};

// Tertiary 셀렉트박스 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    options: categoryOptions,
    variant: "tertiary",
    theme: "dark",
    placeholder: "카테고리 선택",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Small 크기
export const SizeSmall: Story = {
  args: {
    options: sampleOptions,
    size: "small",
    placeholder: "선택",
  },
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    options: sampleOptions,
    size: "medium",
    placeholder: "선택하세요",
  },
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    options: sampleOptions,
    size: "large",
    placeholder: "선택하세요",
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    options: sampleOptions,
    disabled: true,
    placeholder: "비활성화됨",
  },
};

// 값이 선택된 상태
export const WithSelectedValue: Story = {
  args: {
    options: categoryOptions,
    value: "electronics",
    placeholder: "카테고리 선택",
  },
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  args: {
    options: sampleOptions,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <SelectBox options={sampleOptions} size="small" placeholder="Small" />
      <SelectBox options={sampleOptions} size="medium" placeholder="Medium" />
      <SelectBox options={sampleOptions} size="large" placeholder="Large" />
    </div>
  ),
};

// 모든 Variant - Light Theme
export const AllVariantsLight: Story = {
  args: {
    options: categoryOptions,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <SelectBox
        options={categoryOptions}
        variant="primary"
        theme="light"
        placeholder="Primary"
      />
      <SelectBox
        options={categoryOptions}
        variant="secondary"
        theme="light"
        placeholder="Secondary"
      />
      <SelectBox
        options={categoryOptions}
        variant="tertiary"
        theme="light"
        placeholder="Tertiary"
      />
    </div>
  ),
};

// 모든 Variant - Dark Theme
export const AllVariantsDark: Story = {
  args: {
    options: categoryOptions,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <SelectBox
        options={categoryOptions}
        variant="primary"
        theme="dark"
        placeholder="Primary"
      />
      <SelectBox
        options={categoryOptions}
        variant="secondary"
        theme="dark"
        placeholder="Secondary"
      />
      <SelectBox
        options={categoryOptions}
        variant="tertiary"
        theme="dark"
        placeholder="Tertiary"
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// 모든 상태 종합
export const AllStates: Story = {
  args: {
    options: sampleOptions,
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Primary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <SelectBox
            options={sampleOptions}
            variant="primary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SelectBox
            options={sampleOptions}
            variant="primary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SelectBox
            options={sampleOptions}
            variant="primary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SelectBox
            options={sampleOptions}
            variant="primary"
            theme="light"
            disabled
            placeholder="Disabled"
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Secondary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <SelectBox
            options={sampleOptions}
            variant="secondary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SelectBox
            options={sampleOptions}
            variant="secondary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SelectBox
            options={sampleOptions}
            variant="secondary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SelectBox
            options={sampleOptions}
            variant="secondary"
            theme="light"
            disabled
            placeholder="Disabled"
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Tertiary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <SelectBox
            options={sampleOptions}
            variant="tertiary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SelectBox
            options={sampleOptions}
            variant="tertiary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SelectBox
            options={sampleOptions}
            variant="tertiary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SelectBox
            options={sampleOptions}
            variant="tertiary"
            theme="light"
            disabled
            placeholder="Disabled"
          />
        </div>
      </div>
    </div>
  ),
};

// 상호작용 예제 (Controlled Component)
export const Interactive: Story = {
  args: {
    options: categoryOptions,
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedValue, setSelectedValue] = useState<string>("");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <SelectBox
          options={categoryOptions}
          value={selectedValue}
          onChange={setSelectedValue}
          placeholder="카테고리를 선택하세요"
        />
        <div style={{ padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            선택된 값: <strong>{selectedValue || "없음"}</strong>
          </p>
        </div>
      </div>
    );
  },
};

// 다양한 옵션 개수
export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `옵션 ${i + 1}`,
    })),
    placeholder: "옵션 선택",
  },
};

// 짧은 옵션 텍스트
export const ShortOptions: Story = {
  args: {
    options: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
    ],
    placeholder: "선택",
  },
};

// 긴 옵션 텍스트
export const LongOptions: Story = {
  args: {
    options: [
      { value: "long1", label: "매우 긴 텍스트를 가진 첫 번째 옵션" },
      { value: "long2", label: "아주 긴 텍스트를 가진 두 번째 옵션" },
      { value: "long3", label: "상당히 긴 텍스트를 가진 세 번째 옵션" },
    ],
    placeholder: "선택하세요",
  },
};
