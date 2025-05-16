# **App Name**: Firebase AI Agent for Cypress Test Generation

## Core Features:

- AI-Powered Test Suggestion: Analyze the linked GitHub repository, and identify potential Cypress tests based on user-facing functionalities using AI-driven code analysis. Use AI to understand code structure and suggest relevant test scenarios, and refactor user edits intelligently. The AI tool should adhere to Cypress best practices when generating the code.
- Integrated UI: Present a clean UI with a navigable functionality list, a code preview panel for the generated Cypress test code, and a real-time test execution console.
- Repo Parsing: Clone and parse the linked repository. Support cloning of the GitHub repository for analysis.
- Cypress Test Generation: Generate Cypress tests based on user selected functionality. Choose from End-to-End or Component tests and adapt the generated test code accordingly.
- Test Execution and Reporting: Execute the generated Cypress tests and show results in real-time. Display live logs and final test status (pass/fail) within the UI.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent reliability and code analysis.
- Background color: Light gray (#F5F5F5) to provide a clean and neutral backdrop.
- Accent color: A soft green (#90EE90) to highlight success and passing test cases.
- Use a clean and modern sans-serif font for readability, particularly in the code editor and test logs.
- Utilize clear and concise icons to represent test status (pass, fail, running) and functionality categories.
- Employ a split-screen layout with a sidebar for navigation and a main area for code preview and test results.