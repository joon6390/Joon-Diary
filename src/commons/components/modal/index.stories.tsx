import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Modal } from "./index";

const meta = {
  title: "Commons/Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "danger"],
      description: "Modal의 variant를 설정합니다.",
    },
    actions: {
      control: "select",
      options: ["single", "dual"],
      description: "버튼의 개수를 설정합니다.",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Modal의 테마를 설정합니다.",
    },
    title: {
      control: "text",
      description: "Modal의 제목을 설정합니다.",
    },
    description: {
      control: "text",
      description: "Modal의 설명을 설정합니다.",
    },
    primaryButtonText: {
      control: "text",
      description: "주요 버튼의 텍스트를 설정합니다.",
    },
    secondaryButtonText: {
      control: "text",
      description: "보조 버튼의 텍스트를 설정합니다.",
    },
    disabled: {
      control: "boolean",
      description: "Modal의 비활성화 상태를 설정합니다.",
    },
    onPrimaryClick: { action: "primary clicked" },
    onSecondaryClick: { action: "secondary clicked" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "알림",
    description: "작업이 완료되었습니다.",
    primaryButtonText: "확인",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
};

// Info 모달 - 이중 버튼
export const DualActions: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "확인",
    description: "이 작업을 계속 진행하시겠습니까?",
    primaryButtonText: "확인",
    secondaryButtonText: "취소",
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
};

// Info 모달 - Dark Theme
export const DarkTheme: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "dark",
    title: "알림",
    description: "작업이 완료되었습니다.",
    primaryButtonText: "확인",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Info 모달 - Dark Theme, 이중 버튼
export const DarkThemeDualActions: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "dark",
    title: "확인",
    description: "이 작업을 계속 진행하시겠습니까?",
    primaryButtonText: "확인",
    secondaryButtonText: "취소",
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Danger 모달 - Light Theme
export const DangerVariant: Story = {
  args: {
    variant: "danger",
    actions: "single",
    theme: "light",
    title: "경고",
    description: "이 작업은 되돌릴 수 없습니다.",
    primaryButtonText: "삭제",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
};

// Danger 모달 - 이중 버튼
export const DangerVariantDualActions: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "정말 삭제하시겠습니까?",
    description: "삭제된 데이터는 복구할 수 없습니다.",
    primaryButtonText: "삭제",
    secondaryButtonText: "취소",
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
};

// Danger 모달 - Dark Theme
export const DangerVariantDarkTheme: Story = {
  args: {
    variant: "danger",
    actions: "single",
    theme: "dark",
    title: "경고",
    description: "이 작업은 되돌릴 수 없습니다.",
    primaryButtonText: "삭제",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Danger 모달 - Dark Theme, 이중 버튼
export const DangerVariantDarkThemeDualActions: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "dark",
    title: "정말 삭제하시겠습니까?",
    description: "삭제된 데이터는 복구할 수 없습니다.",
    primaryButtonText: "삭제",
    secondaryButtonText: "취소",
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "처리 중",
    description: "잠시만 기다려주세요.",
    primaryButtonText: "확인",
    disabled: true,
    onPrimaryClick: () => console.log("Primary clicked"),
  },
};

// Disabled 상태 - 이중 버튼
export const DisabledDualActions: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "처리 중",
    description: "잠시만 기다려주세요.",
    primaryButtonText: "확인",
    secondaryButtonText: "취소",
    disabled: true,
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
};

// 긴 텍스트
export const LongText: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "매우 긴 제목을 가진 모달 테스트입니다",
    description:
      "이것은 매우 긴 설명 텍스트를 가진 모달입니다. 텍스트가 길어질 경우 어떻게 표시되는지 확인하기 위한 테스트입니다.",
    primaryButtonText: "확인",
    secondaryButtonText: "취소",
    onPrimaryClick: () => console.log("Primary clicked"),
    onSecondaryClick: () => console.log("Secondary clicked"),
  },
};

