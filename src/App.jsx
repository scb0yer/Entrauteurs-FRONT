import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faQuoteLeft,
  faQuoteRight,
  faAngleLeft,
  faAngleRight,
  faBookmark,
  faStar,
  faStarHalf,
  faCircleExclamation,
  faPenNib,
  faImage,
  faCheck,
  faPause,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faQuoteLeft,
  faQuoteRight,
  faAngleLeft,
  faAngleRight,
  faBookmark,
  faStar,
  faStarHalf,
  faCircleExclamation,
  faPenNib,
  faImage,
  faCheck,
  faPause,
  faXmark
);
import Header from "../components/Header";
import HomePage from "../pages/HomePage";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import StoryPage from "../pages/StoryPage";
import ProfilPage from "../pages/ProfilPage";
import WriterPage from "../pages/WriterPage";
import StoryUpdate from "../components/StoryUpdate";
import PasswordPage from "../pages/PasswordPage";
import Review from "../components/Review";
import ConcoursPage from "../pages/ConcoursPage";
import StoriesPage from "../pages/StoriesPage";
import ConceptPage from "../pages/ConceptPage";
import Footer from "../components/Footer";
import CookiesPage from "../pages/CookiesPage";
import MentionsLegalesPage from "../pages/MentionsLegales";
import AdminPage from "../pages/AdminPage";
import Contestation from "../components/Contestation";
import StickersSelection from "../components/StickersSelection";

function App() {
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  const [writerId, setWriterId] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [isInExchange, setIsInExchange] = useState(false);
  const [storyToUpdate, setStoryToUpdate] = useState({});
  const [adult, setAdult] = useState(false);
  const [story_review, setStory_review] = useState();
  const [storiesRead, setStoriesRead] = useState(null);
  const [newStateHP, setNewStateHP] = useState(false);
  const [displaySignin, setDisplaySignin] = useState(false);
  const [displaySignup, setDisplaySignup] = useState(false);
  const [displayStoryUpdate, setDisplayStoryUpdate] = useState(false);
  const [displayReview, setDisplayReview] = useState(false);
  const [displayContestation, setDisplayContestation] = useState(false);
  const [displayStickersSelection, setDisplayStickersSelection] =
    useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Header
        displaySignin={displaySignin}
        displaySignup={displaySignup}
        displayStoryUpdate={displayStoryUpdate}
        displayReview={displayReview}
        displayContestation={displayContestation}
        displayStickersSelection={displayStickersSelection}
        token={token}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              token={token}
              storiesRead={storiesRead}
              setNewStateHP={setNewStateHP}
              newStateHP={newStateHP}
            />
          }
        />
        <Route
          path="/password"
          element={
            <PasswordPage
              setToken={setToken}
              setWriterId={setWriterId}
              token={token}
              setStoriesRead={setStoriesRead}
            />
          }
        />
        <Route
          path="/book/:id"
          element={
            <StoryPage
              token={token}
              storiesRead={storiesRead}
              setDisplaySignin={setDisplaySignin}
              writerId={writerId}
            />
          }
        />
        <Route
          path="/writer/:id"
          element={
            <WriterPage
              token={token}
              storiesRead={storiesRead}
              setDisplayStickersSelection={setDisplayStickersSelection}
              setRecipientId={setRecipientId}
              setDisplaySignin={setDisplaySignin}
            />
          }
        />
        <Route path="/concours" element={<ConcoursPage />} />
        <Route
          path="/admin"
          element={<AdminPage token={token} isAdmin={isAdmin} />}
        />
        <Route path="/concept" element={<ConceptPage />} />
        <Route
          path="/stories"
          element={<StoriesPage storiesRead={storiesRead} />}
        />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/mentionslegales" element={<MentionsLegalesPage />} />
        <Route
          path="/profil"
          element={
            <ProfilPage
              setToken={setToken}
              setAdult={setAdult}
              adult={adult}
              setStoryToUpdate={setStoryToUpdate}
              setStoriesRead={setStoriesRead}
              token={token}
              storiesRead={storiesRead}
              setDisplaySignin={setDisplaySignin}
              setDisplayStoryUpdate={setDisplayStoryUpdate}
              setDisplayReview={setDisplayReview}
              setDisplayContestation={setDisplayContestation}
              isInExchange={isInExchange}
              setIsInExchange={setIsInExchange}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              setStory_review={setStory_review}
            />
          }
        />
      </Routes>
      {displaySignin && (
        <Signin
          setToken={setToken}
          setStoriesRead={setStoriesRead}
          setNewStateHP={setNewStateHP}
          newStateHP={newStateHP}
          setDisplaySignin={setDisplaySignin}
          setDisplaySignup={setDisplaySignup}
          setWriterId={setWriterId}
          setIsAdmin={setIsAdmin}
        />
      )}
      {displaySignup && (
        <Signup
          token={token}
          setToken={setToken}
          setStoriesRead={setStoriesRead}
          setNewStateHP={setNewStateHP}
          newStateHP={newStateHP}
          setDisplaySignin={setDisplaySignin}
          setDisplaySignup={setDisplaySignup}
          setWriterId={setWriterId}
        />
      )}
      {displayStoryUpdate && (
        <StoryUpdate
          token={token}
          adult={adult}
          storyToUpdate={storyToUpdate}
          setStoryToUpdate={setStoryToUpdate}
          setDisplayStoryUpdate={setDisplayStoryUpdate}
          displayStoryUpdate={displayStoryUpdate}
        />
      )}
      {displayReview && (
        <Review
          token={token}
          setDisplayReview={setDisplayReview}
          displayReview={displayReview}
          setIsInExchange={setIsInExchange}
        />
      )}
      {displayContestation && (
        <Contestation
          token={token}
          setDisplayContestation={setDisplayContestation}
          story_review={story_review}
        />
      )}
      {displayStickersSelection && (
        <StickersSelection
          token={token}
          setDisplayStickersSelection={setDisplayStickersSelection}
          recipientId={recipientId}
        />
      )}
      <Footer />
    </Router>
  );
}

export default App;
