"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import {
  getEmotionData,
  emotionList,
  EmotionType,
} from "@/commons/constants/enum";
import { Modal } from "@/commons/components/modal";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { paths } from "@/commons/constants/url";
import { useBindingHook } from "./hooks/index.binding.hook";
import { useRetrospectFormHook } from "./hooks/index.retrospect.form.hook";
import { useRetrospectBindingHook } from "./hooks/index.retrospect.binding.hook";
import { useUpdateHook } from "./hooks/index.update.hook";
import { useDeleteHook } from "./hooks/index.delete.hook";
import {
  useUpdateRetrospect,
  useDeleteRetrospect,
} from "@/commons/hooks/use-retrospects";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import styles from "./styles.module.css";

export default function DiariesDetail() {
  const router = useRouter();
  const { diary, isLoading, formattedDate } = useBindingHook();
  const { getUser } = useAuth();
  const { control, handleSubmit, isSubmitDisabled } = useRetrospectFormHook();
  const { retrospects } = useRetrospectBindingHook();
  const {
    isEditMode,
    setIsEditMode,
    control: updateControl,
    handleSubmit: handleUpdateSubmit,
    handleCancel,
    errors: updateErrors,
    isSubmitDisabled: isUpdateSubmitDisabled,
  } = useUpdateHook(diary);
  const { handleDelete } = useDeleteHook(diary);
  const { openModal, closeModal } = useModal();
  const updateRetrospect = useUpdateRetrospect();
  const deleteRetrospect = useDeleteRetrospect();
  const [editingRetrospectId, setEditingRetrospectId] = useState<number | null>(
    null
  );
  const [editingRetrospectContent, setEditingRetrospectContent] =
    useState<string>("");

  const handleBackToDiaries = () => {
    router.push(paths.diaries.list);
  };

  // 일기 데이터가 없거나 로딩 중일 때 처리
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div className={styles.gap64}></div>
        <div className={styles.loadingText}>로딩 중...</div>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div className={styles.gap64}></div>
        <div>일기를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const emotionData = getEmotionData(diary.emotion);

  // 본인이 작성한 일기인지 확인
  const currentUser = getUser();
  const isOwner = currentUser ? diary.userId === currentUser._id : false;

  // userName이 없으면 현재 사용자 이름 사용 (기존 데이터 호환성)
  const displayName =
    diary.userName ||
    (diary.userId === currentUser?._id ? currentUser?.name : null);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(diary.content);
      // 복사 성공 모달 표시
      const modalId = openModal(
        <Modal
          variant="info"
          actions="single"
          theme="light"
          title="복사 완료"
          description="내용이 클립보드에 복사되었습니다."
          primaryButtonText="확인"
          onPrimaryClick={() => {
            closeModal(modalId);
          }}
          data-testid="copy-success-modal"
          data-testid-title="copy-success-modal-title"
          data-testid-description="copy-success-modal-description"
          data-testid-primary-button="copy-success-modal-ok-button"
        />,
        { preventBackdropClose: true }
      );
    } catch (error) {
      console.error("복사 실패:", error);
      // 복사 실패 모달 표시
      const modalId = openModal(
        <Modal
          variant="danger"
          actions="single"
          theme="light"
          title="복사 실패"
          description="복사에 실패했습니다. 다시 시도해주세요."
          primaryButtonText="확인"
          onPrimaryClick={() => {
            closeModal(modalId);
          }}
          data-testid="copy-fail-modal"
          data-testid-title="copy-fail-modal-title"
          data-testid-description="copy-fail-modal-description"
          data-testid-primary-button="copy-fail-modal-ok-button"
        />,
        { preventBackdropClose: true }
      );
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDeleteClick = () => {
    const modalId = openModal(
      <Modal
        variant="danger"
        actions="dual"
        theme="light"
        title="일기 삭제"
        description="일기를 삭제 하시겠어요?"
        primaryButtonText="삭제"
        secondaryButtonText="취소"
        onPrimaryClick={() => {
          handleDelete();
          closeModal(modalId);
        }}
        onSecondaryClick={() => {
          closeModal(modalId);
        }}
        data-testid="diary-delete-modal"
        data-testid-title="diary-delete-modal-title"
        data-testid-description="diary-delete-modal-description"
        data-testid-primary-button="diary-delete-modal-delete-button"
        data-testid-secondary-button="diary-delete-modal-cancel-button"
      />,
      { preventBackdropClose: true }
    );
  };

  // 회고 수정 시작
  const handleRetrospectEditStart = (
    retrospectId: number,
    currentContent: string
  ) => {
    setEditingRetrospectId(retrospectId);
    setEditingRetrospectContent(currentContent);
  };

  // 회고 수정 취소
  const handleRetrospectEditCancel = () => {
    setEditingRetrospectId(null);
    setEditingRetrospectContent("");
  };

  // 회고 수정 완료
  const handleRetrospectEditSubmit = async (retrospectId: number) => {
    if (!editingRetrospectContent.trim()) {
      alert("회고 내용을 입력해주세요.");
      return;
    }

    if (!diary?.id) {
      console.error("일기 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      await updateRetrospect.mutateAsync({
        id: retrospectId,
        content: editingRetrospectContent.trim(),
        diaryId: diary.id,
      });

      setEditingRetrospectId(null);
      setEditingRetrospectContent("");
    } catch (error) {
      console.error("회고 수정 중 오류 발생:", error);
      alert("회고 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 회고 삭제
  const handleRetrospectDelete = (retrospectId: number) => {
    if (!diary?.id) {
      console.error("일기 ID를 찾을 수 없습니다.");
      return;
    }

    const modalId = openModal(
      <Modal
        variant="danger"
        actions="dual"
        theme="light"
        title="회고 삭제"
        description="회고를 삭제 하시겠어요?"
        primaryButtonText="삭제"
        secondaryButtonText="취소"
        onPrimaryClick={async () => {
          try {
            await deleteRetrospect.mutateAsync({
              id: retrospectId,
              diaryId: diary.id,
            });

            closeModal(modalId);
          } catch (error) {
            console.error("회고 삭제 중 오류 발생:", error);
            alert("회고 삭제에 실패했습니다. 다시 시도해주세요.");
            closeModal(modalId);
          }
        }}
        onSecondaryClick={() => {
          closeModal(modalId);
        }}
        data-testid="retrospect-delete-modal"
        data-testid-title="retrospect-delete-modal-title"
        data-testid-description="retrospect-delete-modal-description"
        data-testid-primary-button="retrospect-delete-modal-delete-button"
        data-testid-secondary-button="retrospect-delete-modal-cancel-button"
      />,
      { preventBackdropClose: true }
    );
  };

  return (
    <div className={styles.container} data-testid="diaries-detail-container">
      <div className={styles.gap64}></div>

      {/* back button */}
      <div className={styles.backButtonSection}>
        <button
          className={styles.backButton}
          onClick={handleBackToDiaries}
          data-testid="back-to-diaries-button"
        >
          <Image
            src="/icons/back_outline_light_m.svg"
            alt="뒤로가기"
            width={24}
            height={24}
            className={styles.backIcon}
          />
          <span className={styles.backText}>다이어리로 돌아가기</span>
        </button>
      </div>

      <div className={styles.gap24}></div>

      {!isEditMode ? (
        <>
          {/* detail-title */}
          <div className={styles.detailTitle}>
            <div className={styles.titleSection}>
              <h1 className={styles.title} data-testid="diary-title">
                {diary.title}
              </h1>
            </div>
            <div className={styles.emotionDateSection}>
              <div className={styles.emotionWrapper}>
                <Image
                  src={`/images/${emotionData.images.small}`}
                  alt={emotionData.label}
                  width={32}
                  height={32}
                  className={styles.emotionIcon}
                  data-testid="diary-emotion-icon"
                />
                <span
                  className={styles.emotionText}
                  style={{ color: emotionData.color }}
                  data-testid="diary-emotion-text"
                >
                  {emotionData.label}
                </span>
              </div>
              <div className={styles.dateWrapper}>
                <span className={styles.dateText} data-testid="diary-date">
                  {formattedDate}
                </span>
                <span className={styles.dateText}>작성</span>
                {displayName && (
                  <span
                    className={styles.authorText}
                    data-testid="diary-author"
                  >
                    {displayName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.gap24}></div>

          {/* detail-content */}
          <div className={styles.detailContent}>
            <div className={styles.contentSection}>
              <h2 className={styles.contentLabel}>내용</h2>
              <p className={styles.contentText} data-testid="diary-content">
                {diary.content}
              </p>
            </div>
          </div>

          <div className={styles.copySection}>
            <button className={styles.copyButton} onClick={handleCopyContent}>
              <Image
                src="/icons/copy_outline_light_m.svg"
                alt="복사"
                width={24}
                height={24}
              />
              <span className={styles.copyText}>내용 복사</span>
            </button>
          </div>

          <div className={styles.gap24}></div>

          {/* detail-footer */}
          {isOwner && (
            <div className={styles.detailFooter}>
              <Button
                variant="secondary"
                theme="light"
                size="medium"
                onClick={handleEdit}
                className={styles.footerButton}
              >
                수정
              </Button>
              <Button
                variant="secondary"
                theme="light"
                size="medium"
                onClick={handleDeleteClick}
                className={styles.footerButton}
              >
                삭제
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* update-form */}
          <form onSubmit={handleUpdateSubmit}>
            {/* emotion-section */}
            <div
              className={styles.updateEmotionSection}
              data-testid="diary-update-emotion-section"
            >
              <p className={styles.updateEmotionQuestion}>
                오늘 기분은 어땟나요?
              </p>
              <div className={styles.updateEmotionRadioGroup}>
                {emotionList.map((emotion) => (
                  <Controller
                    key={emotion.type}
                    name="emotion"
                    control={updateControl}
                    render={({ field }) => (
                      <label className={styles.updateRadioLabel}>
                        <input
                          type="radio"
                          value={emotion.type}
                          checked={field.value === emotion.type}
                          onChange={(e) =>
                            field.onChange(e.target.value as EmotionType)
                          }
                          className={styles.updateRadioInput}
                          data-testid={`diary-update-emotion-radio-${emotion.type}`}
                        />
                        <span className={styles.updateRadioText}>
                          {emotion.label}
                        </span>
                      </label>
                    )}
                  />
                ))}
              </div>
              {updateErrors.emotion && (
                <p className={styles.errorText}>
                  {updateErrors.emotion.message}
                </p>
              )}
            </div>

            {/* title-section */}
            <div className={styles.updateTitleSection}>
              <label className={styles.updateLabel}>제목</label>
              <Controller
                name="title"
                control={updateControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="primary"
                    theme="light"
                    size="medium"
                    className={styles.updateTitleInput}
                    data-testid="diary-update-title-input"
                  />
                )}
              />
              {updateErrors.title && (
                <p className={styles.errorText}>{updateErrors.title.message}</p>
              )}
            </div>

            {/* content-section */}
            <div className={styles.updateContentSection}>
              <label className={styles.updateLabel}>내용</label>
              <Controller
                name="content"
                control={updateControl}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={styles.updateContentTextarea}
                    data-testid="diary-update-content-textarea"
                  />
                )}
              />
              {updateErrors.content && (
                <p className={styles.errorText}>
                  {updateErrors.content.message}
                </p>
              )}
            </div>

            {/* button-section */}
            <div className={styles.updateButtonSection}>
              <Button
                type="button"
                variant="secondary"
                theme="light"
                size="large"
                onClick={handleCancel}
                className={styles.updateCancelButton}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                theme="light"
                size="large"
                disabled={isUpdateSubmitDisabled}
                className={styles.updateSubmitButton}
              >
                수정 하기
              </Button>
            </div>
          </form>
        </>
      )}

      <div className={styles.gap24}></div>

      {/* retrospect-input */}
      <div className={styles.retrospectInput}>
        <h2 className={styles.retrospectLabel}>회고</h2>
        <form onSubmit={handleSubmit} className={styles.retrospectInputWrapper}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                variant="primary"
                theme="light"
                size="medium"
                placeholder={
                  isEditMode
                    ? "수정중일땐 회고를 작성할 수 없어요."
                    : "회고를 남겨보세요."
                }
                className={styles.retrospectInputField}
                data-testid="retrospect-input"
                disabled={isEditMode}
              />
            )}
          />
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="large"
            disabled={isSubmitDisabled || isEditMode}
            className={styles.retrospectButton}
            data-testid="retrospect-submit-button"
          >
            입력
          </Button>
        </form>
      </div>

      <div className={styles.gap16}></div>

      {/* retrospect-list */}
      <div className={styles.retrospectList} data-testid="retrospect-list">
        {retrospects.length === 0 ? (
          <div className={styles.retrospectEmpty}>등록된 회고가 없습니다.</div>
        ) : (
          retrospects.map((retrospect, index) => (
            <div key={retrospect.id}>
              {index > 0 && <div className={styles.retrospectDivider}></div>}
              {editingRetrospectId === retrospect.id ? (
                <div className={styles.retrospectEditItem}>
                  <Input
                    value={editingRetrospectContent}
                    onChange={(e) =>
                      setEditingRetrospectContent(e.target.value)
                    }
                    variant="primary"
                    theme="light"
                    size="medium"
                    className={styles.retrospectEditInput}
                    data-testid={`retrospect-edit-input-${retrospect.id}`}
                  />
                  <div className={styles.retrospectEditActions}>
                    <Button
                      variant="secondary"
                      theme="light"
                      size="medium"
                      onClick={handleRetrospectEditCancel}
                      className={styles.retrospectEditCancelButton}
                      data-testid={`retrospect-edit-cancel-${retrospect.id}`}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      theme="light"
                      size="medium"
                      onClick={() => handleRetrospectEditSubmit(retrospect.id)}
                      disabled={!editingRetrospectContent.trim()}
                      className={styles.retrospectEditSubmitButton}
                      data-testid={`retrospect-edit-submit-${retrospect.id}`}
                    >
                      수정
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={styles.retrospectItem}
                  data-testid={`retrospect-item-${retrospect.id}`}
                >
                  <span className={styles.retrospectText}>
                    {retrospect.text}
                  </span>
                  <div className={styles.retrospectMeta}>
                    <span className={styles.retrospectDate}>
                      [{retrospect.date}]
                    </span>
                    {retrospect.userName && (
                      <span
                        className={styles.retrospectAuthor}
                        data-testid={`retrospect-author-${retrospect.id}`}
                      >
                        {retrospect.userName}
                      </span>
                    )}
                    {/* 본인이 작성한 회고만 수정/삭제 버튼 표시 */}
                    {currentUser && retrospect.userId === currentUser._id && (
                      <div className={styles.retrospectActions}>
                        <button
                          className={styles.retrospectActionButton}
                          onClick={() =>
                            handleRetrospectEditStart(
                              retrospect.id,
                              retrospect.text
                            )
                          }
                          data-testid={`retrospect-edit-button-${retrospect.id}`}
                          disabled={isEditMode}
                        >
                          수정
                        </button>
                        <button
                          className={styles.retrospectActionButton}
                          onClick={() => handleRetrospectDelete(retrospect.id)}
                          data-testid={`retrospect-delete-button-${retrospect.id}`}
                          disabled={isEditMode}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.gap40}></div>
    </div>
  );
}
