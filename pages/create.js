import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion"; // React accordion
import { useState } from "react"; // State handling
import Datetime from "react-datetime"; // Datetime component
import Layout from "components/layout"; // Layout wrapper
import Navigation from "components/navigation"; // Navigation bar

// Initial global settings
const defaultGlobalSettings = {
  num_voters: 10,
  credits_per_voter: 5,
  event_start_date: new Date(),
  // Tomorrow's date
  event_end_date: new Date().setDate(new Date().getDate() + 1),
};

// Initial empty subject
const defaultCurrentSubject = {
  title: "",
  description: "",
  url: "",
};

export default function Create() {
  // Global settings object
  const [globalSettings, setGlobalSettings] = useState(defaultGlobalSettings);
  // Current subject object
  const [currentSubject, setCurrentSubject] = useState(defaultCurrentSubject);
  // Array of all subjects
  const [subjects, setSubjects] = useState([]);

  /**
   * Sets the number of voters (between 1 - 250)
   * @param {number} value number of voters
   */
  const setNumVoters = (value) => {
    setGlobalSettings({
      ...globalSettings, // Current settings
      num_voters: Math.max(1, Math.min(250, Number(Math.round(value)))), // Number between 1 - 250 and not decimal
    });
  };

  /**
   * Sets the number of voting credits per voter (min. 1)
   * @param {number} value number of voting credits
   */
  const setCreditsPerVoter = (value) => {
    setGlobalSettings({
      ...globalSettings, // Current settings
      credits_per_voter: Math.max(1, Number(Math.round(value))), // Number above 1 and not decimal
    });
  };

  /**
   * Sets event start/end date
   * @param {string} type name of object date key
   * @param {object} value moment date object
   */
  const setEventDate = (type, value) => {
    setGlobalSettings({
      ...globalSettings,
      [type]: value,
    });
  };

  /**
   * Updates subject object with input field information
   * @param {string} field object key
   * @param {string} value input field value
   */
  const setSubjectData = (field, value) => {
    setCurrentSubject({
      ...currentSubject,
      [field]: value,
    });
  };

  /**
   * Submits subject to array
   */
  const submitSubject = () => {
    // Push subject to subjects array
    setSubjects((oldSubjects) => [...oldSubjects, currentSubject]);
    // Clear current subject by resetting to default
    setCurrentSubject(defaultCurrentSubject);
  };

  /**
   * Edits item with x index by setting it to current and deleting from subjects[]
   * @param {number} index array index of item to edit
   */
  const editSubject = (index) => {
    // Set current subject to to-be-edited item
    setCurrentSubject(subjects[index]);
    // Delete to-be-edited item from subjects array
    deleteSubject(index);
  };

  /**
   * Deletes item with x index by filtering it out of subjects[]
   * @param {number} index array index of item to delete
   */
  const deleteSubject = (index) => {
    // Filter array for all items that are not subjects[index]
    setSubjects(subjects.filter((item, i) => i !== index));
  };

  return (
    <Layout>
      {/* Navigation header */}
      <Navigation
        history={{
          title: "Home",
          link: "/",
        }}
        title="Create Event"
      />

      {/* Create page */}
      <div className="create">
        {/* Create page heading */}
        <div className="create__content">
          <h1>Create a new event</h1>
          <p>
            To create an event, simply fill out the event settings, add your
            voteable subjects, and we will generate you quicklinks that you can
            share with your audience.
          </p>
        </div>

        {/* Global settings */}
        <div className="create__settings">
          {/* Global settings header */}
          <h2>Global Settings</h2>
          <p>
            These settings are used to generate your audience's individual
            participation links. You can select the number of voters, how many
            votes credits they'll each receive, and a start and end date for
            voting.
          </p>

          {/* Number of voters selection */}
          <div className="create__settings_section">
            <label htmlFor="num_voters">Number of voters</label>
            <p>How many voting links would you like to generate? (Max: 250)</p>
            <input
              type="number"
              id="num_voters"
              value={globalSettings.num_voters}
              onChange={(e) => setNumVoters(e.target.value)}
            />
          </div>

          {/* Number of credits per voter selection */}
          <div className="create__settings_section">
            <label htmlFor="credits_per_voter">Vote credits per voter</label>
            <p>How many votes will each voter receive?</p>
            <input
              type="number"
              max="100"
              min="1"
              step="1"
              id="credits_per_voter"
              value={globalSettings.credits_per_voter}
              onChange={(e) => setCreditsPerVoter(e.target.value)}
            />
          </div>

          {/* Event start date selection */}
          <div className="create__settings_section">
            <label>Event start date</label>
            <p>When would you like to begin polling?</p>
            <Datetime
              className="create__settings_datetime"
              value={globalSettings.event_start_date}
              onChange={(value) => setEventDate("event_start_date", value)}
            />
          </div>

          {/* Event end date selection */}
          <div className="create__settings_section">
            <label>Event end date</label>
            <p>When would you like polling to close?</p>
            <Datetime
              className="create__settings_datetime"
              value={globalSettings.event_end_date}
              onChange={(value) => setEventDate("event_end_date", value)}
            />
          </div>
        </div>

        {/* Subject settings */}
        <div className="create__settings">
          {/* Subject settings heading */}
          <h2>Voteable Subjects</h2>
          <p>
            These settings enable you to add subjects that voters can delegate
            their voting credits to. You can choose to add a subject title,
            description, and a link to more information.
          </p>

          {/* Listing of all subjects via accordion*/}
          <h3>Subjects</h3>
          <div className="create__settings_section">
            {subjects.length > 0 ? (
              // If subjects array contains at least one subject
              <Accordion>
                {subjects.map((subject, i) => {
                  // Render subjects in accordion
                  return (
                    <AccordionItem key={i}>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {subject.title}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        {subject.description !== "" ? (
                          // If subject has a description
                          <div className="accordion__value">
                            <label>Subject Description</label>
                            <textarea value={subject.description} disabled />
                          </div>
                        ) : null}
                        {subject.url !== "" ? (
                          // If subject has a URL
                          <div className="accordion__value">
                            <label>Link</label>
                            <a
                              href={subject.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subject.url}
                            </a>
                          </div>
                        ) : null}
                        <div className="accordion__buttons">
                          <button onClick={() => editSubject(i)}>
                            Edit Subject
                          </button>
                          <button onClick={() => deleteSubject(i)}>
                            Delete Subject
                          </button>
                        </div>
                      </AccordionItemPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              // Else, if no subjects in subjects array
              <span className="empty__subjects">No subjects added</span>
            )}
          </div>

          {/* Form to add subjects */}
          <h3>Add Subjects</h3>
          <div className="create__settings_section">
            {/* Subject addition form */}
            <div className="create__subject_form">
              {/* Add subject tile */}
              <div>
                <label>Subject Title</label>
                <input
                  type="text"
                  placeholder="Vote #1"
                  value={currentSubject.title}
                  onChange={(e) => setSubjectData("title", e.target.value)}
                />
              </div>

              {/* Add subject description */}
              <div>
                <label>Subject Description</label>
                <textarea
                  placeholder="Description of the subject."
                  value={currentSubject.description}
                  onChange={(e) =>
                    setSubjectData("description", e.target.value)
                  }
                />
              </div>

              {/* Add subject link */}
              <div>
                <label>Subject Link</label>
                <input
                  type="text"
                  placeholder="www.council.org/vote_info/1"
                  value={currentSubject.url}
                  onChange={(e) => setSubjectData("url", e.target.value)}
                />
              </div>

              {currentSubject.title !== "" ? (
                // If form has title filled, allow submission
                <button onClick={submitSubject}>Create Subject</button>
              ) : (
                // Else, show disabled state
                <button className="button__disabled" disabled>
                  Enter Title
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submit event creation */}
        <div className="create__submission">
          {subjects.length > 0 ? (
            // If subjects have been provided, enable event creation
            <button className="create__event_button">Create Event</button>
          ) : (
            // Else, prompt to add subject via disabled state
            <button className="create__event_disabled" disabled>
              Add at least one subject
            </button>
          )}
        </div>
      </div>

      {/* Global styling */}
      <style jsx global>{`
        .create__settings_section > input,
        .create__settings_datetime > input {
          width: calc(100% - 10px);
          font-size: 26px !important;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          margin-top: 15px;
          padding: 5px 0px 5px 5px;
        }

        .accordion__button {
          background-color: #e7eaf3;
          max-width: calc(100% - 36px);
        }

        .accordion__button:hover {
          background-color: #dde1ee;
        }

        .accordion__value {
          margin: 0px 0px 10px 0px;
          width: 100%;
        }

        .accordion__value > label {
          display: block;
          color: #587299;
          font-weight: bold;
          font-size: 18px;
          text-transform: uppercase;
        }

        .accordion__value > textarea {
          width: calc(100% - 10px);
          max-width: calc(100% - 10px);
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          margin-top: 5px;
          padding: 8px 5px;
          font-family: "Roboto", sans-serif;
        }

        .accordion__value > a {
          text-decoration: none;
          color: #0f0857;
          transition: 50ms ease-in-out;
          font-size: 18px;
          display: inline-block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .accordion__value > a:hover {
          opacity: 0.8;
        }

        .accordion__buttons {
          text-align: center;
          padding-top: 10px;
        }

        .accordion__buttons > button {
          padding: 8px 15px;
          display: inline-block;
          border-radius: 5px;
          background-color: #0f0857;
          color: #fff;
          font-size: 16px;
          transition: 100ms ease-in-out;
          border: none;
          cursor: pointer;
          margin: 0px 10px;
        }

        .accordion__buttons > button:nth-child(2) {
          background-color: #ff1c48;
        }

        .accordion__buttons > button:hover {
          opacity: 0.8;
        }

        div:focus,
        button:focus {
          outline: none;
        }
      `}</style>

      {/* Scoped styling */}
      <style jsx>{`
        .create {
          padding-bottom: 80px;
        }

        .create__content {
          max-width: 700px;
          padding: 30px 20px 0px 20px;
          margin: 0px auto;
        }

        .create__content > h1 {
          font-size: 35px;
          color: #0f0857;
          margin: 0px;
        }

        .create__content > p,
        .create__settings > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin-block-start: 10px;
        }

        .create__settings {
          text-align: left;
          width: calc(100% - 40px);
          max-width: 660px;
          padding: 20px 20px;
          margin: 0px auto;
        }

        .create__settings > h2 {
          color: #0f0857;
          margin-block-end: 0px;
        }

        .create__settings > h3 {
          color: #0f0857;
          transform: translate(5px, 15px);
        }

        .create__settings > p {
          margin-block-start: 5px;
        }

        .create__settings_section {
          background-color: #fff;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e7eaf3;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          padding: 15px;
          width: calc(100% - 30px);
          margin: 25px 0px;
        }

        .create__settings_section > label,
        .create__subject_form > div > label {
          display: block;
          color: #587299;
          font-weight: bold;
          font-size: 18px;
          text-transform: uppercase;
        }

        .create__settings_section > p {
          margin: 0px;
        }

        .create__subject_form > div {
          margin: 20px 0px;
        }

        .create__subject_form > div:nth-child(1) {
          margin-top: 0px;
        }

        .create__subject_form > div > input,
        .create__subject_form > div > textarea {
          width: calc(100% - 10px);
          max-width: calc(100% - 10px);
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          margin-top: 5px;
          padding: 8px 5px;
          font-family: "Roboto", sans-serif;
        }

        .create__subject_form > button,
        .create__event_button,
        .create__event_disabled {
          padding: 12px 0px;
          width: 100%;
          display: inline-block;
          border-radius: 5px;
          background-color: #0f0857;
          color: #fff;
          font-size: 18px;
          transition: 100ms ease-in-out;
          border: none;
          cursor: pointer;
        }

        .button__disabled,
        .create__event_disabled {
          background-color: #e7eaf3 !important;
          color: #000 !important;
          cursor: not-allowed !important;
        }

        .button__disabled:hover,
        .create__event_disabled:hover {
          opacity: 1 !important;
        }

        .create__subject_form > button:hover {
          opacity: 0.8;
        }

        .empty__subjects {
          color: #587299;
          display: block;
          text-align: center;
        }

        .create__submission {
          margin: 0px auto;
          max-width: 660px;
          padding: 50px 20px;
        }
      `}</style>
    </Layout>
  );
}
