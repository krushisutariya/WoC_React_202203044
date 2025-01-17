import { PiCodeDuotone } from "react-icons/pi";
import { FaPenFancy } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoTerminal } from "react-icons/io5";
import { MdMarkUnreadChatAlt } from "react-icons/md";
const features = [
    {
      title: "Run Any Programming Language",
      description: "Seamlessly execute code in over 30+ languages with blazing-fast performance.",
      icon: <PiCodeDuotone />,
    },
    {
      title: "Multiple Themes",
      description: "Choose from vibrant themes to create your perfect coding atmosphere.",
      icon: <FaPenFancy />,
    },
    {
      title: "Advanced Code Editor",
      description: "Enjoy intelligent bracket matching, code wrapping, and customizable settings.",
      icon: <FaRegPlayCircle />,
    },
    {
      title: "Flexible Input Options",
      description: "Upload files, drag and drop, or manually input text with ease.",
      icon: <FaCloudUploadAlt />,
    },
    {
      title: "Customizable Workspace",
      description: "Organize your IDE with resizable file menu, terminal, and editor sections.",
      icon: <IoMdSettings />,
    },
    {
      title: "Enhanced Search Tools",
      description: "Use advanced search, find, and replace to navigate your code effortlessly.",
      icon: <FaSearch />,
    },
    {
      title: "Guest & Authenticated Access",
      description: "Explore as a guest or unlock premium features as an authenticated user.",
      icon: <IoPerson />,
    },
    {
      title: "Integrated Terminal",
      description: "Run commands and debug your code seamlessly within the browser.",
      icon: <IoTerminal />,
    },
    {
      title: "AI Chatbot Support",
      description: "Chat with an AI-powered assistant to resolve your coding doubts instantly.",
      icon: <MdMarkUnreadChatAlt />,
    },
  ];
  
  export default features;
  