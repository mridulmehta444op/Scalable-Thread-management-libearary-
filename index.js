// Configuration
const CONFIG = {
    API_URL: 'http://localhost:8080/api', // Your C++ backend API
    UPDATE_INTERVAL: 2000, // Update every 2 seconds
    MAX_THREADS_TO_DISPLAY: 10,
    currentPage: 1
};

// State
let state = {
    threads: [],
    metrics: {
        activeThreads: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        throughput: 0,
        totalThreadsCreated: 0,
        avgLatency: 0
    },
    logs: [],
    isConnected: false,
    chart: null,
    updateInterval: null
};

// DOM Elements
const elements = {
    // Thread Control
    threadCount: document.getElementById('thread-count'),
    threadCountValue: document.getElementById('thread-count-value'),
    startBtn: document.getElementById('start-threads'),
    pauseBtn: document.getElementById('pause-threads'),
    stopBtn: document.getElementById('stop-threads'),
    
    // Configuration
    schedulerType: document.getElementById('scheduler-type'),
    maxThreads: document.getElementById('max-threads'),
    autoScale: document.getElementById('auto-scale'),
    applyConfig: document.getElementById('apply-config'),
    
    // Stats
    statActive: document.getElementById('stat-active'),
    statCpu: document.getElementById('stat-cpu'),
    statMemory: document.getElementById('stat-memory'),
    statThroughput: document.getElementById('stat-throughput'),
    
    // Table
    threadTableBody: document.getElementById('thread-table-body'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),
    
    // Charts
    performanceChart: document.getElementById('performance-chart'),
    
    // Logs
    logsContent: document.getElementById('logs-content'),
    clearLogs: document.getElementById('clear-logs'),
    logErrors: document.getElementById('log-errors'),
    logInfo: document.getElementById('log-info'),
    
    // Footer
    connectionStatus: document.getElementById('connection-status'),
    updateTime: document.getElementById('update-time'),
    exportData: document.getElementById('export-data'),
    refreshData: document.getElementById('refresh-data')
};

// Initialize the application
function init() {
    setupEventListeners();
    initializeChart();
    checkBackendConnection();
    startAutoUpdate();
    addLog('Application initialized', 'success');
}

// Event Listeners Setup
function setupEventListeners() {
    // Thread Control
    elements.threadCount.addEventListener('input', updateThreadCountDisplay);
    elements.startBtn.addEventListener('click', startThreads);
    elements.pauseBtn.addEventListener('click', pauseThreads);
    elements.stopBtn.addEventListener('click', stopThreads);
    
    // Configuration
    elements.applyConfig.addEventListener('click', applyConfiguration);
    
    // Pagination
    elements.prevPage.addEventListener('click', () => changePage(-1));
    elements.nextPage.addEventListener('click', () => changePage(1));
    
    // Logs
    elements.clearLogs.addEventListener('click', clearLogs);
    elements.logErrors.addEventListener('change', filterLogs);
    elements.logInfo.addEventListener('change', filterLogs);
    
    // Footer Actions
    elements.exportData.addEventListener('click', exportData);
    elements.refreshData.addEventListener('click', refreshData);
    
    // Real-time update toggles
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoUpdate();
        } else {
            startAutoUpdate();
        }
    });
}

// Initialize Performance Chart
function initializeChart() {
    const ctx = elements.performanceChart.getContext('2d');
    
    state.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 20}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Active Threads',
                    data: Array(20).fill(0),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'CPU Usage (%)',
                    data: Array(20).fill(0),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Tasks/Second',
                    data: Array(20).fill(0),
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// Update Chart with new data
function updateChart() {
    if (!state.chart) return;
    
    // Shift old data and add new data
    state.chart.data.datasets[0].data.shift();
    state.chart.data.datasets[0].data.push(state.metrics.activeThreads);
    
    state.chart.data.datasets[1].data.shift();
    state.chart.data.datasets[1].data.push(state.metrics.cpuUsage);
    
    state.chart.data.datasets[2].data.shift();
    state.chart.data.datasets[2].data.push(state.metrics.throughput);
    
    state.chart.update('none');
}

// Backend Connection Check
async function checkBackendConnection() {
    try {
        // Simulate API call - Replace with actual fetch to your C++ backend
        // const response = await fetch(`${CONFIG.API_URL}/health`);
        // const data = await response.json();
        
        // For demo purposes, simulate connection
        await new Promise(resolve => setTimeout(resolve, 500));
        
        state.isConnected = true;
        elements.connectionStatus.textContent = 'Connected to Backend';
        elements.connectionStatus.style.color = '#4CAF50';
        addLog('Successfully connected to thread manager backend', 'success');
        
        // Load initial data
        await loadInitialData();
        
    } catch (error) {
        state.isConnected = false;
        elements.connectionStatus.textContent = 'Disconnected from Backend';
        elements.connectionStatus.style.color = '#f44336';
        addLog('Failed to connect to backend', 'error');
        console.error('Backend connection error:', error);
    }
}

