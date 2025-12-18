import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./index";

const meta = {
  title: "Commons/Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "버튼의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "버튼의 테마",
    },
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 여부",
    },
    children: {
      control: "text",
      description: "버튼 내부 텍스트",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

// Primary 버튼 - Light Theme
export const PrimaryLight: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    theme: "light",
  },
};

// Primary 버튼 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 버튼 - Light Theme
export const SecondaryLight: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    theme: "light",
  },
};

// Secondary 버튼 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 버튼 - Light Theme
export const TertiaryLight: Story = {
  args: {
    children: "Tertiary Button",
    variant: "tertiary",
    theme: "light",
  },
};

// Tertiary 버튼 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    children: "Tertiary Button",
    variant: "tertiary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Small 크기
export const SizeSmall: Story = {
  args: {
    children: "Small Button",
    size: "small",
  },
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    children: "Medium Button",
    size: "medium",
  },
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    children: "Large Button",
    size: "large",
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

// 모든 Variant - Light Theme
export const AllVariantsLight: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <Button variant="primary" theme="light">
        Primary
      </Button>
      <Button variant="secondary" theme="light">
        Secondary
      </Button>
      <Button variant="tertiary" theme="light">
        Tertiary
      </Button>
    </div>
  ),
};

// 모든 Variant - Dark Theme
export const AllVariantsDark: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <Button variant="primary" theme="dark">
        Primary
      </Button>
      <Button variant="secondary" theme="dark">
        Secondary
      </Button>
      <Button variant="tertiary" theme="dark">
        Tertiary
      </Button>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// 모든 상태 종합
export const AllStates: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Primary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Button variant="primary" theme="light" size="small">
            Small
          </Button>
          <Button variant="primary" theme="light" size="medium">
            Medium
          </Button>
          <Button variant="primary" theme="light" size="large">
            Large
          </Button>
          <Button variant="primary" theme="light" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Secondary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Button variant="secondary" theme="light" size="small">
            Small
          </Button>
          <Button variant="secondary" theme="light" size="medium">
            Medium
          </Button>
          <Button variant="secondary" theme="light" size="large">
            Large
          </Button>
          <Button variant="secondary" theme="light" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Tertiary Variants</h3>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Button variant="tertiary" theme="light" size="small">
            Small
          </Button>
          <Button variant="tertiary" theme="light" size="medium">
            Medium
          </Button>
          <Button variant="tertiary" theme="light" size="large">
            Large
          </Button>
          <Button variant="tertiary" theme="light" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
};
