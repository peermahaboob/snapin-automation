# 📌 Snapin Automation Framework
This project is a **Playwright-based automation framework** built using **JavaScript** to test **Snapin integrations**. It combines both **UI and API validations** and runs tests using a **single worker node** configuration.

---

## 🧰 Tech Stack
- [Playwright](https://playwright.dev/) – Test automation framework  
- JavaScript – Language  
- [Faker](https://fakerjs.dev/) – Generate fake data  
- [Allure](https://docs.qameta.io/allure/) – Reporting  
- [Axios](https://axios-http.com/) – API requests  
- [dotenv](https://www.npmjs.com/package/dotenv) – Handle environment variables  
- [IMAP](https://www.npmjs.com/package/imap) & [Mailparser](https://nodemailer.com/extras/mailparser/) – Email parsing for verification flows

---

## 🗂️ Project Structure
```
.
├── config
│   ├── .env                       # Environment variables
│   ├── api-constants.js          # API endpoints and static values
│   ├── setupSession.js           # Session setup & cleanup script
│   └── 3rd-party
│       └── connection.js         # 3rd-party integration configs
│
├── pages
│   ├── devrev                    # DevRev-specific UI pages
│   └── third-party               # (If needed) 3rd-party UI pages
│
├── test_data
│   └── azure_board               # Test data per integration
│
├── tests
│   ├── azure-board.spec.js       # Example test file
│   └── ...                       # Other test specs
│
├── utils                         # Common utilities (API helpers, etc.)
```
----

## 🧪 Writing Tests
- Place test files in the tests/ folder

- Name the file using the pattern: feature-name.spec.js (e.g., azure-board.spec.js)

- Use relevant test data from test_data/

---

## 🔁 Utilities
Common helper functions (e.g., API utilities, random data generators, email fetchers) are placed under the utils/ folder. These are shared across different tests and components.

---

## 📝 Prerequisites
-  Node.js (v18+ recommended)
-  npm (comes with Node.js)
-  Allure CLI for reporting:
``` bash
npm install -g allure-commandline --save-dev
```

## 📦 Install Project Dependencies
``` bash
git clone https://github.com/peermahaboob/snapin-automation.git
cd snapin-automation

# Install required npm packages
npm install
```

## ✅ Verify Installation
``` bash
# Run a quick test to ensure playwright is working
npx playwright --version

# Run a test to verify your setup
npx playwright test
```

## 🚀 Available Scripts
Below are the available npm scripts and CLI commands to run and manage tests:

```bash
# Run All Tests
npx playwright test tests
# Run Specific Test
npx playwright test tests/ui-test/azure-board.spec.js
# Run Specific Test in Headed Mode
npx playwright test tests/ui-test/azure-board.spec.js --headed
# Allure Reporting
# Generate Allure Report
allure generate allure-results -o allure-report --clean
# Open Allure Report in Browser
allure open allure-report
# For running playwright in recording mode
npx playwright codegen https://app.devrev.ai/test-demo1
# This will launch a browser to help you generate selectors and scripts by recording user interactions.
```





