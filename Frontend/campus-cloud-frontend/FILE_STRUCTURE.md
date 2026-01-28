campus-cloud-frontend/
├── public/
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
│   │   ├── react.svg
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginModal.jsx
│   │   │   └── LoginModal.css
│   │   │
│   │   ├── common/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.css
│   │   │   ├── SiteFooter.jsx
│   │   │   ├── SiteNavbar.jsx
│   │   │   ├── SiteNavbar.css
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
│   │       ├── AssignmentStatusCard.jsx
│   │       ├── AssignmentStatusSummary.jsx
│   │       ├── Dashboard.css
│   │       ├── DashboardHeader.jsx
│   │       ├── NotificationDropdown.jsx
│   │       ├── NotificationDropdown.css
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
│   │   ├── AdminLayout.jsx
│   │   ├── FacultyLayout.jsx
│   │   └── StudentLayout.jsx
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LandingPage.css
│   │   │
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── BatchesPage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FacultyPage.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   └── SubjectsPage.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AssignmentsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SubjectsPage.jsx
│   │   │
│   │   └── student/
│   │       ├── AssignmentDetailPage.jsx
│   │       ├── AssignmentsPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── HomePage.jsx
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
│   │   │   ├── academicService.js
│   │   │   ├── assignmentService.js
│   │   │   ├── authService.js
│   │   │   │   ├── login() - with mock for 's/s'
│   │   │   │   ├── register()
│   │   │   │   ├── logout()
│   │   │   │   └── getCurrentUser()
│   │   │   ├── axios.config.js
│   │   │   │   ├── API base URL configuration
│   │   │   │   ├── Request interceptor (add auth token)
│   │   │   │   └── Response interceptor (handle errors)
│   │   │   ├── fileService.js
│   │   │   └── userService.js
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
├── eslint.config.js
├── FILE_STRUCTURE.md
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
├── vite.config.js
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
