---
name: Bug report
about: Create a report to help us improve
title: "[BUG] <Brief description of the issue>"
labels: ''
assignees: koltsov-iv

---

**Describe the bug**
A clear and concise description of what the bug is. Include whether the issue occurs in the core library, a specific framework wrapper (e.g., React), or the example application.

**Library and Version**
- Core library version: [e.g., 1.0.0]
- Wrapper library (if applicable): [e.g., make-traffic-integration-react-wrapper]
- Wrapper version: [e.g., 1.0.0]
- Node.js version: [e.g., 18.0.0]

**To Reproduce**
Steps to reproduce the behavior:
1. Initialize TaskManagerApp with [describe your configuration]
2. Call [method name, e.g., `getTasks()`, `claimProcess()`]
3. [Any additional steps]
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Actual behavior**
What actually happened instead. Include any error messages or unexpected output.

**Code Example**
If applicable, provide a minimal code example that reproduces the issue:

```typescript
// Your code here
import { TaskManagerApp } from "make-traffic-integration-core";

const appConfig = {
    apiUrl: 'https://...',
    appKey: 'your-app-key',
};

const taskManager = new TaskManagerApp(appConfig);
// Steps to reproduce the bug
```

**Error Messages and Logs**
If applicable, include:
- Full error stack trace
- Console logs
- Network request/response details (from browser DevTools)
- Event subscription callback errors

**Environment**
- **Operating System**: [e.g., macOS, Windows, Linux]
- **Browser** (if applicable): [e.g., Chrome, Firefox, Safari]
- **Browser Version** (if applicable): [e.g., 120.0]
- **Package Manager**: [e.g., npm, yarn, pnpm]
- **TypeScript Version** (if using TypeScript): [e.g., 5.0]

**Affected Components**
- [ ] Core library (`make-traffic-integration-core`)
- [ ] React wrapper (`make-traffic-integration-react-wrapper`)
- [ ] Example application (`examples/react-app`)
- [ ] Other: [please specify]

**API Integration Details** (if relevant)
- API URL being used: [e.g., https://make-traffic-integration.dot.com]
- User ID format: [e.g., string, UUID]
- Task type/category: [if applicable]

**Screenshots or Network Traces**
If applicable, add screenshots or network traces to help explain your problem. Include:
- Browser DevTools Network tab showing API requests/responses
- Console error messages
- UI state when the bug occurs

**Additional context**
Add any other context about the problem here, such as:
- Whether this is a regression (worked in a previous version)
- Frequency of occurrence (always, intermittent, etc.)
- Any workarounds you've found
- Related issues or discussions
