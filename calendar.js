// Calendar functionality for events page

document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    
    if (!calendar || !currentMonthElement || !prevMonthButton || !nextMonthButton) {
        console.log('Calendar elements not found');
        return;
    }

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Sample events data
    const events = {
        '2025-02-15': { title: 'Afterworks', type: 'conference-1' },
        '2025-04-12': { title: 'Conférence Des Pères', type: 'conference-2' },
        '2025-08-06': { title: 'WE ARE ONE', type: 'conference-3' },
        '2025-11-29': { title: 'Conférence des familles', type: 'conference-4' },
        '2025-09-21': { title: 'Brunch', type: 'meeting-1' },
        '2025-05-10': { title: 'Boy-s Camp', type: 'meeting-2' },
        '2025-04-18': { title: 'Conférence Santé', type: 'conference' }
    };

    function generateCalendar(month, year) {
        calendar.innerHTML = '';
        
        // Add day headers
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const prevMonthDay = new Date(year, month, -(startingDay - i - 1));
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = prevMonthDay.getDate();
            calendar.appendChild(dayElement);
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Check if this is today
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check if there's an event on this day
            if (events[dateString]) {
                dayElement.classList.add('has-event');
                dayElement.title = events[dateString].title;
                
                // Add click handler to show event details
                dayElement.addEventListener('click', function() {
                    showEventDetails(dateString, events[dateString]);
                });
            }

            calendar.appendChild(dayElement);
        }

        // Fill remaining cells
        const totalCells = calendar.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 total cells
        
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDay = document.createElement('div');
            nextMonthDay.className = 'calendar-day other-month';
            nextMonthDay.textContent = i;
            calendar.appendChild(nextMonthDay);
        }

        // Update month/year display
        currentMonthElement.textContent = `${months[month]} ${year}`;
    }

    function showEventDetails(dateString, event) {
        const modal = document.getElementById('eventModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) return;

        const eventDate = new Date(dateString);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        modalBody.innerHTML = `
            <div class="event-modal-content">
                <h2>${event.title}</h2>
                <p class="event-modal-date">
                    <i class="fas fa-calendar"></i>
                    ${formattedDate}
                </p>
                <div class="event-modal-description">
                    ${getEventDescription(event.type)}
                </div>
                <div class="event-modal-actions">
                    <button class="btn btn-primary" onclick="registerForEvent('${event.type}')">
                        S'inscrire
                    </button>
                    <button class="btn btn-secondary" onclick="shareEvent('${event.title}', '${dateString}')">
                        Partager
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    function getEventDescription(type) {
        const descriptions = {
            'conference-1': `
                <p>Afterwork for Christ est une soirée bimensuelle qui a pour but de se
                rassembler afin d’adorer le Seigneur et également présenter les problèmes
                sociaux afin que les membres du corps du Christ puissent discuter ensemble
                et trouver des solutions efficaces et durables selon la Parole de Dieu.
                Ces solutions ainsi seront actionnées par la mise en place de projets.</p>
                <ul>
                    <li>Intervenants experts</li>
                    <li>Session questions-réponses</li>
                    <li>Networking et échanges</li>
                </ul>
            `,
            
            'conference-2': `
                <p>La conférence des Pères est un grand rassemblement des jeunes hommes et des pères.</p>

                <p>En effet, Le Seigneur a établi les hommes comme autorité des familles,
                et c’est l’ensemble des familles qui constituent la société. Lorsque
                l’autorité familiale est soumis à l’autorité suprême qu’est CHRIST, la
                cellule familiale est épanouie et équilibrée. La conséquence de cet état
                est l’équilibre et le bien-être de toute la Société.</p>

                <p>Un Homme est une autorité pour son épouse et pour ses enfants. Il est en réalité le fondement et le garant de la société.</p>

                <p>À travers cette conférence, nous voulons rappeler à la lumière de la Parole du Seigneur le rôle que Jésus a confié aux jeunes hommes, aux époux, aux pères.</p>

                <p>Cette conférence est un véritable moment d’enseignement, de prière, de délivrance et de restauration. Elle est exclusivement dédiée aux hommes.
                Cette conférence a lieu une fois chaque année.</p>

                <p>Nous aborderons des thèmes tels que :</p>
                <ul>
                    <li>Enseignements</li>
                    <li>Partage d'expérience personnelle</li>
                    <li>Team bounding</li>
                    <li>Prière de restauration</li>
                    <li>Repas</li>
                </ul>
            `,

            'conference-3': `
                <p>WE ARE ONE est un grand rassemblement de l’ensemble du corps du CHRIST
                afin d’intercéder d’une même voix et d’un même esprit pour la Côte d’Ivoire.
                C’est le plus grand rassemblement du corps du Christ qui soit dans une
                Nation.</p>

                <p>Elle regroupe tous les chrétiens afin de faire des déclarations sur la Côte
                d’Ivoire tous ensemble et d’adorer JESUS ensemble.
                Elle aura un grand impact sur la Nation Ivoirienne dans toutes les sphères.</p>

                <ul>
                    <li>Choeur massif par zone</li>
                    <li>Différents intervenants</li>
                    <li>Prédications</li>
                    <li>Prière de proclammation</li>
                    <li>Sainte cène</li>
                    <li>Prestation de chantres</li>
                    <li>Offrandes</li>

                </ul>
            `,

            'conference-4': `
                <p>La cellule familiale est le socle de la société.</p>
                <p>La société est l’ensemble des familles.</p>

                <p>En effet, par cette conférence, nous souhaitons rappeler l’importance pour une société que ces familles prônent les valeurs de Jésus.</p>
                <p>C’est un moment d’enseignement, de délivrance ; de restauration pour la cellule familiale.</p>

                <ul>
                    <li>Enseignements</li>
                    <li>Team bounding</li>
                    <li>Compétition entre familles</li>
                    <li>Partage de repas</li>
                    <li>Louange / adoration</li>
                    <li>Partage d'expériences</li>
                    <li>Dress code par famille</li>
                    <li>Zone photo</li>
                </ul>
            `,

            'meeting-1': `
                <p>Discussion autour de plusieurs thèmes d'actualité</p>

                <p>Elle regroupe tous les chrétiens de toutes dénominations, afin de passer du temps en harmonie.
                Elle aura un grand impact sur la Nation Ivoirienne dans toutes les sphères.</p>

                <ul>
                    <li>Discussion autour de plusieurs thèmes</li>
                    <li>Team bounding</li>
                    <li>Témoignages</li>
                    <li>Dress code</li>
                    <li>Louange</li>
                    <li>Partage de repas</li>
                    <li>Réseautage</li>
                    <li>Prière</li>
                    
                </ul>
            `,

            'meeting-2': `
                <p>Boy's Camp est un rassemblement de plusieurs enfants de 12 à 18 ans</p>

                <p>Elle regroupe tous les enfants chrétiens de toutes dénominations, afin de passer du temps en harmonie.
                Elle aura un grand impact sur la Nation Ivoirienne dans toutes les sphères.</p>

                <ul>
                    <li>Tes intervenants expérimentés</li>
                    <li>Prière</li>
                    <li>Délivrances</li>
                    <li>Psychologie</li>
                    <li>Jeux</li>
                    <li>Team Bounding</li>
                    <li>Partage de repas</li>
                </ul>
            `,
        };
        
        return descriptions[type] || '<p>Plus d\'informations bientôt disponibles.</p>';
    }

    // Navigation event listeners
    prevMonthButton.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Modal close functionality
    const modal = document.getElementById('eventModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Global functions for modal actions
    window.registerForEvent = function(eventType) {
        alert('Fonctionnalité d\'inscription en cours de développement. Contactez-nous directement pour vous inscrire !');
        modal.style.display = 'none';
    };

    window.shareEvent = function(title, date) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Rejoignez-nous pour : ${title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const text = `${title} - ${new Date(date).toLocaleDateString('fr-FR')} - ${window.location.href}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Lien copié dans le presse-papier !');
            });
        }
        modal.style.display = 'none';
    };

    // Event details buttons functionality
    const eventDetailsButtons = document.querySelectorAll('.event-details-btn');
    eventDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventType = this.getAttribute('data-event');
            const eventDate = this.closest('.event-item').getAttribute('data-date');
            
            if (eventDate && events[eventDate]) {
                showEventDetails(eventDate, events[eventDate]);
            }
        });
    });

    // Keyboard navigation for calendar
    calendar.addEventListener('keydown', function(e) {
        const focusedDay = document.activeElement;
        if (!focusedDay.classList.contains('calendar-day')) return;

        let newFocus = null;
        
        switch(e.key) {
            case 'ArrowLeft':
                newFocus = focusedDay.previousElementSibling;
                break;
            case 'ArrowRight':
                newFocus = focusedDay.nextElementSibling;
                break;
            case 'ArrowUp':
                const currentIndex = Array.from(calendar.children).indexOf(focusedDay);
                newFocus = calendar.children[currentIndex - 7];
                break;
            case 'ArrowDown':
                const currentIndexDown = Array.from(calendar.children).indexOf(focusedDay);
                newFocus = calendar.children[currentIndexDown + 7];
                break;
            case 'Enter':
            case ' ':
                if (focusedDay.classList.contains('has-event')) {
                    focusedDay.click();
                }
                e.preventDefault();
                break;
        }

        if (newFocus && newFocus.classList.contains('calendar-day')) {
            newFocus.focus();
            e.preventDefault();
        }
    });

    // Make calendar days focusable
    function updateCalendarAccessibility() {
        const calendarDays = calendar.querySelectorAll('.calendar-day:not(.header)');
        calendarDays.forEach(day => {
            day.setAttribute('tabindex', '0');
            if (day.classList.contains('has-event')) {
                day.setAttribute('aria-label', `${day.textContent}, ${day.title}`);
            } else {
                day.setAttribute('aria-label', day.textContent);
            }
        });
    }

    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    updateCalendarAccessibility();

    // Update accessibility after each calendar generation
    const originalGenerateCalendar = generateCalendar;
    generateCalendar = function(month, year) {
        originalGenerateCalendar(month, year);
        updateCalendarAccessibility();
    };

    console.log('Calendar functionality loaded');
});