import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./index";

const meta = {
  title: "Commons/Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "인풋의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "인풋의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "인풋의 테마",
    },
    disabled: {
      control: "boolean",
      description: "인풋 비활성화 여부",
    },
    placeholder: {
      control: "text",
      description: "인풋 플레이스홀더 텍스트",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url"],
      description: "인풋 타입",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

// Primary 인풋 - Light Theme
export const PrimaryLight: Story = {
  args: {
    placeholder: "Primary Input",
    variant: "primary",
    theme: "light",
  },
};

// Primary 인풋 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    placeholder: "Primary Input",
    variant: "primary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 인풋 - Light Theme
export const SecondaryLight: Story = {
  args: {
    placeholder: "Secondary Input",
    variant: "secondary",
    theme: "light",
  },
};

// Secondary 인풋 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    placeholder: "Secondary Input",
    variant: "secondary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 인풋 - Light Theme
export const TertiaryLight: Story = {
  args: {
    placeholder: "Tertiary Input",
    variant: "tertiary",
    theme: "light",
  },
};

// Tertiary 인풋 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    placeholder: "Tertiary Input",
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
    placeholder: "Small Input",
    size: "small",
  },
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    placeholder: "Medium Input",
    size: "medium",
  },
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    placeholder: "Large Input",
    size: "large",
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    placeholder: "Disabled Input",
    disabled: true,
  },
};

// 값이 입력된 상태
export const WithValue: Story = {
  args: {
    placeholder: "Enter text...",
    defaultValue: "Input with value",
  },
};

// 다양한 Input 타입
export const TypeEmail: Story = {
  args: {
    type: "email",
    placeholder: "Enter email...",
  },
};

export const TypePassword: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const TypeNumber: Story = {
  args: {
    type: "number",
    placeholder: "Enter number...",
  },
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
        width: "300px",
      }}
    >
      <Input size="small" placeholder="Small" />
      <Input size="medium" placeholder="Medium" />
      <Input size="large" placeholder="Large" />
    </div>
  ),
};

// 모든 Variant - Light Theme
export const AllVariantsLight: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
        width: "300px",
      }}
    >
      <Input variant="primary" theme="light" placeholder="Primary" />
      <Input variant="secondary" theme="light" placeholder="Secondary" />
      <Input variant="tertiary" theme="light" placeholder="Tertiary" />
    </div>
  ),
};

// 모든 Variant - Dark Theme
export const AllVariantsDark: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
        width: "300px",
      }}
    >
      <Input variant="primary" theme="dark" placeholder="Primary" />
      <Input variant="secondary" theme="dark" placeholder="Secondary" />
      <Input variant="tertiary" theme="dark" placeholder="Tertiary" />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// 모든 상태 종합
export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "32px",
        flexDirection: "column",
        width: "600px",
      }}
    >
      <div>
        <h3 style={{ marginBottom: "16px" }}>Primary Variants</h3>
        <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
          <Input
            variant="primary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <Input
            variant="primary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <Input
            variant="primary"
            theme="light"
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Secondary Variants</h3>
        <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
          <Input
            variant="secondary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <Input
            variant="secondary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <Input
            variant="secondary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <Input
            variant="secondary"
            theme="light"
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Tertiary Variants</h3>
        <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
          <Input
            variant="tertiary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <Input
            variant="tertiary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <Input
            variant="tertiary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <Input
            variant="tertiary"
            theme="light"
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
    </div>
  ),
};

// 다양한 입력 타입 종합
export const AllInputTypes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
        width: "400px",
      }}
    >
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Telephone input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
};
