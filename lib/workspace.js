export const navigation = {
  overview: { title: 'Dashboard', icon: 'LayoutGrid', pages: [['dashboard', 'Dashboard'], ['feed', 'Activity Feed'], ['notifications', 'Notifications']] },
  people: { title: 'Employees', icon: 'Users', pages: [['employees', 'All Employees'], ['onboarding', 'Onboarding'], ['offboarding', 'Offboarding'], ['departments', 'Departments'], ['org-chart', 'Organization Chart'], ['roles', 'Job & Roles'], ['documents', 'Documents'], ['assets', 'Assets Management'], ['directory', 'People Directory']] },
  attendance: { title: 'Attendance & Leave', icon: 'CalendarDays', pages: [['attendance', 'Attendance'], ['leave', 'Leave Management'], ['shifts', 'Shift Management'], ['holidays', 'Holiday Calendar'], ['remote', 'Work From Home']] },
  payroll: { title: 'Payroll & Performance', icon: 'Wallet', pages: [['payroll', 'Payroll'], ['payslips', 'Payslips'], ['reviews', 'Performance Reviews'], ['goals', 'Goals & KPIs']] },
  recognition: { title: 'Engagement', icon: 'Sparkles', pages: [['recognise', 'Recognise'], ['groups', 'Groups'], ['leaderboard', 'Leaderboard'], ['spotlight', 'Spotlight'], ['celebrations', 'Celebrations'], ['wall-of-fame', 'Wall of Fame'], ['engagement', 'Engagement Surveys'], ['lifecycle', 'Lifecycle Surveys']] },
  rewards: { title: 'Rewards', icon: 'Gift', pages: [['marketplace', 'Shop'], ['send-gift', 'Gift'], ['budgets', 'Reward Budgets'], ['history', 'History']] },
  resources: { title: 'Resources', icon: 'BookOpen', pages: [['sop', 'SOP'], ['policies', 'People Policies'], ['help', 'Help Centre'], ['copilot', 'Copilot AI'], ['settings', 'Workspace Settings']] },
};

export const href = (section, page = navigation[section].pages[0][0]) =>
  section === 'overview' && page === 'dashboard' ? '/' : '/portal/' + section + '/' + page + '/';

export const people = [
  ['Sara Scott', 'Design'], ['Ava Mitchell', 'People Operations'],
  ['Liam Patel', 'Engineering'], ['David Chen', 'Engineering'],
];

export const catalog = [
  ['Coffee gift card', 500, '☕', 'Dining', 'A coffee break for you or a colleague.'],
  ['Dining experience', 1500, '🍽️', 'Dining', 'A meal out to celebrate a milestone.'],
  ['Travel voucher', 2000, '✈️', 'Travel', 'Put points toward a future getaway.'],
  ['Wellness voucher', 1000, '🌿', 'Lifestyle', 'Make time for rest and wellbeing.'],
  ['Bookstore voucher', 750, '📚', 'Lifestyle', 'Find a new read or pick up a favorite.'],
  ['Weekend stay voucher', 3000, '🏨', 'Travel', 'Plan an overnight break using your points.'],
  ['Dessert gift card', 650, '🍨', 'Dining', 'Send a small treat as a thank-you.'],
  ['Uber e-gift card', 1000, '🚕', 'Travel', 'Use a ride voucher on your next trip.'],
  ['Merchandise voucher', 1200, '🛍️', 'Lifestyle', 'Put points toward workspace merchandise.'],
  ['Cinema voucher', 900, '🎬', 'Lifestyle', 'Catch a movie on your next evening out.'],
];

export const guides = {
  sop: [
    ['New joiner onboarding', 'People Operations', 'Before day one, assign a buddy and confirm equipment and account access. On day one, introduce the team and review the first-week plan. Ask for feedback at the end of week one.'],
    ['Employee recognition', 'Recognition', 'Open Recognition and select Send recognition. Choose a colleague and describe the specific contribution and its impact. Review the message before posting.'],
    ['Employee offboarding', 'People Operations', ['Confirm the last working day and assign owners for each handover.', 'Review access removal, asset return and outstanding work with the relevant teams.', 'Record completion and share the exit feedback form.']],
    ['Survey launch checklist', 'People Operations', ['Confirm the audience and review the questions with the survey owner.', 'Set the response deadline and communicate how feedback will be used.', 'Review responses and assign owners to agreed follow-ups.']],
    ['Team celebration checklist', 'Employee Engagement', ['Confirm the milestone and ask whether the colleague is comfortable with a public post.', 'Prepare the message and coordinate any team activity.', 'Share the appreciation on the agreed date.']],
    ['Rewards and redemptions', 'Rewards', 'Review the available points balance, select an item in Marketplace, and confirm the points cost. Check History for the recorded transaction.'],
  ],
  policies: [
    ['Workplace conduct', 'People Operations', 'This is a sample policy entry. Use respectful language, protect confidential information and contact People Operations for guidance.'],
    ['Time off requests', 'People Operations', 'Confirm dates with your manager and record approved time off in your organisation’s HR system.'],
  ],
  help: [
    ['Where can I see my points?', 'Rewards', 'Open Rewards to see your balance. History lists your demo gift and redemption activity.'],
    ['Who can see my demo activity?', 'Workspace', 'Demo activity is saved separately in each browser profile.'],
  ],
};

export const initialData = {
  name: 'Natasha Sharma', balance: 2450, budget: 5000, groups: [], history: [], answers: {},
  posts: [
    { id: 'townhall-overachiever', author: 'Ava Mitchell', recipient: 'Sara Scott', kind: 'Recognition', title: 'Overachiever 2025', body: 'Sara led client onboarding ahead of schedule and achieved a 100% satisfaction score.', highlight: 'Townhall · Client onboarding', likes: 100, comments: [{ author: 'Liam Patel', body: 'Well deserved, Sara! The onboarding playbook set a new standard for the team.' }] },
    { id: 'frontend-platform', author: 'David Chen', kind: 'Update', title: 'Frontend Platform 2.0 is live', body: 'The design system and infrastructure teams completed the migration three weeks ahead of schedule. Latency fell by 42%.', highlight: 'Global Infrastructure Sprint · 12 contributors · 750 points', likes: 45, comments: [] },
    { id: 'onboarding', author: 'Ava Mitchell', recipient: 'Sara Scott', kind: 'Recognition', body: 'Sara turned our onboarding playbook into something every team can actually use. Thanks for making the first week better for new hires!', likes: 12, comments: [] },
    { id: 'mentorship', author: 'Liam Patel', recipient: 'David Chen', kind: 'Recognition', body: 'Thanks for making time to mentor the new engineers and for writing down the small details that make our releases easier.', likes: 9, comments: [] },
    { id: 'design-spotlight', author: 'Sara Scott', recipient: 'Ava Mitchell', kind: 'Spotlight', body: 'Ava ran our first cross-team feedback session and turned the discussion into practical improvements for the next quarter.', likes: 6, comments: [] },
    { id: 'platform', author: 'David Chen', kind: 'Update', body: 'The team platform is live! Thank you to everyone who helped us get it across the finish line this week.', likes: 8, comments: [] },
  ],
};
