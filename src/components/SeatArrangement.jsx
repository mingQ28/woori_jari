import { useEffect, useState } from "react";
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  rectSwappingStrategy,
  arraySwap
} from "@dnd-kit/sortable";
import Droppable from './Droppable';
import SortableSeatItem from "./Sortable";

const SeatArrangement = ({ rows, cols, data }) => {
  const totalSeats = rows * cols;

  // ✅ 부족한 좌석은 공백으로 자동 채우기
  const padSeats = (arr) => {
    const filled = [...arr];
    while (filled.length < totalSeats) filled.push(" "); // 공백 자리 채우기
    return filled.slice(0, totalSeats);
  };

  // ✅ 상태 관리
  const [locked, setLocked] = useState([]);
  const [seats, setSeats] = useState([]);

  // ✅ 셔플 함수 (잠금 제외)
  const shuffle = (arr, lockedArr) => {
    const unlocked = arr.filter((_, i) => !lockedArr[i]);
    const shuffled = [...unlocked];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const result = [];
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
      result.push(lockedArr[i] ? arr[i] : shuffled[idx++]);
    }
    return result;
  };

  // ✅ 처음 렌더링 시 — 셔플 없이 순서대로 출력
  useEffect(() => {
    const padded = padSeats(data || []);
    const initialLocked = Array(totalSeats).fill(false);
    setLocked(initialLocked);
    setSeats(padded); // ← 셔플 X, 순서 그대로 표시
  }, [data, rows, cols]);

  // ✅ 버튼 클릭 시에만 셔플
  const shuffleSeats = () => setSeats((prev) => shuffle(prev, locked));

  // ✅ 개별 잠금 토글
  const toggleLock = (index) => {
    setLocked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div style={{ padding: 0, margin: 0, textAlign: "center" }}>
      <h2 style={{ margin: 0 }}>자리 배치도</h2>

      <button
        onClick={shuffleSeats}
        style={{
          margin: '2vh',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#6C63FF',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        🎲 셔플!
      </button>

      <DndContext
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          const oldIndex = seats.indexOf(active.id);
          const newIndex = seats.indexOf(over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            setSeats((items) => arraySwap(items, oldIndex, newIndex));
          }
        }}
      >
        <Droppable>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 80px)`,
              gridTemplateColumns: `repeat(${cols}, 80px)`,
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <SortableContext
              items={seats.map((item, index) => item || `empty-${index}`)}
              strategy={rectSwappingStrategy}
            >
              {Array.from({ length: totalSeats }).map((_, index) => (
                <SortableSeatItem
                  key={index}
                  id={seats[index] || `empty-${index}`}
                  data={seats[index] || ''}
                  locked={locked[index]}
                  onClick={() => toggleLock(index)}
                />
              ))}
            </SortableContext>
          </div>
        </Droppable>
      </DndContext>

      <div style={{ marginTop: "1rem", color: "#777" }}>
        좌석을 클릭하면 고정 좌석이 됩니다.<br/>
        박스 아래의 선을 통해 좌석을 직접 이동시킬 수 있습니다.
      </div>
    </div>
  );
};

export default SeatArrangement;
