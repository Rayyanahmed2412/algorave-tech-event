document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    let allTalks = [];

    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            allTalks = data;
            renderSchedule(allTalks);
        });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = allTalks.filter(talk => 
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talks) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date('2025-10-27T10:00:00');

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        talks.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');

            scheduleItem.innerHTML = `
                <div class="schedule-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                <div class="talk-title">${talk.title}</div>
                <div class="talk-speakers"><strong>Speakers:</strong> ${talk.speakers.join(', ')}</div>
                <div class="talk-categories">${talk.categories.map(c => `<span>${c}</span>`).join(' ')}</div>
                <div class="talk-description">${talk.description}</div>
            `;
            scheduleContainer.appendChild(scheduleItem);

            currentTime = new Date(endTime.getTime());

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                const breakItem = document.createElement('div');
                breakItem.classList.add('schedule-item', 'break');
                breakItem.innerHTML = `<div class="schedule-time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div><div>Lunch Break</div>`;
                scheduleContainer.appendChild(breakItem);
                currentTime = lunchEndTime;
            }

            if (index < talks.length - 1 && index !== 2) {
                const breakStartTime = new Date(currentTime);
                const breakEndTime = new Date(breakStartTime.getTime() + 10 * 60000);
                const breakItem = document.createElement('div');
                breakItem.classList.add('schedule-item', 'break');
                breakItem.innerHTML = `<div class="schedule-time">${formatTime(breakStartTime)} - ${formatTime(breakEndTime)}</div><div>Transition</div>`;
                scheduleContainer.appendChild(breakItem);
                currentTime = breakEndTime;
            }
        });
    }
});
