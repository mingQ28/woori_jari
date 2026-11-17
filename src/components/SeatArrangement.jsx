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
  // ✅ 상태 관리 — seats: { id, name }[] (빈자리는 name === "")
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
  //    부족한 좌석은 빈자리(name: "")로 채우고, 좌석마다 고유 id를 부여
  useEffect(() => {
    const total = rows * cols;
    const names = (data || []).slice(0, total);
    const initialSeats = Array.from({ length: total }, (_, i) => ({
      id: `seat-${i}`,
      name: names[i] ?? "",
    }));
    setLocked(Array(total).fill(false));
    setSeats(initialSeats); // ← 셔플 X, 순서 그대로 표시
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
          setSeats((items) => {
            const oldIndex = items.findIndex((seat) => seat.id === active.id);
            const newIndex = items.findIndex((seat) => seat.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return items;
            return arraySwap(items, oldIndex, newIndex);
          });
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
              items={seats.map((seat) => seat.id)}
              strategy={rectSwappingStrategy}
            >
              {seats.map((seat, index) => (
                <SortableSeatItem
                  key={seat.id}
                  id={seat.id}
                  name={seat.name}
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
