import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../assets/AuthContext";
import { useForm } from "react-hook-form";
import { url } from "../store/ref";
import Modal from "./Modal";
import ModalAlert from "./ModalAlert";
import style from "../css/Comment.module.css";

const CommentForm = ({ btnWrapStatus, id }) => {
  const { isAuthenticated, isLogout } = useAuth();
  const user = useSelector((state) => state.user.user);
  const [modalAlert, setModalAlert] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({});

  const showAlert = (content) => {
    setModalAlert(content);
  };
  const closeAlert = () => {
    setModalAlert(null);
  };

  const fetchComment = async () => {
    try {
      const res = await fetch(`${url}/comment/${id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setCommentList(data);
      } else {
        showAlert("failed");
        console.error("Failed to submit profile:", res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [id]);

  const onSubmit = async (val) => {
    const token = localStorage.getItem("token");
    const { content } = val;
    try {
      const res = await fetch(`${url}/commentWrit/${id}`, {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        showAlert("isOk");
        setValue("content", "");
        fetchComment();
      } else {
        showAlert("failed");
        console.error("Failed to submit profile:", res.statusText);
      }
    } catch (error) {
      showAlert("failed");
      console.error("Error:", error);
    }
  };
  const commentDel = useCallback(
    async (commentId) => {
      try {
        const response = await fetch(`${url}/commentDel/${commentId}`, {
          method: "DELETE",
        });
        const res = await response.json();
        if (res.message === "ok") {
          showAlert("deleteOk");
          setCommentList((prev) => prev.filter((comment) => comment._id !== commentId));
        } else {
          console.error("Failed to delete comment:", res);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [showAlert]
  );

  const commentEdit = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/commentEdit/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ content: editContent }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.message === "ok") {
        showAlert("editOk");
        setEditMode(null);
        fetchComment();
      } else {
        showAlert("editFailed");
        console.error("Failed to edit comment:", res);
      }
    } catch (error) {
      showAlert("editFailed");
      console.error("Error:", error);
    }
  };

  return (
    <div className={style.commentWrap}>
      <h2>댓글</h2>
      {commentList.map((comment) => (
        <div key={comment._id} className={style.commentCon}>
          <div className={style.thumb}>
            {!comment.authorImg ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt="이미지 없음" /> : <img src={`${url}/${comment.authorImg}`} alt="프로필 이미지" />}
          </div>
          <div className={`${style.commentInfo}`}>
            <strong className={`${user?.emailID === comment.authorID ? style.autor : ""}`}>{comment.authorNickName}</strong>
            {editMode === comment._id ? <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} /> : <pre>{comment.content}</pre>}
            {user?.emailID === comment.authorID && (
              <div className={style.btnWrap}>
                {editMode === comment._id ? (
                  <>
                    <button onClick={() => setEditMode(null)}>취소</button>
                    <button onClick={() => commentEdit(comment._id)}>저장</button>
                  </>
                ) : (
                  <>
                    <button
                      className={style.btnDel}
                      onClick={() => {
                        showAlert({ type: "deleteComment", commentId: comment._id });
                      }}>
                      삭제
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(comment._id);
                        setEditContent(comment.content);
                      }}>
                      수정
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            id="content"
            {...register("content", {
              required: "댓글을 작성하시려면 내용을 작성해주세요..",
            })}
            placeholder="댓글 내용을 작성해주세요."
          />
          {errors.content && <p className={style["error-message"]}>{errors.content.message}</p>}
          <button type="submit">등록</button>
        </form>
      )}
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert.type === "deleteComment" && <ModalAlert close={closeAlert} desc={"정말 삭제하시겠습니까?"} error={true} confirm={true} throwFn={() => commentDel(modalAlert.commentId)} />}
          {modalAlert === "isOk" && <ModalAlert close={closeAlert} desc={`댓글이 정상적으로 등록 되었습니다.`} error={false} confirm={false} />}
          {modalAlert === "failed" && <ModalAlert close={closeAlert} desc={`댓글 등록 중 오류가 생겼습니다.`} error={true} confirm={false} />}
          {modalAlert === "deleteOk" && <ModalAlert close={closeAlert} desc={"댓글이 삭제되었습니다."} error={true} confirm={false} />}
          {modalAlert === "editOk" && <ModalAlert close={closeAlert} desc={`댓글이 수정되었습니다.`} error={false} confirm={false} />}
          {modalAlert.type === "editFailed" && <ModalAlert close={closeAlert} desc={"댓글 수정 중 오류가 발생했습니다."} error={true} confirm={false} />}
        </Modal>
      )}
    </div>
  );
};

export default CommentForm;
