import React, { useEffect } from 'react';
import style from '../css/PaymentModal.module.css';
import { url } from '../store/ref';

const PaymentModal = ({ onClose, onSuccess, author, matchedUser, item }) => {
  const writerID = author.email;

  const companyAccount = {
    bank: '카카오뱅크',
    account: '3333069088392',
    name: 'Guru'
  };

  useEffect(() => {
    onClickPayment();
  }, []); // 컴포넌트가 마운트될 때 onClickPayment 호출

  const onClickPayment = () => {
    if (!window.IMP) return;
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init('imp21617344'); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kicc.T5102001', // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
      pay_method: 'card', // 결제수단 (기본 결제 수단을 카드로 설정)
      amount: item.pay, // 결제금액
      name: `${item.title} 결제`, // 주문명
      buyer_name: author.userName, // 구매자 이름
      buyer_tel: author.phone, // 구매자 전화번호
      buyer_email: writerID, // 구매자 이메일      
    };

    /* 3. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  /* 4. 콜백 함수 정의하기 */
  function callback(response) {
    const { success, error_msg, imp_uid, merchant_uid } = response;

    if (success) {
      alert('결제 성공');
      // 결제 성공 후 정산 API 호출
      requestPayout(imp_uid, merchant_uid);
    } else {
      alert(`결제 실패: ${error_msg}`);
      onClose(); // 결제가 실패하면 PaymentModal을 닫습니다.
    }
  }

  // 정산 API 호출 함수
  const requestPayout = async (imp_uid, merchant_uid) => {
    try {
      const response = await fetch(`${url}/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imp_uid,
          merchant_uid,
          companyAccount,
          matchedUserAccount: matchedUser.account,
          totalAmount: item.pay,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess(); // 정산 성공 시 평가 모달 표시
      } else {
        alert(`정산 실패: ${result.message}`);
        onClose();
      }
    } catch (error) {
      console.error('정산 오류:', error);
      alert('정산 중 오류가 발생했습니다.');
      onClose();
    }
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default PaymentModal;