// Load Initial Data
async function loadInitialData() {
    if (!state.isConnected) return;
    
    try {
        // Simulate API calls
        // const threadsResponse = await fetch(`${CONFIG.API_URL}/threads`);
        // const metricsResponse = await fetch(`${CONFIG.API_URL}/metrics`);
        
        // Mock data for demonstration
        const mockThreads = generateMockThreads(50);
        const mockMetrics = generateMockMetrics();
        
        state.threads = mockThreads;
        state.metrics = mockMetrics;
        
        updateUI();
        addLog('Loaded initial thread data', 'info');
        
    } catch (error) {
        addLog('Failed to load initial data', 'error');
        console.error('Data loading error:', error);
    }
}

// Update UI with current state
function updateUI() {
    // Update stats
    elements.statActive.textContent = state.metrics.activeThreads;
    elements.statCpu.textContent = `${state.metrics.cpuUsage}%`;
    elements.statMemory.textContent = `${state.metrics.memoryUsage}MB`;
    elements.statThroughput.textContent = state.metrics.throughput;
    
    // Update thread table
    updateThreadTable();
    
    // Update chart
    updateChart();
    
    // Update timestamp
    const now = new Date();
    elements.updateTime.textContent = `Last Updated: ${now.toLocaleTimeString()}`;
}

