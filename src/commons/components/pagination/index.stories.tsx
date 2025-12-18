import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Pagination } from "./index";

const meta = {
  title: "Commons/Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "페이지네이션의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "페이지네이션의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "페이지네이션의 테마",
    },
    currentPage: {
      control: "number",
      description: "현재 페이지 번호",
    },
    totalPages: {
      control: "number",
      description: "전체 페이지 수",
    },
    maxVisiblePages: {
      control: "number",
      description: "한 번에 표시할 최대 페이지 수",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive Wrapper Component
const PaginationWrapper = ({
  variant = "primary",
  size = "medium",
  theme = "light",
  totalPages = 10,
  maxVisiblePages = 5,
}: {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  totalPages?: number;
  maxVisiblePages?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      variant={variant}
      size={size}
      theme={theme}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      maxVisiblePages={maxVisiblePages}
    />
  );
};

// 기본 스토리
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper />,
};

// Primary 페이지네이션 - Light Theme
export const PrimaryLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="primary" theme="light" />,
};

// Primary 페이지네이션 - Dark Theme
export const PrimaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="primary" theme="dark" />,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Secondary 페이지네이션 - Light Theme
export const SecondaryLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="secondary" theme="light" />,
};

// Secondary 페이지네이션 - Dark Theme
export const SecondaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="secondary" theme="dark" />,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary 페이지네이션 - Light Theme
export const TertiaryLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="tertiary" theme="light" />,
};

// Tertiary 페이지네이션 - Dark Theme
export const TertiaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper variant="tertiary" theme="dark" />,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Small 크기
export const SizeSmall: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper size="small" />,
};

// Medium 크기
export const SizeMedium: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper size="medium" />,
};

// Large 크기
export const SizeLarge: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper size="large" />,
};

// 적은 페이지 수
export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper totalPages={3} />,
};

// 많은 페이지 수
export const ManyPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper totalPages={50} />,
};

// 커스텀 최대 표시 페이지 수
export const CustomMaxVisiblePages: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWrapper totalPages={20} maxVisiblePages={7} />,
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Small</h4>
        <PaginationWrapper size="small" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Medium</h4>
        <PaginationWrapper size="medium" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Large</h4>
        <PaginationWrapper size="large" />
      </div>
    </div>
  ),
};

// 모든 Variant - Light Theme
export const AllVariantsLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Primary</h4>
        <PaginationWrapper variant="primary" theme="light" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Secondary</h4>
        <PaginationWrapper variant="secondary" theme="light" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Tertiary</h4>
        <PaginationWrapper variant="tertiary" theme="light" />
      </div>
    </div>
  ),
};

// 모든 Variant - Dark Theme
export const AllVariantsDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "white" }}>
          Primary
        </h4>
        <PaginationWrapper variant="primary" theme="dark" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "white" }}>
          Secondary
        </h4>
        <PaginationWrapper variant="secondary" theme="dark" />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "white" }}>
          Tertiary
        </h4>
        <PaginationWrapper variant="tertiary" theme="dark" />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// 모든 상태 종합
export const AllStates: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Primary Variants</h3>
        <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Small</h4>
            <PaginationWrapper variant="primary" theme="light" size="small" />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Medium</h4>
            <PaginationWrapper variant="primary" theme="light" size="medium" />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Large</h4>
            <PaginationWrapper variant="primary" theme="light" size="large" />
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Secondary Variants</h3>
        <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Small</h4>
            <PaginationWrapper variant="secondary" theme="light" size="small" />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Medium</h4>
            <PaginationWrapper
              variant="secondary"
              theme="light"
              size="medium"
            />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Large</h4>
            <PaginationWrapper variant="secondary" theme="light" size="large" />
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Tertiary Variants</h3>
        <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Small</h4>
            <PaginationWrapper variant="tertiary" theme="light" size="small" />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Medium</h4>
            <PaginationWrapper variant="tertiary" theme="light" size="medium" />
          </div>
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "12px" }}>Large</h4>
            <PaginationWrapper variant="tertiary" theme="light" size="large" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// 다양한 페이지 수 종합
export const AllPageCounts: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>
          3 Pages Total
        </h4>
        <PaginationWrapper totalPages={3} />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>
          10 Pages Total (Default)
        </h4>
        <PaginationWrapper totalPages={10} />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>
          20 Pages Total
        </h4>
        <PaginationWrapper totalPages={20} />
      </div>
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>
          50 Pages Total
        </h4>
        <PaginationWrapper totalPages={50} />
      </div>
    </div>
  ),
};
