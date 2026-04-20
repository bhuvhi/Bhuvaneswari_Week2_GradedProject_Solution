import mongoose from "mongoose";
import User from "./models/User.js";
import Question from "./models/Question.js";
import Answer from "./models/Answer.js";
import dotenv from "dotenv";

async function query1() {
  const newUser = await User.create({
    name: "Robin",
    email: "robin@example.com",
    password: "hashed_password_7",
    createdAt: new Date("2025-06-25T10:15:00Z"),
  });

  console.log("Created User:", newUser);
}

async function query2() {
  const fetchedUser = await User.findOne({ email: "alice@example.com" });
  console.log("Fetched User:", fetchedUser);
}

async function query3() {
  const fetchedQuestion = await Question.findOne({
    title: "How can I improve the performance of a react app?",
  });
  console.log("Fetched Question:", fetchedQuestion);
}

async function query4() {
  const questionsWithJavascriptTag = await Question.find({ tags: "javascript" });
  console.log("Questions tagged with 'javascript':", questionsWithJavascriptTag);
}

async function query5() {
  const questionsAfterApril2023 = await Question.find({
    createdAt: { $gt: new Date("2023-04-01T00:00:00Z") },
  });
  console.log("Questions posted after April 1, 2023:", questionsAfterApril2023);
}

async function query6() {
  const questionsWithJavascriptOrReact = await Question.find({
    tags: { $in: ["javascript", "react"] },
  });
  console.log(
    "Questions tagged with 'javascript' or 'react':",
    questionsWithJavascriptOrReact
  );
}

async function query7() {
  const distinctTags = await Question.distinct("tags");
  console.log("Distinct tags used in questions:", distinctTags);
}

async function query8() {
  const questionsWithMin50Views = await Question.find({ views: { $gte: 50 } });
  console.log("Questions with at least 50 views:", questionsWithMin50Views);
}

async function query9() {
  const noVoteAnswers = await Answer.find({ voteCount: 0 });
  console.log("Answers with a vote count of 0:", noVoteAnswers);
}

async function query10() {
  const votedAnswers = await Answer.find({ voteCount: { $gt : 0 }});
  console.log("Answers with a voteCount greater than 0:", votedAnswers);
}

async function query11() {
  const fetchedUsers = await User.find({
    createdAt: {
      $gte: new Date("2023-01-01T00:00:00Z"),
      $lt: new Date("2023-05-01T00:00:00Z"),
    }
  });
  console.log("Users created between January 1, 2023 and May 1, 2023:", fetchedUsers);
}

async function query12() {
  const question = await Question.findOne({ title: "How do I set up routing with react router v6?" });
  const answer = await Answer.find({ questionId: question._id }).select('answerText author -_id');
  console.log("Answers for the question:", answer);
}

async function query13() {
  const usersWithAnswers = await Answer.distinct("author");
  const usersWithoutAnswers = await User.find({ _id: { $nin: usersWithAnswers } });
  console.log("Users who have not posted any answers:", usersWithoutAnswers);
}

async function query14() {
  const topTwoQuestions = await Question.find()
    .sort({ voteCount: -1 })
    .limit(2);
  console.log("Top two most upvoted questions:", topTwoQuestions);
}

async function query15() {
  const usersWithAnswerCounts = await Answer.aggregate([
    {
      $group: {
        _id: "$author",
        answerCount: { $sum: 1 }
      }
    }
  ]);
  console.log("Users who have posted answers with their answer counts:", usersWithAnswerCounts);
}

async function query16() {
  const topTwoUsers = await Answer.aggregate([
    {
      $group: {
        _id: "$author",
        answerCount: { $sum: 1 }
      }
    },
    {
      $sort: { answerCount: -1 }
    },
    {
      $limit: 2
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        name: "$userInfo.name"
      }
    }
  ]);
  console.log("Top two users who posted the most answers:", topTwoUsers);
}

async function query17() {
  let fetchQuestion = await Question.findOne({ title: "Why is my async function returning a promise instead of the actual value?"});
  await fetchQuestion.updateOne({ $set: { tags: ['javascript', 'async'] } }, { new: true });
  fetchQuestion = await Question.findOne({ title: "Why is my async function returning a promise instead of the actual value?"});
  console.log("Updated Question:", fetchQuestion);
}

async function query18() {
  const updatedUser = await User.findOneAndUpdate(
    { email: "alice@example.com" },
    { name: "Alice Smith" },
    { new: true }
  );
  console.log("Updated User:", updatedUser);
}

async function query19() {
  const deletedUser = await User.findOneAndDelete({ email: 'jhonny@example.com' });
  console.log("Deleted User:", deletedUser);
}

async function query20() {
  const user = await User.findOne({ email: 'alice@example.com' });
  const deletedAnswers = await Answer.deleteMany({ author: user._id });
  console.log("Deleted Answers:", deletedAnswers);
}

async function runQueries() {
  printHeader(
    1,
    "Create a user with name Robin, email robin@example.com, password hashed_password_7, and createdAt set to 2025-06-25T10:15:00Z",
  );
  await query1();
  printHeader(2, 
  "Fetch the user with email alice@example.com");
  await query2();
  printHeader(
    3,
    'Fetch question with the title "How can I improve the performance of a react app?"',
  );
  await query3();
  printHeader(4, 'Find all questions tagged with "javascript"');
  await query4();
  printHeader(5, "Retrieve all questions posted after April 1, 2023");
  await query5();
  printHeader(6, "Find all questions tagged with javascript or react");
  await query6();
  printHeader(7, "Find all the distinct tags used in questions");
  await query7(); 
  printHeader(8, "Retrieve all questions with at least 50 views");
  await query8();
  printHeader(9, "List all answers with a vote count of 0");
  await query9();
  printHeader(10, "Retrieve all answers with a voteCount greater than 0");
  await query10();
  printHeader(
    11,
    "Retrieve all users whose account was created between January 1, 2023 (inclusive) and May 1, 2023 (exclusive)",
  );
  await query11();
  printHeader(
    12,
    'Fetch the answer text and author id of all answers for the question "How do I set up routing with react router v6?"',
  );
  await query12();
  printHeader(13, "Find all users who have not posted any answers");
  await query13();
  printHeader(14, "Find the top two most upvoted questions");
  await query14();
  printHeader(
    15,
    "Retrieve the ids of all users who have posted answers, along with the number of answers they have posted",
  );
  await query15();
  printHeader(16, "Identify the top two users who posted the most answers");
  await query16();
  printHeader(
    17,
    "Update the tags of the question 'Why is my async function returning a promise instead of the actual value?' to ['javascript', 'async']",
  );
  await query17();
  printHeader(
    18,
    "Update the name of the user with email 'alice@example.com' to 'Alice Smith'",
  );
  await query18();
  printHeader(19, "Delete the user with email 'jhonny@example.com'");
  await query19();
  printHeader(
    20,
    "Delete all answers of the user with email 'alice@example.com'",
  );
  await query20();
}

const printHeader = (num, title) => {
  console.log("\n" + "─".repeat(60));
  console.log(`Q${num}. ${title}`);
  console.log("─".repeat(60));
};

async function main() {
  try {
    dotenv.config();
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected successfully to database");
    await runQueries();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

main();