// Update Thread Table
function updateThreadTable() {
    const startIndex = (CONFIG.currentPage - 1) * CONFIG.MAX_THREADS_TO_DISPLAY;
    const endIndex = startIndex + CONFIG.MAX_THREADS_TO_DISPLAY;
    const pageThreads = state.threads.slice(startIndex, endIndex);
    
    elements.threadTableBody.innerHTML = '';
    
    pageThreads.forEach(thread => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${thread.id}</td>
            <td>
                <span class="thread-status status-${thread.status}">
                    ${thread.status.toUpperCase()}
                </span>
            </td>
            <td>${thread.cpuUsage}%</td>
            <td>${thread.memoryUsage}MB</td>
            <td>${formatUptime(thread.uptime)}</td>
            <td>
                <button onclick="controlThread(${thread.id}, 'pause')" class="btn btn-sm btn-warning">
                    <i class="fas fa-pause"></i>
                </button>
                <button onclick="controlThread(${thread.id}, 'stop')" class="btn btn-sm btn-danger">
                    <i class="fas fa-stop"></i>
                </button>
            </td>
        `;
        
        elements.threadTableBody.appendChild(row);
    });
    
    // Update pagination info
    const totalPages = Math.ceil(state.threads.length / CONFIG.MAX_THREADS_TO_DISPLAY);
    elements.pageInfo.textContent = `Page ${CONFIG.currentPage} of ${totalPages}`;
    elements.prevPage.disabled = CONFIG.currentPage <= 1;
    elements.nextPage.disabled = CONFIG.currentPage >= totalPages;
}

// Thread Control Functions
async function startThreads() {
    const threadCount = parseInt(elements.threadCount.value);
    
    try {
        // Simulate API call to start threads
        addLog(`Starting ${threadCount} threads...`, 'info');
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update state
        const newThreads = generateMockThreads(threadCount, 'running');
        state.threads = [...state.threads, ...newThreads];
        
        addLog(`Successfully started ${threadCount} threads`, 'success');
        updateUI();
        
    } catch (error) {
        addLog(`Failed to start threads: ${error.message}`, 'error');
    }
}

async function pauseThreads() {
    try {
        addLog('Pausing all threads...', 'info');
        
        // Update thread statuses
        state.threads.forEach(thread => {
            if (thread.status === 'running') {
                thread.status = 'paused';
            }
        });
        
        addLog('All threads paused', 'success');
        updateUI();
        
    } catch (error) {
        addLog(`Failed to pause threads: ${error.message}`, 'error');
    }
}

async function stopThreads() {
    try {
        addLog('Stopping all threads...', 'info');
        
        // Update thread statuses
        state.threads.forEach(thread => {
            thread.status = 'stopped';
        });
        
        addLog('All threads stopped', 'success');
        updateUI();
        
    } catch (error) {
        addLog(`Failed to stop threads: ${error.message}`, 'error');
    }
}

function controlThread(threadId, action) {
    const thread = state.threads.find(t => t.id === threadId);
    if (!thread) return;
    
    thread.status = action === 'pause' ? 'paused' : 'stopped';
    addLog(`Thread ${threadId} ${action}ed`, 'info');
    updateUI();
}

// Configuration Functions
async function applyConfiguration() {
    const config = {
        scheduler: elements.schedulerType.value,
        maxThreads: parseInt(elements.maxThreads.value),
        autoScale: elements.autoScale.checked
    };
    
    try {
        addLog('Applying new configuration...', 'info');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        addLog(`Configuration applied: ${JSON.stringify(config)}`, 'success');
        
    } catch (error) {
        addLog(`Failed to apply configuration: ${error.message}`, 'error');
    }
}

// Logging Functions
function addLog(message, type = 'info') {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timeString}] ${message}`;
    
    elements.logsContent.appendChild(logEntry);
    elements.logsContent.scrollTop = elements.logsContent.scrollHeight;
    
    // Keep only last 100 logs in state
    state.logs.push({ message, type, timestamp: now });
    if (state.logs.length > 100) {
        state.logs.shift();
    }
}

function clearLogs() {
    elements.logsContent.innerHTML = '';
    state.logs = [];
    addLog('Logs cleared', 'info');
}

function filterLogs() {
    const showErrors = elements.logErrors.checked;
    const showInfo = elements.logInfo.checked;
    
    elements.logsContent.innerHTML = '';
    
    state.logs.forEach(log => {
        if ((log.type === 'error' && showErrors) || 
            (log.type !== 'error' && showInfo)) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${log.type}`;
            logEntry.textContent = `[${log.timestamp.toLocaleTimeString()}] ${log.message}`;
            elements.logsContent.appendChild(logEntry);
        }
    });
}

// Utility Functions
function updateThreadCountDisplay() {
    elements.threadCountValue.textContent = elements.threadCount.value;
}

function changePage(delta) {
    const totalPages = Math.ceil(state.threads.length / CONFIG.MAX_THREADS_TO_DISPLAY);
    const newPage = CONFIG.currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        CONFIG.currentPage = newPage;
        updateThreadTable();
    }
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function exportData() {
    const data = {
        threads: state.threads,
        metrics: state.metrics,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `thread-manager-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addLog('Data exported successfully', 'success');
}

function refreshData() {
    addLog('Manual refresh triggered', 'info');
    loadInitialData();
}

// Auto Update Functions
function startAutoUpdate() {
    if (state.updateInterval) {
        clearInterval(state.updateInterval);
    }
    
    state.updateInterval = setInterval(async () => {
        if (state.isConnected && !document.hidden) {
            await updateData();
        }
    }, CONFIG.UPDATE_INTERVAL);
}

function stopAutoUpdate() {
    if (state.updateInterval) {
        clearInterval(state.updateInterval);
        state.updateInterval = null;
    }
}

async function updateData() {
    try {
        // Simulate API call for updates
        // const response = await fetch(`${CONFIG.API_URL}/metrics`);
        // const newMetrics = await response.json();
        
        // Generate updated mock data
        const newMetrics = generateMockMetrics();
        
        // Update metrics
        state.metrics = {
            ...state.metrics,
            ...newMetrics
        };
        
        // Update some threads randomly
        state.threads.forEach(thread => {
            if (thread.status === 'running') {
                thread.cpuUsage = Math.floor(Math.random() * 30) + 10;
                thread.memoryUsage = Math.floor(Math.random() * 50) + 10;
                thread.uptime += 2; // Add 2 seconds
            }
        });
        
        updateUI();
        
    } catch (error) {
        console.error('Update error:', error);
    }
}

// Mock Data Generators (Replace with actual API calls)
function generateMockThreads(count, status = 'running') {
    const threads = [];
    const startId = state.threads.length + 1;
    
    for (let i = 0; i < count; i++) {
        threads.push({
            id: startId + i,
            status: status,
            cpuUsage: Math.floor(Math.random() * 100),
            memoryUsage: Math.floor(Math.random() * 100) + 10,
            uptime: Math.floor(Math.random() * 3600),
            priority: Math.floor(Math.random() * 5) + 1
        });
    }
    
    return threads;
}

function generateMockMetrics() {
    return {
        activeThreads: Math.floor(Math.random() * 1000),
        cpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 5000),
        throughput: Math.floor(Math.random() * 10000),
        totalThreadsCreated: Math.floor(Math.random() * 10000),
        avgLatency: Math.random() * 100
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Global function for thread control buttons
window.controlThread = controlThread;