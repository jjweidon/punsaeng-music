document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('musicRequestForm');
    const requestList = document.getElementById('requestList');

    // 신청 목록 불러오기
    async function loadRequests() {
        try {
            const response = await fetch('/api/requests');
            const requests = await response.json();
            
            requestList.innerHTML = requests.map(request => `
                <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2">
                        <h3 class="font-semibold">${request.title}</h3>
                        <span class="text-sm text-gray-500">-</span>
                        <span class="text-sm text-gray-500">${request.artist}</span>
                    </div>
                    <p class="mt-2">${request.reason}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('신청 목록을 불러오는데 실패했습니다:', error);
        }
    }

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