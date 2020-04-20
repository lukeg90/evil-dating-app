import React from "react";

export default function Faq() {
    return (
        <div>
            <h1>Frequently Asked Questions</h1>
            <br />
            <h2 className="question">Q: How are matches determined?</h2>
            <h2 className="answer">
                A: We match users based on many factors, including gender and
                interests. We also take current symptoms into account to ensure
                safe encounters.{" "}
            </h2>
            <br />
            <h2 className="question">
                Q: Why am I asked to provide my symptoms?
            </h2>
            <h2 className="answer">
                A: During a pandemic it's important to be transparent about our
                health with the people we meet, but we know that the last thing
                you want to discuss with a potential date is your symptoms.
                Gross! So we take care of the dirty work to spare you from
                awkward conversations.
            </h2>
            <br />
            <h2 className="question">
                Q: Does entering a symptom mean that I won't get any matches?
            </h2>
            <h2 className="answer">
                A: Not at all! Our matching algorithm was designed in
                consultation with top medical experts, who determined that
                people with the same benign symptoms can meet without any danger
                of spreading disease to each other. If our alogorithm determines
                that you are a likely carrier of COVID-19, you will simply be
                matched to someone else with the same symptoms. Sick people need
                love too!{" "}
            </h2>
            <br />
        </div>
    );
}
