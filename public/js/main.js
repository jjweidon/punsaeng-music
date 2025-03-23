// DOM 요소
const requestForm = document.getElementById('requestForm');
const requestList = document.getElementById('requestList');

// 폼 제출 이벤트 처리
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        artist: document.getElementById('artist').value,
        reason: document.getElementById('reason').value
    };

    try {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('신청에 실패했습니다.');
        }

        // 폼 초기화
        requestForm.reset();
        
        // 목록 새로고침
        loadRequests();
        
        alert('노래가 성공적으로 신청되었습니다!');
    } catch (error) {
        alert('오류가 발생했습니다: ' + error.message);
    }
});

// 신청 목록 로드
async function loadRequests() {
    try {
        const response = await fetch('/api/requests');
        const requests = await response.json();
        
        requestList.innerHTML = requests.map(request => `
            <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="font-bold text-lg">${request.title}</h3>
                <p class="text-gray-600">${request.artist}</p>
                <p class="mt-2">${request.reason}</p>
                <p class="text-sm text-gray-500 mt-2">
                    ${new Date(request.createdAt).toLocaleString()}
                </p>
            </div>
        `).join('');
    } catch (error) {
        console.error('목록을 불러오는데 실패했습니다:', error);
        requestList.innerHTML = '<p class="text-red-500">목록을 불러오는데 실패했습니다.</p>';
    }
}

// 페이지 로드시 목록 불러오기
document.addEventListener('DOMContentLoaded', loadRequests); 