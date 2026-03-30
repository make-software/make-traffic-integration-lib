import { NewTaskManager, Events } from "make-traffic-integration-core";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const manager = await NewTaskManager({
    apiUrl: 'http://127.0.0.1:8585',
    appKey: '<!--YourAppKey-->',
});

const USER_ID = "user-125";

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
manager.subscribe(Events.TaskClaimSucceed, (task) => {
    const rewards = task.rewards.map((r) => `${r.value} ${r.type}`).join(", ");
    notify(`Claimed: ${task.name} — ${rewards}`, "green");
});

manager.subscribe(Events.TaskClaimFailed, (task) => {
    notify(`Claim failed: ${task.name}`, "red");
});

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
const list = document.getElementById("task-list");

async function renderTasks() {
    const { data: tasks } = await manager.getTasks(USER_ID);

    list.innerHTML = "";

    for (const task of tasks ?? []) {
        const li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
            <span class="task-name">${task.name}</span>
            <span class="task-rewards">${task.rewards.map((r) => `+${r.value} ${r.type}`).join(" · ")}</span>
            <div class="task-actions"></div>
        `;

        const actions = li.querySelector(".task-actions");

        if (task.userState.isRewarded) {
            actions.innerHTML = `<span class="done">Done ✓</span>`;
        } else if (task.userState.isClaimAvailable) {
            const btn = document.createElement("button");
            btn.textContent = "Claim";
            btn.onclick = () => manager.claimProcess(USER_ID, task).then(renderTasks);
            actions.appendChild(btn);
        } else {
            const btn = document.createElement("button");
            btn.textContent = "Go";
            btn.onclick = () => manager.goProcess(USER_ID, task).then(renderTasks);
            actions.appendChild(btn);
        }

        list.appendChild(li);
    }
}

renderTasks();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function notify(message, color) {
    const el = document.getElementById("notification");
    el.textContent = message;
    el.style.background = color === "green" ? "#22c55e" : "#ef4444";
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 4000);
}
