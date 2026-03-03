# MAA Prototype — Roadmap

Future features and enhancements beyond the current proof-of-concept.

## From Initial Design (Out of Scope for PoC)

- **Payment processing** — structure the code for future integration
- **Email notifications**
- **Reporting** beyond basic counts and CSV export
- **Mobile-responsive design**
- **CI/CD pipeline**
- **Cloud deployment (AWS)**
  - look into AWS Amplify for hosting
- **Password reset / account management** — handled by Auth0

> **Not planned:** Team/roster management

## Registration Enhancements

### Program Capacity
- Each program in a season carries an open/closed flag — admin can mark any individual program (e.g. 8U Baseball) as full/closed to registration
- The prototype already demonstrates this with `closed: true` on programs (UI shows "Sold Out")

### Waitlist (Nice to Have)
- Waitlist support for closed/sold-out programs (SportsEngine does not offer this)
- Separate feature from basic program capacity — capacity/closed flag comes first

### Season Reopening
- A season has configured open and close dates, but the close date is not the final say
- Admin needs the ability to temporarily reopen a closed season to allow last-minute / late registrants through the system
- Reopening a season is still subject to per-program closed status — if an age group is marked sold out, reopening the season doesn't override that

### Late Registration Fee (Nice to Have)
- $20 late fee per player when registration period has officially closed
- **Private link flow:** generate a unique URL (with nonce query key) to send to individual parents so registration stays closed to the public but accessible to specific families
- Each link is single-use / tied to one parent
- Need to determine if/how SportsEngine handles late fees — may be a net new feature

### Cart & Registration Editing
- After adding a registration to the cart, allow reviewing and editing it
- Ability to go back through the registration flow to make changes before checkout

### Admin Registration
- Allow an admin to register a player on behalf of a parent/guardian
- Skips payment collection
