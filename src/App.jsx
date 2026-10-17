import { useState } from "react";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [showRecommendations, setShowRecommendations] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [recommendationLoading, setRecommendationLoading] =
    useState(false);

  const [courseLoading, setCourseLoading] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD INTERESTS
  // ==========================================

  const loadInterests = async () => {
    setStarted(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ai-career-guidance-backend-dsg3.onrender.com/api/interests"
      );

      if (!response.ok) {
        throw new Error("Failed to load interests");
      }

      const data = await response.json();

      let interestList = [];

      if (Array.isArray(data)) {
        interestList = data;
      } else if (Array.isArray(data.value)) {
        interestList = data.value;
      }

      if (interestList.length === 0) {
        setError("No interests found.");
        setInterests([]);
        return;
      }

      setInterests(interestList);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure Spring Boot is running."
      );

      setInterests([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT INTEREST
  // ==========================================

  const toggleInterest = (interestId) => {
    setSelectedInterests((current) => {
      if (current.includes(interestId)) {
        return current.filter(
          (id) => id !== interestId
        );
      }

      return [...current, interestId];
    });
  };

  // ==========================================
  // GET RECOMMENDATIONS
  // ==========================================

  const getRecommendations = async () => {
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    setRecommendationLoading(true);
    setError("");

    try {
      const query = selectedInterests
        .map(
          (id) =>
            `interestIds=${encodeURIComponent(id)}`
        )
        .join("&");

      const response = await fetch(
        `https://ai-career-guidance-backend-dsg3.onrender.com/api/recommendations?${query}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load recommendations"
        );
      }

      const data = await response.json();

      setRecommendations(
        Array.isArray(data) ? data : []
      );

      setShowRecommendations(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load course recommendations."
      );
    } finally {
      setRecommendationLoading(false);
    }
  };

  // ==========================================
  // LOAD COURSE DETAILS
  // ==========================================

  const viewCourseDetails = async (courseId) => {
    setCourseLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://ai-career-guidance-backend-dsg3.onrender.com/api/courses/${courseId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load course details"
        );
      }

      const data = await response.json();

      console.log("Course details:", data);

      setSelectedCourse(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load course details. Make sure Spring Boot is running."
      );
    } finally {
      setCourseLoading(false);
    }
  };

  // ==========================================
  // HOME PAGE
  // ==========================================

  if (!started) {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            AI Career Guidance
          </div>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#courses">Courses</a>
            <a href="#careers">Careers</a>
            <a href="#about">About</a>
          </div>

        </nav>

        <main id="home" className="hero">

          <div className="hero-content">

            <p className="tagline">
              SMARTER CAREER DECISIONS
            </p>

            <h1>
              Discover the
              <span> right career </span>
              for you.
            </h1>

            <p className="hero-text">
              Explore your interests, discover suitable
              courses, understand career opportunities
              and build a roadmap for your future.
            </p>

            <button
              className="primary-button"
              onClick={loadInterests}
            >
              Get Started
            </button>

          </div>

          <div className="hero-card">

            <div className="card-icon">
              ðŸŽ¯
            </div>

            <h2>
              Find Your Direction
            </h2>

            <p>
              Your interests can guide you toward
              the right education and career path.
            </p>

          </div>

        </main>

        <section
          id="courses"
          className="features"
        >

          <h2>
            What You Can Discover
          </h2>

          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                ðŸ§ 
              </div>

              <h3>
                Interest Based Guidance
              </h3>

              <p>
                Select your interests and receive
                course recommendations that match
                your goals.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ðŸŽ“
              </div>

              <h3>
                Course Information
              </h3>

              <p>
                Understand course details, required
                skills, study environment and
                future scope.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ðŸ’¼
              </div>

              <h3>
                Career Opportunities
              </h3>

              <p>
                Explore career roles and the skills
                needed to prepare for them.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ðŸ—ºï¸
              </div>

              <h3>
                Career Roadmap
              </h3>

              <p>
                Follow a year-by-year learning roadmap
                throughout your course.
              </p>

            </div>

          </div>

        </section>

        <footer id="about">

          <p>
            AI Career Guidance
          </p>

          <span>
            Helping students make informed career decisions.
          </span>

        </footer>

      </div>
    );
  }

  // ==========================================
  // COURSE DETAILS PAGE
  // ==========================================

  if (selectedCourse) {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            AI Career Guidance
          </div>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#courses">Courses</a>
            <a href="#careers">Careers</a>
            <a href="#about">About</a>
          </div>

        </nav>

        <main className="course-details-page">

          <button
            className="secondary-button"
            onClick={() =>
              setSelectedCourse(null)
            }
          >
            â† Back to Recommendations
          </button>

          <div className="course-details-header">

            <p className="tagline">
              COURSE DETAILS
            </p>

            <h1>
              {selectedCourse.name}
            </h1>

            <p>
              {selectedCourse.description}
            </p>

          </div>

          <div className="course-details-grid">

            <div className="detail-card">

              <h3>
                â± Duration
              </h3>

              <p>
                {selectedCourse.duration ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸŽ“ Eligibility
              </h3>

              <p>
                {selectedCourse.eligibility ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸ§  Skills Required
              </h3>

              <p>
                {selectedCourse.skillsRequired ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸš€ Future Scope
              </h3>

              <p>
                {selectedCourse.futureScope ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸ’¡ Why Is This Course Useful?
              </h3>

              <p>
                {selectedCourse.whyUseful ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸŒ Society Impact
              </h3>

              <p>
                {selectedCourse.societyImpact ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸ“š Study Environment
              </h3>

              <p>
                {selectedCourse.studyEnvironment ||
                  "Information not available"}
              </p>

            </div>

            <div className="detail-card">

              <h3>
                ðŸ’¼ Work Environment
              </h3>

              <p>
                {selectedCourse.workEnvironment ||
                  "Information not available"}
              </p>

            </div>

          </div>

        </main>

        <footer id="about">

          <p>
            AI Career Guidance
          </p>

          <span>
            Helping students make informed career decisions.
          </span>

        </footer>

      </div>
    );
  }

  // ==========================================
  // INTEREST / RECOMMENDATION PAGE
  // ==========================================

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          AI Career Guidance
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#careers">Careers</a>
          <a href="#about">About</a>
        </div>

      </nav>

      <main className="interest-page">

        {!showRecommendations ? (

          <>
            <div className="interest-header">

              <p className="tagline">
                STEP 1
              </p>

              <h1>
                What are you interested in?
              </h1>

              <p>
                Select the areas you enjoy.
                We'll use them to recommend
                suitable courses.
              </p>

            </div>

            {loading && (
              <div className="loading">
                Loading interests...
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              interests.length > 0 && (

                <>

                  <div className="interest-grid">

                    {interests.map(
                      (interest) => {

                        const isSelected =
                          selectedInterests.includes(
                            interest.id
                          );

                        return (
                          <button
                            type="button"
                            className={`interest-card ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                            key={interest.id}
                            onClick={() =>
                              toggleInterest(
                                interest.id
                              )
                            }
                          >

                            <span>
                              {interest.name}
                            </span>

                            {isSelected && (
                              <span className="check-mark">
                                âœ“
                              </span>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>

                  <div className="selection-area">

                    <p>
                      Selected:{" "}
                      <strong>
                        {selectedInterests.length}
                      </strong>
                    </p>

                    <button
                      type="button"
                      className="primary-button"
                      disabled={
                        selectedInterests.length === 0 ||
                        recommendationLoading
                      }
                      onClick={
                        getRecommendations
                      }
                    >
                      {recommendationLoading
                        ? "Finding Courses..."
                        : "Get Recommendations"}
                    </button>

                  </div>

                </>
              )}

            {!loading &&
              !error &&
              interests.length === 0 && (

                <div className="no-results">

                  <h2>
                    No interests found
                  </h2>

                  <button
                    className="primary-button"
                    onClick={loadInterests}
                  >
                    Try Again
                  </button>

                </div>
              )}

          </>

        ) : (

          <section className="recommendations-section">

            <div className="interest-header">

              <p className="tagline">
                STEP 2
              </p>

              <h1>
                Recommended Courses
              </h1>

              <p>
                Based on your selected interests,
                here are the courses that match
                your profile.
              </p>

            </div>

            {recommendations.length === 0 ? (

              <div className="no-results">

                <h2>
                  No matching courses found
                </h2>

                <p>
                  Try selecting some different interests.
                </p>

                <button
                  className="primary-button"
                  onClick={() => {
                    setShowRecommendations(false);
                    setError("");
                  }}
                >
                  Choose Interests Again
                </button>

              </div>

            ) : (

              <>
                <div className="recommendation-grid">

                  {recommendations.map(
                    (course) => (

                      <div
                        className="recommendation-card"
                        key={course.courseId}
                      >

                        <div className="match-badge">
                          {course.matchPercentage}% Match
                        </div>

                        <h2>
                          {course.courseName}
                        </h2>

                        <p className="course-description">
                          {course.description}
                        </p>

                        <div className="matched-interests">

                          <h4>
                            Matched Interests
                          </h4>

                          <div className="interest-tags">

                            {Array.isArray(
                              course.matchedInterests
                            ) &&
                              course.matchedInterests.map(
                                (
                                  interest,
                                  index
                                ) => (
                                  <span
                                    key={index}
                                  >
                                    {interest}
                                  </span>
                                )
                              )}

                          </div>

                        </div>

                        <button
                          type="button"
                          className="primary-button details-button"
                          onClick={() =>
                            viewCourseDetails(
                              course.courseId
                            )
                          }
                          disabled={courseLoading}
                        >
                          {courseLoading
                            ? "Loading..."
                            : "View Course Details"}
                        </button>

                      </div>
                    )
                  )}

                </div>

                <div className="recommendation-actions">

                  <button
                    className="secondary-button"
                    onClick={() => {
                      setShowRecommendations(false);
                      setRecommendations([]);
                      setError("");
                    }}
                  >
                    â† Change Interests
                  </button>

                </div>

              </>
            )}

          </section>
        )}

      </main>

      <footer id="about">

        <p>
          AI Career Guidance
        </p>

        <span>
          Helping students make informed career decisions.
        </span>

      </footer>

    </div>
  );
}

export default App;
