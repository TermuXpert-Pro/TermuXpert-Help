const REPO = 'https://raw.githubusercontent.com/TermuXpert-Pro/TermuXpert-Help/main';
let allGroups = [];

async function loadStats() {
    try {
        const [jsonRes, counterRes, versionRes] = await Promise.all([
            fetch(`${REPO}/termux_commands.json`),
            fetch(`${REPO}/counter.txt`),
            fetch(`${REPO}/version.txt`)
        ]);
        const data = await jsonRes.json();
        allGroups = data.groups;
        const els = {
            statGroups: document.getElementById('statGroups'),
            statCommands: document.getElementById('statCommands'),
            statUsers: document.getElementById('statUsers'),
            statVersion: document.getElementById('statVersion')
        };
        if (els.statGroups) els.statGroups.textContent = allGroups.length;
        if (els.statCommands) els.statCommands.textContent = allGroups.reduce((s,g) => s + g.notes.length, 0);
        if (els.statUsers) els.statUsers.textContent = (await counterRes.text()).trim();
        if (els.statVersion) els.statVersion.textContent = (await versionRes.text()).trim();
        return data;
    } catch (e) { return null; }
}

function renderGroups(groups, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    if (!groups || groups.length === 0) {
        grid.innerHTML = '<div class="no-data">No results</div>';
        return;
    }
    grid.innerHTML = groups.map((g, i) => `
        <div class="card" onclick="location.href='commands.html?group=${i}'">
            <h3>${escapeHtml(g.title)}</h3>
            <p>${escapeHtml(g.description || 'Click to view commands')}</p>
            <span class="badge">${g.notes.length} commands</span>
        </div>
    `).join('');
}

function filterGroups(inputId, containerId) {
    const q = document.getElementById(inputId).value.toLowerCase();
    if (!q) { renderGroups(allGroups, containerId); return; }
    renderGroups(allGroups.filter(g =>
        g.title.toLowerCase().includes(q) ||
        (g.description||'').toLowerCase().includes(q) ||
        g.notes.some(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    ), containerId);
}

function loadCommands() {
    const params = new URLSearchParams(window.location.search);
    const index = parseInt(params.get('group'));
    if (isNaN(index) || !allGroups[index]) {
        document.getElementById('commandsList').innerHTML = '<div class="no-data">Group not found</div>';
        return;
    }
    const group = allGroups[index];
    document.getElementById('commandsTitle').textContent = group.title;
    document.getElementById('commandsList').innerHTML = group.notes.length === 0 
        ? '<div class="no-data">No commands</div>'
        : group.notes.map((n, i) => `
            <div class="command-card">
                <div class="command-title">${i+1}. ${escapeHtml(n.title)}</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Termux Command</span>
                        <button class="copy-btn" onclick="copyCode(this, '${escapeHtml(n.content).replace(/'/g, "\\'")}')">Copy</button>
                    </div>
                    <div class="code-content">${escapeHtml(n.content)}</div>
                </div>
            </div>
        `).join('');
}

function copyCode(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
