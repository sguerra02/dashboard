// Dashboard Application
class DashboardApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize all components
        this.initTabSystem();
        this.initDateTime();
        this.initCalendar();
        this.initTodos();
        this.initGoals();
        this.initNotes();
        this.initTimeTracker();
        this.initPomodoro();
        this.initMoodLogger();
        this.initEditModal();
        
        // Load data from localStorage
        this.loadData();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    // Tab System
    initTabSystem() {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Date and Time
    initDateTime() {
        this.updateDateTime();
    }
    
    updateDateTime() {
        const now = new Date();
        
        // Format time
        const timeString = now.toLocaleTimeString('en-US', {hour12: false});
        
        // Format date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        
        // Update all time and date elements
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('current-date').textContent = dateString;
        document.getElementById('dashboard-time').textContent = timeString;
        document.getElementById('dashboard-date').textContent = dateString;
    }
    
    // Calendar
    initCalendar() {
        this.generateCalendar();
    }
    
    generateCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();
        
        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        // Days in the month
        const daysInMonth = lastDay.getDate();
        // First day of week (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDay.getDay();
        
        // Day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Clear calendar
        const calendarElement = document.getElementById('calendar');
        calendarElement.innerHTML = '';
        
        // Add day names
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.style.fontWeight = 'bold';
            dayElement.style.color = '#94a3b8';
            calendarElement.appendChild(dayElement);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarElement.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Highlight today
            if (day === today) {
                dayElement.classList.add('current');
            }
            
            calendarElement.appendChild(dayElement);
        }
    }
    
    // To-dos
    initTodos() {
        this.todos = JSON.parse(localStorage.getItem('dashboardTodos')) || [
            { id: 1, text: "Complete dashboard design", completed: true },
            { id: 2, text: "Review monthly budget", completed: false },
            { id: 3, text: "Prepare presentation for meeting", completed: false },
            { id: 4, text: "Buy groceries", completed: false },
            { id: 5, text: "Call mom", completed: false },
            { id: 6, text: "Finish reading book", completed: false }
        ];
        
        this.renderTodos();
        this.renderDashboardTodos();
        
        // Add todo event listeners
        document.getElementById('add-todo-btn').addEventListener('click', () => this.addTodo());
        document.getElementById('new-todo').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }
    
    renderTodos() {
        const todoList = document.getElementById('full-todo-list');
        todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            todoItem.dataset.id = todo.id;
            
            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                <div class="item-actions">
                    <button class="action-btn edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            const checkbox = todoItem.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const editBtn = todoItem.querySelector('.edit');
            editBtn.addEventListener('click', () => this.openEditModal('todo', todo.id));
            
            const deleteBtn = todoItem.querySelector('.delete');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            // Make text clickable to toggle
            const todoText = todoItem.querySelector('.todo-text');
            todoText.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                this.toggleTodo(todo.id);
            });
            
            todoList.appendChild(todoItem);
        });
        
        this.saveData();
    }
    
    renderDashboardTodos() {
        const dashboardTodos = document.getElementById('dashboard-todos');
        dashboardTodos.innerHTML = '';
        
        // Get top 3 incomplete todos
        const topTodos = this.todos.filter(todo => !todo.completed).slice(0, 3);
        
        topTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            
            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox">
                <div class="todo-text">${todo.text}</div>
            `;
            
            // Add event listener
            const checkbox = todoItem.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => {
                this.toggleTodo(todo.id);
                this.renderDashboardTodos();
            });
            
            dashboardTodos.appendChild(todoItem);
        });
        
        // If no todos, show message
        if (topTodos.length === 0) {
            dashboardTodos.innerHTML = '<div class="empty-state">All tasks completed! 🎉</div>';
        }
    }
    
    addTodo() {
        const input = document.getElementById('new-todo');
        const text = input.value.trim();
        
        if (text) {
            const newId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
            this.todos.push({
                id: newId,
                text: text,
                completed: false
            });
            
            this.renderTodos();
            this.renderDashboardTodos();
            input.value = '';
        }
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.renderTodos();
            this.renderDashboardTodos();
        }
    }
    
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.renderTodos();
            this.renderDashboardTodos();
        }
    }
    
    updateTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            this.renderTodos();
            this.renderDashboardTodos();
        }
    }
    
    // Goals
    initGoals() {
        this.goals = JSON.parse(localStorage.getItem('dashboardGoals')) || [
            { id: 1, text: "Learn React.js", progress: 65 },
            { id: 2, text: "Run a marathon", progress: 30 },
            { id: 3, text: "Save $5,000", progress: 45 },
            { id: 4, text: "Read 12 books this year", progress: 25 }
        ];
        
        this.renderGoals();
        this.renderDashboardGoal();
        
        // Add goal event listeners
        document.getElementById('add-goal-btn').addEventListener('click', () => this.addGoal());
    }
    
    renderGoals() {
        const goalList = document.getElementById('full-goal-list');
        goalList.innerHTML = '';
        
        this.goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            goalItem.dataset.id = goal.id;
            
            goalItem.innerHTML = `
                <div style="flex: 1;">
                    <div class="goal-title">${goal.text}</div>
                    <div class="goal-progress">
                        <div class="goal-progress-bar" style="width: ${goal.progress}%"></div>
                    </div>
                    <div class="goal-status">${goal.progress}% complete</div>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            const editBtn = goalItem.querySelector('.edit');
            editBtn.addEventListener('click', () => this.openEditModal('goal', goal.id));
            
            const deleteBtn = goalItem.querySelector('.delete');
            deleteBtn.addEventListener('click', () => this.deleteGoal(goal.id));
            
            goalList.appendChild(goalItem);
        });
        
        this.saveData();
    }
    
    renderDashboardGoal() {
        const dashboardGoal = document.getElementById('dashboard-goal');
        
        // Get the first goal as current goal
        if (this.goals.length > 0) {
            const goal = this.goals[0];
            dashboardGoal.innerHTML = `
                <div class="goal-item">
                    <div>
                        <div class="goal-title">${goal.text}</div>
                        <div class="goal-desc">Keep pushing forward!</div>
                        <div class="goal-progress">
                            <div class="goal-progress-bar" style="width: ${goal.progress}%"></div>
                        </div>
                        <div class="goal-status">${goal.progress}% complete</div>
                    </div>
                </div>
            `;
        } else {
            dashboardGoal.innerHTML = '<div class="empty-state">No goals set. Add one!</div>';
        }
    }
    
    addGoal() {
        const input = document.getElementById('new-goal');
        const progressInput = document.getElementById('new-goal-progress');
        const text = input.value.trim();
        const progress = parseInt(progressInput.value) || 0;
        
        if (text) {
            const newId = this.goals.length > 0 ? Math.max(...this.goals.map(g => g.id)) + 1 : 1;
            this.goals.push({
                id: newId,
                text: text,
                progress: progress
            });
            
            this.renderGoals();
            this.renderDashboardGoal();
            input.value = '';
            progressInput.value = '';
        }
    }
    
    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(goal => goal.id !== id);
            this.renderGoals();
            this.renderDashboardGoal();
        }
    }
    
    updateGoal(id, newText, newProgress) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.text = newText;
            goal.progress = parseInt(newProgress) || 0;
            this.renderGoals();
            this.renderDashboardGoal();
        }
    }
    
    // Notes
    initNotes() {
        this.notes = JSON.parse(localStorage.getItem('dashboardNotes')) || [
            { id: 1, date: "2023-10-15", content: "Remember to check the budget app for monthly expenses." },
            { id: 2, date: "2023-10-14", content: "Meeting with team at 2 PM tomorrow." },
            { id: 3, date: "2023-10-13", content: "Great workout today! Feeling energized." }
        ];
        
        this.renderNotes();
        
        // Add note event listeners
        document.getElementById('add-note-btn').addEventListener('click', () => this.addNote());
    }
    
    renderNotes() {
        const notesContainer = document.getElementById('notes-container');
        notesContainer.innerHTML = '';
        
        // Sort notes by date (newest first)
        const sortedNotes = [...this.notes].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.dataset.id = note.id;
            
            // Format date for display
            const dateObj = new Date(note.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            noteItem.innerHTML = `
                <div class="note-header">
                    <div class="note-date">${formattedDate}</div>
                    <div class="item-actions">
                        <button class="action-btn edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="note-content">${note.content}</div>
            `;
            
            // Add event listeners
            const editBtn = noteItem.querySelector('.edit');
            editBtn.addEventListener('click', () => this.openEditModal('note', note.id));
            
            const deleteBtn = noteItem.querySelector('.delete');
            deleteBtn.addEventListener('click', () => this.deleteNote(note.id));
            
            notesContainer.appendChild(noteItem);
        });
        
        this.saveData();
    }
    
    addNote() {
        const input = document.getElementById('new-note');
        const content = input.value.trim();
        
        if (content) {
            const newId = this.notes.length > 0 ? Math.max(...this.notes.map(n => n.id)) + 1 : 1;
            const today = new Date().toISOString().split('T')[0];
            
            this.notes.push({
                id: newId,
                date: today,
                content: content
            });
            
            this.renderNotes();
            input.value = '';
        }
    }
    
    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.renderNotes();
        }
    }
    
    updateNote(id, newContent) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.content = newContent;
            this.renderNotes();
        }
    }
    
    // Time Tracker
    initTimeTracker() {
        this.trackerSeconds = 0;
        this.trackerInterval = null;
        this.isTracking = false;
        
        // Load saved tracker time
        const savedTime = localStorage.getItem('trackerTime');
        if (savedTime) {
            this.trackerSeconds = parseInt(savedTime);
            this.updateTrackerDisplay();
        }
        
        // Event listeners
        document.getElementById('start-tracker').addEventListener('click', () => this.startTracker());
        document.getElementById('pause-tracker').addEventListener('click', () => this.pauseTracker());
        document.getElementById('reset-tracker').addEventListener('click', () => this.resetTracker());
        
        // Initialize display
        this.updateTrackerDisplay();
    }
    
    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateTrackerDisplay() {
        document.getElementById('tracker-time').textContent = this.formatTime(this.trackerSeconds);
    }
    
    startTracker() {
        if (!this.isTracking) {
            this.isTracking = true;
            const taskName = document.getElementById('tracker-task-input').value.trim() || "Untitled Task";
            document.getElementById('current-task').textContent = taskName;
            
            this.trackerInterval = setInterval(() => {
                this.trackerSeconds++;
                this.updateTrackerDisplay();
                localStorage.setItem('trackerTime', this.trackerSeconds.toString());
            }, 1000);
        }
    }
    
    pauseTracker() {
        if (this.isTracking) {
            this.isTracking = false;
            clearInterval(this.trackerInterval);
        }
    }
    
    resetTracker() {
        this.isTracking = false;
        clearInterval(this.trackerInterval);
        this.trackerSeconds = 0;
        this.updateTrackerDisplay();
        document.getElementById('current-task').textContent = "No active task";
        document.getElementById('tracker-task-input').value = "";
        localStorage.removeItem('trackerTime');
    }
    
    // Pomodoro Timer
    initPomodoro() {
        this.pomodoroTimes = {
            pomodoro: 25 * 60,
            'short-break': 5 * 60,
            'long-break': 15 * 60
        };
        
        this.pomodoroSeconds = this.pomodoroTimes.pomodoro;
        this.pomodoroInterval = null;
        this.isPomodoroRunning = false;
        this.currentMode = 'pomodoro';
        
        // Event listeners
        document.getElementById('start-pomodoro').addEventListener('click', () => this.startPomodoro());
        document.getElementById('pause-pomodoro').addEventListener('click', () => this.pausePomodoro());
        document.getElementById('reset-pomodoro').addEventListener('click', () => this.resetPomodoro());
        
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                if (mode !== this.currentMode) {
                    this.setPomodoroMode(mode);
                }
            });
        });
        
        // Initialize display
        this.updatePomodoroDisplay();
    }
    
    formatPomodoroTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updatePomodoroDisplay() {
        document.getElementById('pomodoro-time').textContent = this.formatPomodoroTime(this.pomodoroSeconds);
        
        // Change color based on mode
        if (this.currentMode === 'pomodoro') {
            document.getElementById('pomodoro-time').style.color = 'var(--danger)';
        } else {
            document.getElementById('pomodoro-time').style.color = 'var(--success)';
        }
    }
    
    setPomodoroMode(mode) {
        this.currentMode = mode;
        this.pomodoroSeconds = this.pomodoroTimes[mode];
        this.updatePomodoroDisplay();
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Stop timer if running
        if (this.isPomodoroRunning) {
            clearInterval(this.pomodoroInterval);
            this.isPomodoroRunning = false;
        }
    }
    
    startPomodoro() {
        if (!this.isPomodoroRunning) {
            this.isPomodoroRunning = true;
            
            this.pomodoroInterval = setInterval(() => {
                if (this.pomodoroSeconds > 0) {
                    this.pomodoroSeconds--;
                    this.updatePomodoroDisplay();
                } else {
                    // Timer finished
                    clearInterval(this.pomodoroInterval);
                    this.isPomodoroRunning = false;
                    
                    // Play notification sound if available
                    this.playNotification();
                    
                    alert(`Pomodoro ${this.currentMode} finished!`);
                    
                    // Auto-switch to next mode
                    if (this.currentMode === 'pomodoro') {
                        this.setPomodoroMode('short-break');
                    } else {
                        this.setPomodoroMode('pomodoro');
                    }
                }
            }, 1000);
        }
    }
    
    pausePomodoro() {
        if (this.isPomodoroRunning) {
            this.isPomodoroRunning = false;
            clearInterval(this.pomodoroInterval);
        }
    }
    
    resetPomodoro() {
        this.isPomodoroRunning = false;
        clearInterval(this.pomodoroInterval);
        this.setPomodoroMode(this.currentMode);
    }
    
    playNotification() {
        // Create a simple notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log("Audio context not supported");
        }
    }
    
    // Mood Logger
    initMoodLogger() {
        this.selectedMood = 'neutral';
        this.moodEmojis = {
            happy: '😊',
            neutral: '😐',
            sad: '😔',
            stressed: '😫',
            productive: '🚀'
        };
        
        this.moodLabels = {
            happy: 'Happy',
            neutral: 'Neutral',
            sad: 'Sad',
            stressed: 'Stressed',
            productive: 'Productive'
        };
        
        this.moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [
            { mood: 'happy', time: '10:30 AM' },
            { mood: 'productive', time: 'Yesterday, 2:15 PM' },
            { mood: 'stressed', time: 'Oct 12, 4:45 PM' },
            { mood: 'neutral', time: 'Oct 11, 11:20 AM' }
        ];
        
        // Mood selection
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', () => {
                const mood = option.getAttribute('data-mood');
                this.selectedMood = mood;
                
                // Update active state
                document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Set neutral as default active
        document.querySelectorAll('.mood-option').forEach(option => {
            if (option.getAttribute('data-mood') === 'neutral') {
                option.classList.add('active');
            }
        });
        
        // Log mood button
        document.getElementById('log-mood-btn').addEventListener('click', () => this.logMood());
        
        // Render mood history
        this.renderMoodHistory();
    }
    
    renderMoodHistory() {
        const moodHistoryElement = document.getElementById('mood-history');
        moodHistoryElement.innerHTML = '';
        
        this.moodHistory.forEach(entry => {
            const moodEntry = document.createElement('div');
            moodEntry.className = 'mood-entry';
            
            moodEntry.innerHTML = `
                <div class="mood-entry-emoji">${this.moodEmojis[entry.mood]}</div>
                <div class="mood-entry-label">${this.moodLabels[entry.mood]}</div>
                <div class="mood-entry-date">${entry.time}</div>
            `;
            
            moodHistoryElement.appendChild(moodEntry);
        });
    }
    
    logMood() {
        const now = new Date();
        let timeString;
        
        // Format time
        if (this.isToday(now)) {
            timeString = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        } else if (this.isYesterday(now)) {
            timeString = `Yesterday, ${now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`;
        } else {
            timeString = now.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) + ', ' + 
                        now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        }
        
        // Add to history
        this.moodHistory.unshift({
            mood: this.selectedMood,
            time: timeString
        });
        
        // Keep only last 5 entries
        if (this.moodHistory.length > 5) {
            this.moodHistory.pop();
        }
        
        // Update display and save
        this.renderMoodHistory();
        localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
        
        // Show confirmation
        alert(`Logged mood: ${this.moodLabels[this.selectedMood]} ${this.moodEmojis[this.selectedMood]}`);
    }
    
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
               date.getMonth() === yesterday.getMonth() &&
               date.getFullYear() === yesterday.getFullYear();
    }
    
    // Edit Modal
    initEditModal() {
        this.currentEditType = null;
        this.currentEditId = null;
        
        // Modal elements
        this.modal = document.getElementById('edit-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.editInput = document.getElementById('edit-input');
        this.extraFields = document.getElementById('extra-edit-fields');
        
        // Close modal buttons
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-edit').addEventListener('click', () => this.closeModal());
        
        // Save button
        document.getElementById('save-edit').addEventListener('click', () => this.saveEdit());
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
    
    openEditModal(type, id) {
        this.currentEditType = type;
        this.currentEditId = id;
        
        // Set modal title
        this.modalTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        // Clear extra fields
        this.extraFields.innerHTML = '';
        
        // Set input value based on type
        let currentValue = '';
        let extraHtml = '';
        
        switch(type) {
            case 'todo':
                const todo = this.todos.find(t => t.id === id);
                currentValue = todo ? todo.text : '';
                break;
                
            case 'goal':
                const goal = this.goals.find(g => g.id === id);
                currentValue = goal ? goal.text : '';
                extraHtml = `
                    <label for="edit-progress" style="display: block; margin-top: 10px; font-size: 14px; color: var(--text-muted);">Progress %</label>
                    <input type="number" id="edit-progress" min="0" max="100" value="${goal ? goal.progress : 0}" class="input-field" style="margin-top: 5px;">
                `;
                break;
                
            case 'note':
                const note = this.notes.find(n => n.id === id);
                currentValue = note ? note.content : '';
                this.editInput.style.height = '150px';
                break;
        }
        
        this.editInput.value = currentValue;
        this.extraFields.innerHTML = extraHtml;
        
        // Open modal
        this.modal.classList.add('active');
        this.editInput.focus();
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.currentEditType = null;
        this.currentEditId = null;
        this.editInput.style.height = '';
    }
    
    saveEdit() {
        const newValue = this.editInput.value.trim();
        
        if (!newValue) {
            alert('Please enter a value');
            return;
        }
        
        switch(this.currentEditType) {
            case 'todo':
                this.updateTodo(this.currentEditId, newValue);
                break;
                
            case 'goal':
                const progressInput = document.getElementById('edit-progress');
                const newProgress = progressInput ? parseInt(progressInput.value) || 0 : 0;
                this.updateGoal(this.currentEditId, newValue, newProgress);
                break;
                
            case 'note':
                this.updateNote(this.currentEditId, newValue);
                break;
        }
        
        this.closeModal();
    }
    
    // Data Persistence
    saveData() {
        localStorage.setItem('dashboardTodos', JSON.stringify(this.todos));
        localStorage.setItem('dashboardGoals', JSON.stringify(this.goals));
        localStorage.setItem('dashboardNotes', JSON.stringify(this.notes));
    }
    
    loadData() {
        // Data is already loaded in respective init methods
        console.log('Data loaded from localStorage');
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});
