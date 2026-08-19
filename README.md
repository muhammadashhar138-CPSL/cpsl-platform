# 🛡️ CPSL — Cyber-Physical Security Layer

[![Netlify Status](https://api.netlify.com/api/v1/badges/a3f695eb-3cb2-4817-b62c-a633bdb3d84b/deploy-status)](https://app.netlify.com/projects/cyberphysicalsecuritylayer/deploys)

**Next.js prototype for cyber-physical incident intelligence platform targeting UK SMEs.**

Incident Reconstruction Engine (IRE) with cross-domain threat correlation, real-time monitoring, and automated security response recommendations.

## 🚀 Features

- ✅ **Real-time monitoring** across 4 domains (CCTV, Access Control, Machine, Network)
- ✅ **Incident Reconstruction Engine (IRE)** — AI-powered threat correlation
- ✅ **Suspicion chains** — Multi-domain anomaly detection
- ✅ **Plain-English narratives** — IRE analysis in readable format
- ✅ **Recommended responses** — Actionable security recommendations
- ✅ **Authentication** — NextAuth.js with demo account
- ✅ **Settings management** — 6-tab configuration system
- ✅ **Persistent state** — localStorage + React Context
- ✅ **Multi-site support** — Monitor multiple facilities

## 🔗 Links

- 🌐 **Live App:** https://cyberphysicalsecuritylayer.netlify.app
- 💻 **GitHub:** https://github.com/muhammadashhar138-CPSL/cpsl-platform
- 📊 **Netlify Dashboard:** https://app.netlify.com/projects/cyberphysicalsecuritylayer

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:3000

# Demo login
# Email: test@cpsl.co.uk
# Password: demo123456
```

## 📋 Test Flow

1. Click **"🎭 Demo Login"**
2. Click **"Start Monitoring"**
3. Wait **10 seconds** → First incident appears
4. Wait **30 seconds** → Second incident appears
5. Wait **50 seconds** → Third incident appears

Each incident shows:
- Threat score & confidence
- Suspicion chain with domain events
- IRE narrative analysis
- Recommended response actions

## 🏗️ Architecture

- **Frontend:** Next.js 16, React 19, TypeScript
- **State Management:** React Context + Redux pattern
- **Auth:** NextAuth.js with credentials provider
- **Styling:** CSS-in-JS (inline styles)
- **Deployment:** Netlify (auto-deploy on GitHub push)

## 📦 Build

```bash
npm run build
npm run start
```

## 📝 Novel Features

- **Novel Point A:** Cyber-Physical Domain Correlation
- **Novel Point B:** Suspicion Chain Detection
- **Novel Point C:** Incident Reconstruction Engine (IRE)
- **Novel Point D:** Plain-English Narrative Generation
- **Novel Point E:** Automated Response Recommendations

## 🔐 Test Account

```
Email: test@cpsl.co.uk
Password: demo123456
```

## 📄 License

© 2026 muhammadashhar138-CPSL. All rights reserved.
