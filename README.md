Hello! Welcome to the Advisor's Excel coding challenge. The goal of this exercise is to give us an idea of how you write code, and to see your communication style. When you complete with challenge, our team will review your code and if accepted, we will meet for an interview in which we will discuss your work and review with you.

## Current Codebase

First, make sure you can run the codebase as it currently exists. 

#### Prerequisites
- Docker
- Node version 18

Once you have both installed, you can run the database, front-end, and back-end however works best for you, though note that when we evaluate your work, we will simply pull down the project and run `docker compose up --build`, so make sure that works when sending your work in.

The existing codebase is a simple application that allows you to create, update, and remove todo list items, as well as mark them complete or incomplete. The front and back end are written in typescript.

The front end is written in React, and makes use of styled components and React hooks.
The back end is written in Express, and uses PG for handling database queries.
A database will also spin up when running the docker containers. To modify what is added to that database upon initialization, check the `init-db.sql` file.

## Part 1 (1-2 hours)

For part 1 of the coding challenge, we would like you to add the ability to create, update, complete, and remove child todos. You may do this however you think would be best to implement this feature, but be sure to look at the business requirements in the `part1story.pdf` and ensure you implement to that specification. Please complete this part of the challenge before moving onto part 2, and make sure to note the branch or commit hash that marks the end of part 1.

## Part 2 (1-2 hours)
For part 2 of the coding challenge, we would like you to get the backend as close to production ready as possible. We ask that you do what you can within a 1-2 hour time period.

## Questionnaire
After you finish both parts, please go through the questions in `questionnaire.md` and answer those as best you can. These questions will help us understand what you would do if you had more time to work on this, as well as get a few other answers that help us evaluate you as a candidate for this position.

## Questions
If you have any questions on this challenge, feel free to reach out to michael.hartung@advisorsexcel.com and he will get back to you within 24 hours. Any questions you have about the challenge are welcome.