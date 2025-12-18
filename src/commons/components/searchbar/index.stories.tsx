import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./index";

const meta = {
  title: "Commons/Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "검색바의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "검색바의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "검색바의 테마",
    },
    disabled: {
      control: "boolean",
      description: "검색바 비활성화 여부",
    },
    placeholder: {
      control: "text",
      description: "검색바 플레이스홀더 텍스트",
    },
    onSearch: {
      action: "searched",
      description: "Enter 키 입력 시 실행되는 검색 핸들러",
    },
    onChange: {
      action: "changed",
      description: "입력값 변경 시 실행되는 핸들러",
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

// Primary 검색바 - Light Theme
export const PrimaryLight: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "primary",
    theme: "light",
  },
};

// Primary 검색바 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "primary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 검색바 - Light Theme
export const SecondaryLight: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "secondary",
    theme: "light",
  },
};

// Secondary 검색바 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "secondary",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 검색바 - Light Theme
export const TertiaryLight: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    variant: "tertiary",
    theme: "light",
  },
};

// Tertiary 검색바 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "Small SearchBar",
    size: "small",
  },
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    placeholder: "Medium SearchBar",
    size: "medium",
  },
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    placeholder: "Large SearchBar",
    size: "large",
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    placeholder: "Disabled SearchBar",
    disabled: true,
  },
};

// 값이 입력된 상태
export const WithValue: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
    defaultValue: "검색어 예시",
  },
};

// 검색 핸들러 포함
export const WithSearchHandler: Story = {
  args: {
    placeholder: "검색 후 Enter를 눌러보세요",
    onSearch: (value: string) => {
      console.log("Searching for:", value);
      alert(`검색어: ${value}`);
    },
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
        width: "400px",
      }}
    >
      <SearchBar size="small" placeholder="Small" />
      <SearchBar size="medium" placeholder="Medium" />
      <SearchBar size="large" placeholder="Large" />
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
        width: "400px",
      }}
    >
      <SearchBar variant="primary" theme="light" placeholder="Primary" />
      <SearchBar variant="secondary" theme="light" placeholder="Secondary" />
      <SearchBar variant="tertiary" theme="light" placeholder="Tertiary" />
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
        width: "400px",
      }}
    >
      <SearchBar variant="primary" theme="dark" placeholder="Primary" />
      <SearchBar variant="secondary" theme="dark" placeholder="Secondary" />
      <SearchBar variant="tertiary" theme="dark" placeholder="Tertiary" />
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
          <SearchBar
            variant="primary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SearchBar
            variant="primary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SearchBar
            variant="primary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SearchBar
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
          <SearchBar
            variant="secondary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SearchBar
            variant="secondary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SearchBar
            variant="secondary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SearchBar
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
          <SearchBar
            variant="tertiary"
            theme="light"
            size="small"
            placeholder="Small"
          />
          <SearchBar
            variant="tertiary"
            theme="light"
            size="medium"
            placeholder="Medium"
          />
          <SearchBar
            variant="tertiary"
            theme="light"
            size="large"
            placeholder="Large"
          />
          <SearchBar
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

// 테마별 종합 비교
export const ThemeComparison: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "32px",
        flexDirection: "column",
      }}
    >
      <div>
        <h3 style={{ marginBottom: "16px" }}>Light Theme</h3>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexDirection: "column",
            width: "400px",
          }}
        >
          <SearchBar variant="primary" theme="light" placeholder="Primary" />
          <SearchBar
            variant="secondary"
            theme="light"
            placeholder="Secondary"
          />
          <SearchBar variant="tertiary" theme="light" placeholder="Tertiary" />
        </div>
      </div>
      <div
        style={{
          padding: "20px",
          background: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "16px", color: "white" }}>Dark Theme</h3>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexDirection: "column",
            width: "400px",
          }}
        >
          <SearchBar variant="primary" theme="dark" placeholder="Primary" />
          <SearchBar variant="secondary" theme="dark" placeholder="Secondary" />
          <SearchBar variant="tertiary" theme="dark" placeholder="Tertiary" />
        </div>
      </div>
    </div>
  ),
};
