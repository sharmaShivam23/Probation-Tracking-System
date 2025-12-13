<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->


🌐 TaskSphere (Probation Tracking System)A robust Student Probation Tracking System designed to streamline task submission, attendance monitoring, and performance evaluation.TaskSphere is a specialized web application developed to digitize and manage the probation period for student societies. It bridges the gap between administrators and students, providing a secure, transparent, and interactive platform for tracking progress.🚀 Impact: Actively used by 50+ users over a 2-month period to successfully manage society probation cycles.📖 Table of Contents✨ Key Features🛡️ Admin Dashboard🎓 Student Dashboard🔐 Security & Authentication⚙️ Tech Stack🏗️ System Architecture📂 Project Structure🚀 Getting Started🔒 Environment Variables📸 Application Flow✨ Key Features🛡️ Admin DashboardEmpowers society leads with full control over the probation process.Task Management: Upload and assign daily/weekly tasks to students.Attendance Tracking: Mark and review daily attendance logs.Live Leaderboard: Real-time ranking system based on task completion and performance.Student Profiling: Access detailed profiles for every student, including submission history and attendance rates.🎓 Student DashboardA centralized hub for students to track their own progress.Performance Analytics: Visual graphs (using Recharts) to display attendance trends and task completion rates.Task Submission: Seamless interface to view assigned tasks and submit work (with file/link support).Progress Tracking: View personal rank and feedback from admins.🔐 Security & AuthenticationBuilt with a "Security First" approach to protect student data.Strict Sign-Up Validation:Domain Lock: Only accepts specific college emails (e.g., ...24...@akgec.ac.in).Pattern Matching: Enforces strictly formatted student numbers (must start with batch year 24 and follow alphanumeric patterns).Bot Protection: Integrated Google reCAPTCHA to prevent spam registrations.Advanced Security Layers:Rate Limiting: Powered by @upstash/redis to prevent DDoS and brute-force attacks.Data Sanitization: Uses xss-clean, helmet, and express-mongo-sanitize to prevent injection attacks.OTP Verification: Email-based OTP verification for account activation.Secure Recovery: robust "Forgot Password" flow using nodemailer.⚙️ Tech StackCategoryTechnologiesFrontendNext.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer MotionBackendNext.js API Routes, Node.jsDatabaseMongoDB (via Mongoose)State/CachingUpstash Redis (Rate Limiting)AuthenticationJWT (JSON Web Tokens), JOSE, BCryptJSDevOpsDocker, GitHub Actions (CI/CD), AWS EC2UtilitiesCloudinary (Media), Nodemailer (Emails), jsPDF (Reports), Joi (Validation)🏗️ System ArchitectureThe application utilizes a modern Micro-frontend inspired architecture within a Monorepo using Next.js.Client Layer: Optimized React components with framer-motion for smooth interactions.Middleware Layer: Custom middleware (middleware.ts) handles JWT verification and Role-Based Access Control (RBAC) to protect Admin/Student routes.API Layer: Secure API endpoints handling logic for auth, tasks, and data retrieval, protected by Rate Limiting and Sanitization libraries.Deployment: The app is containerized using Docker, pushed to a registry, and automatically deployed to an AWS EC2 instance via GitHub Actions pipelines.📂 Project StructureProbation-Tracking-System/
├── .github/workflows/    # CI/CD Pipelines (deploy.yml)
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin-dashboard/
│   │   ├── student-dashboard/
│   │   ├── api/          # Backend API Routes
│   │   ├── login/
│   │   └── register/
│   ├── components/       # Reusable UI Components
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Utility libraries (DB connect, Redis)
│   ├── models/           # Mongoose Data Models
│   ├── middleware/       # Auth & Role protection logic
│   └── store/            # State management
├── Dockerfile            # Container configuration
├── package.json          # Dependencies
└── tailwind.config.ts    # Styling configuration
🚀 Getting StartedFollow these steps to set up the project locally.PrerequisitesNode.js (v18+)MongoDB (Local or Atlas URL)Redis (Upstash or Local)InstallationClone the repositorygit clone [https://github.com/your-username/tasksphere.git](https://github.com/your-username/tasksphere.git)
cd tasksphere
Install dependenciesnpm install
Set up Environment VariablesCreate a .env file in the root directory (see below).Run the development servernpm run dev
Open http://localhost:3000 with your browser to see the result.🔒 Environment VariablesEnsure you configure the following variables in your .env file:# Database
MONGO_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000

# Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Email Service (Nodemailer)
EMAIL_USER=...
EMAIL_PASS=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Security
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
🤝 ContributingContributions are welcome!Fork the Project.Create your Feature Branch (git checkout -b feature/NewFeature).Commit your Changes (git commit -m 'Add some NewFeature').Push to the Branch (git push origin feature/NewFeature).Open a Pull Request.📄 LicenseThis project is licensed under the MIT License.