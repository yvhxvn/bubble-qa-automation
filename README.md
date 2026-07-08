# End-to-End Test Automation for a Bubble Platform

A desktop test-automation tool I designed and built to validate the full **happy path** of a freelance-style platform running on [Bubble](https://bubble.io). It runs every critical user flow end to end, in strict order, and produces a shareable statistics report — all from a single button.

> **Context.** This was built as an internal tool for a commercial team — meant to be run by my colleagues (developers, QA, and non-technical teammates) to smoke-test the platform after each deployment. It is **not** a public/user-facing product. Everything in this repository — the architecture, the tooling, the automation strategy, and the desktop app — was designed and implemented by me.

---

### Demo Video

[Watch the video](https://drive.google.com/file/d/12aOG5VAocnAYUmmviIjYRNLx7RWV3odK/view?usp=sharing)

<sub><u>**⚠️ Only after access**</u></sub>

---

## Engineering Challenges

The platform runs on Bubble, which is notoriously difficult to automate reliably:

- **Dynamic element IDs** that change on every render, so nothing can be hard-coded.
- **Delayed, partial rendering** — old step elements linger in the DOM (hidden) while the next step loads.
- **Custom rich-text editors (Quill)** that ignore standard input events.
- **Flaky selectors** and elements that overlap or re-mount mid-interaction.

The core engineering goal was to make a test suite that stays **green consistently** on top of this instability — not just once, but on every run.

---

## Key features

### 🔑 Unique project identity per run
Every run generates a unique project name in the format `PR-{DD.MM}-{last 4 digits of timestamp}` (e.g. `PR-19.02-8901`). This guarantees each test run creates its own isolated data and never collides with previous runs — which is essential for a smoke test that writes to a live database.

### 🔗 Automatic data hand-off between flows
The flows are dependent: a project must be **created** before it can be **matched**, **submitted on**, **signed**, and **completed**. To make this fully hands-off, the first flow saves its generated project name to disk, and the runner injects that value into the environment so every subsequent flow picks it up automatically. No manual copy-paste between steps.

### ⛓️ Strict sequential execution
Because each flow depends on the previous one, the runner executes them **one after another** — never in parallel. A failure in any flow stops the chain and surfaces immediately, which is exactly the behaviour you want from a smoke test.

### 🛡️ Stability-first interaction layer
I wrote a reusable `safeClick` helper built around Playwright's `toPass` retry mechanism, plus intelligent waits that anchor on the *next* step's elements rather than arbitrary timeouts. Text entry uses `pressSequentially` (and, for Quill, direct DOM insertion via `execCommand`) instead of `fill`, because Bubble's editors silently drop standard input. These decisions are what make the suite reliable rather than flaky.

### 🖥️ One-click desktop app (no terminal)
The whole suite is wrapped in an **Electron** desktop app so any teammate — technical or not — can run the full test cycle by pressing a single button, watch a live log stream as it runs, and open the report when it finishes.

### 📊 Allure reporting
After a run, the tool generates an **Allure** report giving a clean overview of what passed, how long each step took, and the full execution breakdown. The report shown in the demo is the raw default — it's designed to be extended with branding, richer detail, and historical trend tracking.

### 🧱 Clean, maintainable architecture
- **Page Object Model** (`LoginPage`, `DescriptionPage`) to keep selectors out of test bodies.
- **Shared helpers** for retries, unique-name generation, and config.
- **Centralised configuration** — all credentials and environment values live in `.env`, never in the code.

### 🚦 CI/CD-ready by design
The project is structured so it can drop into a CI/CD pipeline (sequential runner, environment-driven config, headless-capable, artifact-producing reports).

---

## Covered flows

| # | Flow | What it verifies |
|---|------|------------------|
| 1 | **Project Request Creation** | A client can create a project request end to end and it lands in the database with a unique name. |
| 2 | **Admin Matchmaking** | An admin panel. |
| 3 | **Delivery Partner Submission** | A delivery partner can build and submit a full proposal, including services, KPIs, timeline, and signature. |
| 4 | **Proposal Signing** | The client can review and sign the proposal. |
| 5 | **Project Completion** | The project can be marked complete, closing the loop. |

---

## Tech stack

- **[Playwright](https://playwright.dev/)** + **TypeScript** — test framework and language
- **[Electron](https://www.electronjs.org/)** — desktop UI wrapper
- **[Allure](https://allurereport.org/)** — reporting
- **Page Object Model** — structure
- **dotenv** — configuration management

---

## Project structure

```
equalreach-bubble/
├── app/                    # Electron desktop app
│   ├── main.js             # Sequential runner + env hand-off logic
│   └── index.html          # UI (run button, live log, report button)
├── smoke-tests/            # The 5 critical flows
│   ├── pr-creation.spec.ts
│   ├── admin-matchmaking.spec.ts
│   ├── dp-submission.spec.ts
│   ├── proposal-signing.spec.ts
│   └── project-completion.spec.ts
├── pom/                    # Page Object Model
│   ├── LoginPage.ts
│   └── DescriptionPage.ts
├── helpers/                # Shared utilities
│   ├── config.ts           # Centralised env config
│   └── utils.ts            # safeClick, unique-name generator
├── playwright.config.ts
└── package.json
```

---

## Requirements
- [Node.js](https://nodejs.org/) v18+
- [Java](https://adoptium.net/) (required by Allure for report generation)

## Notes & design decisions

- **Headed mode is intentional.** The suite runs in `--headed` because, on this Bubble platform, headed runs proved measurably more stable than headless.
- **`.env` is git-ignored.**
- **Sequential by necessity.** The flows share state (the same project moves through its whole lifecycle), so parallel execution isn't just slower — it's incorrect.

---

## Author

Built entirely by **Yevhenii Myronenko** — test architecture, automation strategy, desktop app, and reporting.

- GitHub: [@yvhxvn](https://github.com/yvhxvn)
- LinkedIn: [Yevhenii Myronenko](https://www.linkedin.com/in/yevhenii-myronenko-5a3919306/)
