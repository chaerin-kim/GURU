import { useEffect, useState } from 'react';
import { url } from '../store/ref';

// 신뢰도 계산 함수
const calculateTrustScore = (data) => {
  if (data.length === 0) return 0; // 데이터가 없을 경우 0 반환
  const totalStarRating = data.reduce((sum, item) => sum + item.starRating, 0); // 총 별점 합산
  const trustScore = totalStarRating / data.length; // 별점의 평균 계산
  return trustScore;
};

const ProgressBar = ({ user }) => {
  const [trustScore, setTrustScore] = useState(0); // 신뢰도 상태 추가

  // 만족도 조사 데이터 불러오고 할당
  useEffect(() => {
    const fetchSatisfactionID = async () => {
      if (user?.emailID) {
        try {
          const response = await fetch(`${url}/satisfied/${user.emailID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const trustScore = calculateTrustScore(data); // 신뢰도 계산
            setTrustScore(trustScore); // 신뢰도 상태 설정
          } else {
            console.error(
              'Failed to fetch satisfaction data:',
              response.status
            );
          }
        } catch (error) {
          console.error('Error fetching satisfaction data:', error);
        }
      }
    };

    fetchSatisfactionID();
  }, [user]);

   // NaN인지 확인하고, NaN일 경우 0으로 설정
   const progressValue = isNaN(trustScore) ? 0 : trustScore;

  return (
    <>
      <progress id="trust" max="6" value={trustScore}></progress>
    </>
  );
};

export default ProgressBar;
