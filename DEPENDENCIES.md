# Dependency Management & Build Warnings

## Safe Build Warnings

### npm allow-scripts Warnings

The following warnings are **safe and expected** - they come from legitimate, widely-used packages:

#### 1. `sharp@0.34.5` (from Next.js)
- **Why it's needed:** Image optimization library required by Next.js 16
- **Install script:** Builds native bindings for image processing
- **Status:** ✅ Safe - Official Next.js dependency
- **Reference:** https://www.npmjs.com/package/sharp

#### 2. `unrs-resolver@1.12.2` (from ESLint)
- **Why it's needed:** TypeScript import resolver for ESLint configuration
- **Postinstall script:** Configures resolver settings
- **Status:** ✅ Safe - Used by ESLint config
- **Reference:** https://www.npmjs.com/package/unrs-resolver

## Removed Deprecated Packages

The following packages have been **completely removed**:
- ❌ `crypto-js@4.2.0` - No longer maintained, was unused
- ✅ Now using native Node.js crypto APIs instead

## Build Configuration

- **Framework:** Next.js 16.2.7 (Latest)
- **Runtime:** Node.js 18+ (Vercel default)
- **Build Output:** Server-side rendering (not static export)
- **Environment:** Production-ready with full API support

## Dependency Audit

To verify all dependencies are safe:
```bash
npm audit
npm outdated
npm ls
```

## Vercel Deployment

All dependencies are compatible with Vercel's deployment environment.
Environment variables required:
- `NEXTAUTH_URL` - Your deployment domain
- `NEXTAUTH_SECRET` - JWT signing secret
