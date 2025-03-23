document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('musicRequestForm');
    const requestList = document.getElementById('requestList');
    const sortToggle = document.getElementById('sortToggle');
    const sortIcon = document.getElementById('sortIcon');
    let isAscending = true; // 기본값은 오름차순

    // 날짜 포맷팅 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    // 정렬 아이콘 업데이트
    function updateSortIcon() {
        sortIcon.style.transform = isAscending ? 'rotate(0deg)' : 'rotate(180deg)';
        sortToggle.querySelector('span').textContent = isAscending ? '시간순 ↑' : '시간순 ↓';
    }

    // 신청 목록 불러오기
    async function loadRequests() {
        try {
            const response = await fetch('/api/requests');
            let requests = await response.json();
            
            // 정렬 적용
            requests.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            
            requestList.innerHTML = requests.map((request, index) => `
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-500">${isAscending ? index + 1 : requests.length - index}</span>
                            <h3 class="font-semibold">${request.title}</h3>
                            <span class="text-sm text-gray-500">-</span>
                            <span class="text-sm text-gray-500">${request.artist}</span>
                        </div>
                        <span class="text-xs text-gray-400">${formatDate(request.createdAt)}</span>
                    </div>
                    <p class="text-gray-600 text-sm">${request.reason}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('신청 목록을 불러오는데 실패했습니다:', error);
        }
    }

    // 정렬 토글 이벤트 처리
    sortToggle.addEventListener('click', () => {
        isAscending = !isAscending;
        updateSortIcon();
        loadRequests();
    });

    // 폼 제출 처리
    form.addEventListener('submit', async (e) => {
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

            if (response.ok) {
                form.reset();
                loadRequests();
            } else {
                throw new Error('신청에 실패했습니다.');
            }
        } catch (error) {
            console.error('신청 중 오류가 발생했습니다:', error);
            alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });

    // 초기 로드
    loadRequests();
}); 