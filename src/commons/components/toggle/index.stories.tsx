import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Toggle } from "./index";

const meta = {
  title: "Commons/Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "토글의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "토글의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "토글의 테마",
    },
    checked: {
      control: "boolean",
      description: "토글 체크 상태",
    },
    disabled: {
      control: "boolean",
      description: "토글 비활성화 여부",
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    checked: false,
  },
};

// Primary 토글 - Light Theme
export const PrimaryLight: Story = {
  args: {
    variant: "primary",
    theme: "light",
    checked: false,
  },
};

// Primary 토글 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    variant: "primary",
    theme: "dark",
    checked: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 토글 - Light Theme
export const SecondaryLight: Story = {
  args: {
    variant: "secondary",
    theme: "light",
    checked: false,
  },
};

// Secondary 토글 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    variant: "secondary",
    theme: "dark",
    checked: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 토글 - Light Theme
export const TertiaryLight: Story = {
  args: {
    variant: "tertiary",
    theme: "light",
    checked: false,
  },
};

// Tertiary 토글 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    variant: "tertiary",
    theme: "dark",
    checked: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Small 크기
export const SizeSmall: Story = {
  args: {
    size: "small",
    checked: false,
  },
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    size: "medium",
    checked: false,
  },
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    size: "large",
    checked: false,
  },
};

// Checked 상태
export const Checked: Story = {
  args: {
    checked: true,
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

// Disabled Checked 상태
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

// Interactive - 상태 변경 가능
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        variant="primary"
        theme="light"
      />
    );
  },
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  render: () => {
    const [checkedStates, setCheckedStates] = useState({
      small: false,
      medium: false,
      large: false,
    });

    return (
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Toggle
          size="small"
          checked={checkedStates.small}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, small: checked })
          }
        />
        <Toggle
          size="medium"
          checked={checkedStates.medium}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, medium: checked })
          }
        />
        <Toggle
          size="large"
          checked={checkedStates.large}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, large: checked })
          }
        />
      </div>
    );
  },
};

// 모든 Variant - Light Theme
export const AllVariantsLight: Story = {
  render: () => {
    const [checkedStates, setCheckedStates] = useState({
      primary: false,
      secondary: false,
      tertiary: false,
    });

    return (
      <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
        <Toggle
          variant="primary"
          theme="light"
          checked={checkedStates.primary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, primary: checked })
          }
        />
        <Toggle
          variant="secondary"
          theme="light"
          checked={checkedStates.secondary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, secondary: checked })
          }
        />
        <Toggle
          variant="tertiary"
          theme="light"
          checked={checkedStates.tertiary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, tertiary: checked })
          }
        />
      </div>
    );
  },
};

// 모든 Variant - Dark Theme
export const AllVariantsDark: Story = {
  render: () => {
    const [checkedStates, setCheckedStates] = useState({
      primary: false,
      secondary: false,
      tertiary: false,
    });

    return (
      <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
        <Toggle
          variant="primary"
          theme="dark"
          checked={checkedStates.primary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, primary: checked })
          }
        />
        <Toggle
          variant="secondary"
          theme="dark"
          checked={checkedStates.secondary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, secondary: checked })
          }
        />
        <Toggle
          variant="tertiary"
          theme="dark"
          checked={checkedStates.tertiary}
          onChange={(checked) =>
            setCheckedStates({ ...checkedStates, tertiary: checked })
          }
        />
      </div>
    );
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// 모든 상태 종합
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Primary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Toggle
            variant="primary"
            theme="light"
            size="small"
            checked={false}
          />
          <Toggle
            variant="primary"
            theme="light"
            size="medium"
            checked={false}
          />
          <Toggle
            variant="primary"
            theme="light"
            size="large"
            checked={false}
          />
          <Toggle variant="primary" theme="light" checked={true} />
          <Toggle variant="primary" theme="light" disabled checked={false} />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Secondary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Toggle
            variant="secondary"
            theme="light"
            size="small"
            checked={false}
          />
          <Toggle
            variant="secondary"
            theme="light"
            size="medium"
            checked={false}
          />
          <Toggle
            variant="secondary"
            theme="light"
            size="large"
            checked={false}
          />
          <Toggle variant="secondary" theme="light" checked={true} />
          <Toggle variant="secondary" theme="light" disabled checked={false} />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Tertiary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Toggle
            variant="tertiary"
            theme="light"
            size="small"
            checked={false}
          />
          <Toggle
            variant="tertiary"
            theme="light"
            size="medium"
            checked={false}
          />
          <Toggle
            variant="tertiary"
            theme="light"
            size="large"
            checked={false}
          />
          <Toggle variant="tertiary" theme="light" checked={true} />
          <Toggle variant="tertiary" theme="light" disabled checked={false} />
        </div>
      </div>
    </div>
  ),
};
