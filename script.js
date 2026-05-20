  // ========== CUSTOM TIMER LOGIC ==========
  let timeInSeconds = 25 * 60;
  let timerInterval = null;
  
  const timerDisplay = document.getElementById('timerDisplay');
  const timerStatus = document.getElementById('timerStatus');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const customMinutes = document.getElementById('customMinutes');
  const customSeconds = document.getElementById('customSeconds');
  const setCustomBtn = document.getElementById('setCustomBtn');
  const sessionCountSpan = document.getElementById('sessionCount');
  
  let sessionCount = parseInt(localStorage.getItem('studycloud_sessions') || '0');
  sessionCountSpan.textContent = sessionCount;
  
  function updateDisplay() {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  function setTimer(minutes, seconds = 0) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timeInSeconds = (minutes * 60) + seconds;
    updateDisplay();
    timerStatus.innerHTML = `<i class="fas fa-cloud"></i> timer set to ${minutes}:${seconds.toString().padStart(2, '0')} — you got this! <i class="fas fa-cloud-moon"></i>`;
  }
  
  function startTimer() {
    if (timerInterval) return;
    if (timeInSeconds <= 0) {
      timerStatus.innerHTML = "<i class='fas fa-cloud'></i> time's up! set a new timer? <i class='fas fa-cloud-sun'></i>";
      return;
    }
    timerInterval = setInterval(() => {
      if (timeInSeconds > 0) {
        timeInSeconds--;
        updateDisplay();
        
        if (timeInSeconds === 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          timerStatus.innerHTML = "🎉✨ TIME'S UP! Great job! Take a well-deserved break! ☁️🎉";
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              createGlitter(window.innerWidth/2 + (Math.random() - 0.5) * 200, window.innerHeight/2 + (Math.random() - 0.5) * 100);
            }, i * 50);
          }
          sessionCount++;
          sessionCountSpan.textContent = sessionCount;
          localStorage.setItem('studycloud_sessions', sessionCount);
          if (navigator.vibrate) navigator.vibrate(200);
        }
      }
    }, 1000);
    timerStatus.innerHTML = "<i class='fas fa-cloud-moon'></i> studying... you're floating through it! <i class='fas fa-cloud'></i>";
  }
  
  function pauseTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerStatus.innerHTML = "⏸ paused. take a breath, then float on! ☁️";
    }
  }
  
  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    const mins = parseInt(customMinutes.value) || 25;
    const secs = parseInt(customSeconds.value) || 0;
    timeInSeconds = (mins * 60) + secs;
    updateDisplay();
    timerStatus.innerHTML = `<i class="fas fa-cloud"></i> timer reset to ${mins}:${secs.toString().padStart(2, '0')} <i class="fas fa-cloud-moon"></i>`;
  }
  
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  document.querySelectorAll('.preset-btn[data-minutes]').forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.getAttribute('data-minutes'));
      setTimer(minutes, 0);
      customMinutes.value = minutes;
      customSeconds.value = 0;
    });
  });
  
  setCustomBtn.addEventListener('click', () => {
    let mins = parseInt(customMinutes.value) || 0;
    let secs = parseInt(customSeconds.value) || 0;
    if (mins < 0) mins = 0;
    if (secs < 0) secs = 0;
    if (secs > 59) secs = 59;
    if (mins === 0 && secs === 0) mins = 1;
    setTimer(mins, secs);
  });
  
  // ========== BREATHING EXERCISE ==========
  let breathInterval = null;
  let breathStep = 0;
  const breathCircle = document.getElementById('breathCircle');
  const breathText = document.getElementById('breathText');
  const breathInstruction = document.getElementById('breathInstruction');
  
  // Breathing steps: inhale (4s), hold (4s), exhale (6s), rest (2s)
  const breathSteps = [
    { text: "inhale... 🌬️", duration: 4000, scale: 1.15 },
    { text: "hold... 🧘", duration: 4000, scale: 1.15 },
    { text: "exhale... 💨", duration: 6000, scale: 0.9 },
    { text: "rest... ☁️", duration: 2000, scale: 1 }
  ];
  
  function startBreathing() {
    if (breathInterval) {
      clearInterval(breathInterval);
      breathInterval = null;
    }
    breathStep = 0;
    executeBreathStep();
  }
  
  function executeBreathStep() {
    const step = breathSteps[breathStep];
    breathText.textContent = step.text;
    breathCircle.style.transform = `scale(${step.scale})`;
    breathInstruction.innerHTML = `<i class="fas fa-cloud"></i> ${step.text.replace(/[🌬️🧘💨☁️]/g, '').trim()}... ${step.duration/1000}s <i class="fas fa-cloud-moon"></i>`;
    
    breathInterval = setTimeout(() => {
      breathStep = (breathStep + 1) % breathSteps.length;
      executeBreathStep();
    }, step.duration);
  }
  
  function stopBreathing() {
    if (breathInterval) {
      clearTimeout(breathInterval);
      breathInterval = null;
    }
    breathText.textContent = "breathe";
    breathCircle.style.transform = "scale(1)";
    breathInstruction.innerHTML = "tap the circle to start breathing 🌸";
  }
  
  let isBreathing = false;
  breathCircle.addEventListener('click', () => {
    if (isBreathing) {
      stopBreathing();
      isBreathing = false;
    } else {
      startBreathing();
      isBreathing = true;
      createGlitter(breathCircle.getBoundingClientRect().left + 100, breathCircle.getBoundingClientRect().top + 100);
    }
  });
  
  // ========== MOTIVATION QUOTES ==========
  const quotes = [
    "progress is still progress, even if it's small ☁️💖",
    "small steps every day lead to big results. keep floating! ✨",
    "your future self is cheering for you from the clouds ☁️",
    "stress means you care. but don't forget to breathe, you got this 🌸",
    "one task at a time. you're literally floating through it! 🌷",
    "rest is productive too. take that cloud break, bestie! ☁️",
    "you've survived 100% of your bad days. that's a perfect record 💫",
    "every study session is a little cloud victory. count it! 🎉",
    "you are capable of amazing things. believe in your cloud magic 🪄☁️"
  ];
  
  let quoteIndex = 0;
  const quoteText = document.getElementById('quoteText');
  document.getElementById('refreshQuote').addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteText.textContent = quotes[quoteIndex];
    createGlitter(window.innerWidth/2, window.innerHeight/2 - 100);
  });
  
  // ========== GLITTER EFFECT ==========
  function createGlitter(x, y) {
    for (let i = 0; i < 12; i++) {
      let glitter = document.createElement('div');
      glitter.className = 'glitter';
      glitter.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
      glitter.style.top = (y + (Math.random() - 0.5) * 50) + 'px';
      glitter.style.width = Math.random() * 5 + 2 + 'px';
      glitter.style.height = glitter.style.width;
      glitter.style.background = `hsl(${Math.random() * 60 + 40}, 100%, 65%)`;
      document.body.appendChild(glitter);
      glitter.style.opacity = '0.9';
      setTimeout(() => {
        glitter.style.transition = 'all 0.5s ease';
        glitter.style.opacity = '0';
        glitter.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 40 - 20}px) scale(0.3)`;
      }, 10);
      setTimeout(() => glitter.remove(), 600);
    }
  }
  
  // ========== TO-DO LIST ==========
  let tasks = JSON.parse(localStorage.getItem('studycloud_tasks') || '[]');
  const taskList = document.getElementById('taskList');
  const taskInput = document.getElementById('taskInput');
  const taskCountSpan = document.getElementById('taskCount');
  
  function renderTasks() {
    taskList.innerHTML = '';
    let completedCount = 0;
    tasks.forEach((task, idx) => {
      if (task.completed) completedCount++;
      const li = document.createElement('li');
      li.className = 'task-item';
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" data-index="${idx}" ${task.completed ? 'checked' : ''}>
        <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
        <button class="delete-task" data-index="${idx}"><i class="fas fa-trash-alt"></i></button>
      `;
      taskList.appendChild(li);
    });
    taskCountSpan.textContent = completedCount;
    localStorage.setItem('studycloud_tasks', JSON.stringify(tasks));
  }
  
  function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){ if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
  
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = '';
      renderTasks();
      createGlitter(document.getElementById('addTaskBtn').getBoundingClientRect().left, document.getElementById('addTaskBtn').getBoundingClientRect().top);
    }
  });
  
  taskList.addEventListener('click', (e) => {
    const idx = e.target.dataset.index;
    if (idx !== undefined) {
      if (e.target.classList.contains('task-checkbox')) {
        tasks[idx].completed = e.target.checked;
        renderTasks();
        if (e.target.checked) createGlitter(e.clientX, e.clientY);
      } else if (e.target.closest('.delete-task')) {
        tasks.splice(idx, 1);
        renderTasks();
      }
    }
  });
  
  // ========== NOTES ==========
  const notesArea = document.getElementById('notesArea');
  const noteWordCount = document.getElementById('noteWordCount');
  notesArea.value = localStorage.getItem('studycloud_notes') || '';
  
  function updateNoteStat() {
    const words = notesArea.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    noteWordCount.textContent = words;
    localStorage.setItem('studycloud_notes', notesArea.value);
  }
  
  notesArea.addEventListener('input', updateNoteStat);
  updateNoteStat();
  
  // ========== NAVIGATION ==========
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', () => {
      const section = link.getAttribute('data-section');
      const element = document.getElementById(section);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // ========== RANDOM GLITTER RAIN ==========
  setInterval(() => {
    if (Math.random() > 0.85) {
      const randX = Math.random() * window.innerWidth;
      const randY = Math.random() * window.innerHeight;
      let spark = document.createElement('div');
      spark.className = 'glitter';
      spark.style.left = randX + 'px';
      spark.style.top = randY + 'px';
      spark.style.width = '3px';
      spark.style.height = '3px';
      document.body.appendChild(spark);
      spark.style.opacity = '0.8';
      setTimeout(() => {
        spark.style.transition = 'opacity 0.8s';
        spark.style.opacity = '0';
      }, 200);
      setTimeout(() => spark.remove(), 1000);
    }
  }, 1000);
  
  renderTasks();
  updateDisplay();
