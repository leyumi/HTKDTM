import Dashboard from "./Pages/Dashboard/Dashboard";
import Course from "./Pages/Course/Course";
import Document from "./Pages/Document/Document";
import FindWork from "./Pages/FindWork/FindWork";
import Profile from "./Pages/Profile/Profile";
import Schedule from "./Pages/Schedule/Schedule";
import Login from "./Pages/Login/Login";
import Setting from "./Pages/Setting/Setting";
import Chatbot from "./Pages/Chatbot/Chatbot";

const routes = [
  { path: "/login", component: <Login />, layout: null }, // Không có layout
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/course", component: <Course /> },
  { path: "/document", component: <Document /> },
  { path: "/findwork", component: <FindWork /> },
  { path: "/profile", component: <Profile /> },
  { path: "/chatbot", component: <Chatbot /> },
  { path: "/schedule", component: <Schedule /> },
  { path: "/setting", component: <Setting /> },
];

export default routes;