// 모든 Variants - Light Theme
export const AllVariantsLight: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "알림",
    description: "작업이 완료되었습니다.",
    primaryButtonText: "확인",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Info - Single Button</h3>
        <Modal
          variant="info"
          actions="single"
          theme="light"
          title="알림"
          description="작업이 완료되었습니다."
          primaryButtonText="확인"
          onPrimaryClick={() => console.log("Primary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Info - Dual Buttons</h3>
        <Modal
          variant="info"
          actions="dual"
          theme="light"
          title="확인"
          description="이 작업을 계속 진행하시겠습니까?"
          primaryButtonText="확인"
          secondaryButtonText="취소"
          onPrimaryClick={() => console.log("Primary clicked")}
          onSecondaryClick={() => console.log("Secondary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Danger - Single Button</h3>
        <Modal
          variant="danger"
          actions="single"
          theme="light"
          title="경고"
          description="이 작업은 되돌릴 수 없습니다."
          primaryButtonText="삭제"
          onPrimaryClick={() => console.log("Primary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Danger - Dual Buttons</h3>
        <Modal
          variant="danger"
          actions="dual"
          theme="light"
          title="정말 삭제하시겠습니까?"
          description="삭제된 데이터는 복구할 수 없습니다."
          primaryButtonText="삭제"
          secondaryButtonText="취소"
          onPrimaryClick={() => console.log("Primary clicked")}
          onSecondaryClick={() => console.log("Secondary clicked")}
        />
      </div>
    </div>
  ),
};

// 모든 Variants - Dark Theme
export const AllVariantsDark: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "dark",
    title: "알림",
    description: "작업이 완료되었습니다.",
    primaryButtonText: "확인",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px", color: "#ffffff" }}>
          Info - Single Button
        </h3>
        <Modal
          variant="info"
          actions="single"
          theme="dark"
          title="알림"
          description="작업이 완료되었습니다."
          primaryButtonText="확인"
          onPrimaryClick={() => console.log("Primary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px", color: "#ffffff" }}>
          Info - Dual Buttons
        </h3>
        <Modal
          variant="info"
          actions="dual"
          theme="dark"
          title="확인"
          description="이 작업을 계속 진행하시겠습니까?"
          primaryButtonText="확인"
          secondaryButtonText="취소"
          onPrimaryClick={() => console.log("Primary clicked")}
          onSecondaryClick={() => console.log("Secondary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px", color: "#ffffff" }}>
          Danger - Single Button
        </h3>
        <Modal
          variant="danger"
          actions="single"
          theme="dark"
          title="경고"
          description="이 작업은 되돌릴 수 없습니다."
          primaryButtonText="삭제"
          onPrimaryClick={() => console.log("Primary clicked")}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "16px", color: "#ffffff" }}>
          Danger - Dual Buttons
        </h3>
        <Modal
          variant="danger"
          actions="dual"
          theme="dark"
          title="정말 삭제하시겠습니까?"
          description="삭제된 데이터는 복구할 수 없습니다."
          primaryButtonText="삭제"
          secondaryButtonText="취소"
          onPrimaryClick={() => console.log("Primary clicked")}
          onSecondaryClick={() => console.log("Secondary clicked")}
        />
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
    variant: "info",
    actions: "single",
    theme: "light",
    title: "알림",
    description: "작업이 완료되었습니다.",
    primaryButtonText: "확인",
    onPrimaryClick: () => console.log("Primary clicked"),
  },
  render: () => (
    <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Info Variants - Light Theme</h3>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="알림"
            description="작업이 완료되었습니다."
            primaryButtonText="확인"
            onPrimaryClick={() => console.log("Primary clicked")}
          />
          <Modal
            variant="info"
            actions="dual"
            theme="light"
            title="확인"
            description="이 작업을 계속 진행하시겠습니까?"
            primaryButtonText="확인"
            secondaryButtonText="취소"
            onPrimaryClick={() => console.log("Primary clicked")}
            onSecondaryClick={() => console.log("Secondary clicked")}
          />
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="처리 중"
            description="잠시만 기다려주세요."
            primaryButtonText="확인"
            disabled={true}
            onPrimaryClick={() => console.log("Primary clicked")}
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: "16px" }}>Danger Variants - Light Theme</h3>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Modal
            variant="danger"
            actions="single"
            theme="light"
            title="경고"
            description="이 작업은 되돌릴 수 없습니다."
            primaryButtonText="삭제"
            onPrimaryClick={() => console.log("Primary clicked")}
          />
          <Modal
            variant="danger"
            actions="dual"
            theme="light"
            title="정말 삭제하시겠습니까?"
            description="삭제된 데이터는 복구할 수 없습니다."
            primaryButtonText="삭제"
            secondaryButtonText="취소"
            onPrimaryClick={() => console.log("Primary clicked")}
            onSecondaryClick={() => console.log("Secondary clicked")}
          />
        </div>
      </div>
    </div>
  ),
};
