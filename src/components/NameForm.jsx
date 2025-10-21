import React, { useState, useEffect } from 'react';

const NameForm = ({ rowcol, onChangeRowCol, list, onChangeList, onClose }) => {
    const [names, setNames] = useState(list.join(', '));
    const [row, setRow] = useState(rowcol?.[0] || 0);
    const [col, setCol] = useState(rowcol?.[1] || 0);
    const [message, setMessage] = useState({status: '', text: ''});

    const showError = (text) => { setMessage({status: 'error', text})};
    const showInfo = (text) => { setMessage({status: 'info', text})};

    // 모달이 열릴 때 초기화
    useEffect(() => {
        setNames(list.join(', '));
        setRow(rowcol?.[0] || 0);
        setCol(rowcol?.[1] || 0);
        showInfo("빈 자리는 공백으로 채워집니다.");
    }, [list, rowcol]);
    

    const handleSubmit = () => {
        // 검증
        if (row <= 0 || col <= 0 ) {
            showError('좌석 정보를 입력해주세요');
            return;
        }

        const nameList = names
            .split(',')
            .map((name) => name.trim())
            .filter((name) => name.length);

        if(nameList.length === 0){
            showError('이름을 입력해주세요');
            return;
        }
        else if(nameList.length > row * col){ // 작성한 이름 개수가 행열의 개수보다 클때
            showError('선택한 행, 열의 개수보다 이름의 개수가 더 많습니다.')
            return;
        }

        if (!isNaN(row) && !isNaN(col)) {
            onChangeRowCol([row, col]);
        }


        if (nameList.length > 0) {
            onChangeList(nameList);
            onClose(false); // 모달 닫기
        }
    };

    return (
        <>
            <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                background: '#cbd5e1',
                marginBottom: '2rem',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                좌석 정보 설정
            </h3>

            {/* 에러 메시지 */}
            {message.text&& (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor:
                    message.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9',
                    border:
                    message.status === 'error'
                    ? '2px solid #ef4444'
                    : '2px solid #1e293b',
                    color:
                    message.status === 'error'
                    ? '#fca5a5'
                    : '#1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                   <span style={{ fontSize: '1.25rem' }}>
                    {message.status === 'error' ? '⚠️' : '💡'}
                    </span>
                    {message.text}
                    </div>
            )}

            <form style={{ margin: '0.5rem 0' }} onSubmit={(e) => e.preventDefault()}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* 행 입력 */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#cbd5e1',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            행 (Row)
                        </label>
                        <input
                            type="number"
                            value={row}
                            min={0}
                            onChange={(e) => setRow(Math.max(0, Number(e.target.value)))}
                            style={{
                                width: '100%',
                                height: '2.5rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#1e293b',
                                border: '2px solid #475569',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                color: '#f1f5f9',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#47689e';
                                showInfo("빈 자리는 공백으로 채워집니다.");
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#475569';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* 열 입력 */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#cbd5e1',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            열 (Column)
                        </label>
                        <input
                            type="number"
                            value={col}
                            min={0}
                            onChange={(e) => setCol(Math.max(0, Number(e.target.value)))}
                            style={{
                                width: '100%',
                                height: '2.5rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#1e293b',
                                border: '2px solid #475569',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                color: '#f1f5f9',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#47689e';
                                showInfo("빈 자리는 공백으로 채워집니다.");
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#475569';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* 이름 목록 */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="names" style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        이름 목록 (쉼표로 구분)
                    </label>
                    <textarea
                        id="names"
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        rows={6}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#1e293b',
                            border: '2px solid #475569',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            color: '#cbd5e1',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '150px'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#47689e';
                            showInfo("빈 자리는 공백으로 채워집니다.");
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#475569';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={() => onClose(false)}
                        type="button"
                        style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            padding: '0.75rem 1.5rem',
                            color: '#cbd5e1',
                            backgroundColor: 'transparent',
                            border: '2px solid #475569',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#64748b';
                            e.target.style.color = '#f1f5f9';
                            e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#475569';
                            e.target.style.color = '#cbd5e1';
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            padding: '0.75rem 1.5rem',
                            color: '#ffffff',
                            background: '#47689e',
                            border: 'none',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        설정
                    </button>
                </div>
            </form>
        </>
    );
};

export default NameForm;