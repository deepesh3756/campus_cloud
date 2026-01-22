campus-cloud-frontend/
├── public/
│   └── cc-favicon.png
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.js
│   ├── index.css
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   │   └── CampusCloud - Landing Page-hero_img.jpg
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginModal.jsx
│   │   │   └── LoginModal.css
│   │   │
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   │   └── (Wrapper for SiteNavbar)
│   │   │   │
│   │   │   ├── SiteNavbar.jsx
│   │   │   │   ├── Logo (inline)
│   │   │   │   ├── NavLinks (inline)
│   │   │   │   └── GuestMenu (inline - Login button)
│   │   │   │
│   │   │   ├── AuthenticatedNavbar.jsx
│   │   │   ├── AuthenticatedNavbar.css
│   │   │   │   ├── Logo (inline)
│   │   │   │   ├── Notification Bell (inline)
│   │   │   │   ├── User Avatar (inline)
│   │   │   │   └── AuthorizedMenu (inline - Profile, Logout)
│   │   │   │
│   │   │   ├── SiteFooter.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── UserWelcome.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── BatchManagement.jsx
│   │   │   ├── CourseManagement.jsx
│   │   │   ├── FacultyManagement.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   └── SubjectManagement.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── Analytics.jsx
│   │   │   ├── CreateAssignment.jsx
│   │   │   ├── EvaluationForm.jsx
│   │   │   └── SubmissionList.jsx
│   │   │
│   │   └── student/
│   │       ├── AssignmentCard.jsx
│   │       ├── AssignmentList.jsx
│   │       ├── Dashboard.jsx
│   │       ├── StatsCard.jsx
│   │       └── SubmissionForm.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   │   ├── login() function
│   │   │   ├── logout() function
│   │   │   ├── register() function
│   │   │   └── User state management
│   │   │
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   │   └── (useAuth hook - wrapper for AuthContext)
│   │   │
│   │   ├── useApi.js
│   │   └── useFileUpload.js
│   │
│   ├── layouts/
│   │   ├── StudentLayout.jsx
│   │   │   ├── AuthenticatedNavbar
│   │   │   ├── Sidebar
│   │   │   ├── Main Content (Outlet)
│   │   │   └── Footer
│   │   │
│   │   ├── FacultyLayout.jsx
│   │   │   ├── Navbar
│   │   │   ├── Sidebar
│   │   │   ├── Main Content (Outlet)
│   │   │   └── Footer
│   │   │
│   │   └── AdminLayout.jsx
│   │       ├── Navbar
│   │       ├── Sidebar
│   │       ├── Main Content (Outlet)
│   │       └── Footer
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LandingPage.css
│   │   │   ├── SiteNavbar
│   │   │   ├── Hero Section
│   │   │   │   ├── Title
│   │   │   │   ├── Subtitle
│   │   │   │   ├── Get Started Button
│   │   │   │   └── Hero Image
│   │   │   ├── LoginModal
│   │   │   └── SiteFooter
│   │   │
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── BatchesPage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── FacultyPage.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   └── SubjectsPage.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AssignmentsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SubjectsPage.jsx
│   │   │
│   │   └── student/
│   │       ├── HomePage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── AssignmentsPage.jsx
│   │       ├── AssignmentDetailPage.jsx
│   │       └── ProfilePage.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   │   ├── Landing Route (/)
│   │   │   ├── Login Route (/login)
│   │   │   ├── Student Routes (/student)
│   │   │   │   ├── Student Home (index)
│   │   │   │   ├── /student/dashboard
│   │   │   │   ├── /student/assignments
│   │   │   │   ├── /student/assignments/:id
│   │   │   │   └── /student/profile
│   │   │   ├── Faculty Routes (/faculty)
│   │   │   │   ├── Faculty Home (index)
│   │   │   │   ├── /faculty/subjects
│   │   │   │   ├── /faculty/assignments
│   │   │   │   ├── /faculty/analytics
│   │   │   │   └── /faculty/profile
│   │   │   └── Admin Routes (/admin)
│   │   │       ├── Admin Dashboard (index)
│   │   │       ├── /admin/dashboard
│   │   │       ├── /admin/batches
│   │   │       ├── /admin/courses
│   │   │       ├── /admin/subjects
│   │   │       ├── /admin/students
│   │   │       └── /admin/faculty
│   │   │
│   │   ├── ProtectedRoute.jsx
│   │   │   └── (Checks authentication)
│   │   │
│   │   └── RoleBasedRoute.jsx
│   │       └── (Checks user role)
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── axios.config.js
│   │   │   │   ├── API base URL configuration
│   │   │   │   ├── Request interceptor (add auth token)
│   │   │   │   └── Response interceptor (handle errors)
│   │   │   │
│   │   │   ├── authService.js
│   │   │   │   ├── login() - with mock for 's/s'
│   │   │   │   ├── register()
│   │   │   │   ├── logout()
│   │   │   │   └── getCurrentUser()
│   │   │   │
│   │   │   ├── userService.js
│   │   │   ├── academicService.js
│   │   │   ├── assignmentService.js
│   │   │   └── fileService.js
│   │   │
│   │   └── storage/
│   │       └── tokenService.js
│   │           ├── getToken()
│   │           ├── setToken()
│   │           └── removeToken()
│   │
│   └── utils/
│       ├── constants.js
│       ├── dateFormatter.js
│       └── fileValidator.js
│
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
