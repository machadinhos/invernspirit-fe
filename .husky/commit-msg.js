/* eslint-disable */
const commitMessage = process.argv[2];
const commitMessageNoComments = commitMessage.replace(/#.*$/gm, '').trim();
const commitMessageLines = commitMessageNoComments.split('\n');

const SUGGESTED_FIRST_LINE_LENGTH = 50;
const MAX_BODY_LINE_LENGTH = 72;

const showErrorMessage = (reason) => {
  const text = `Invalid commit message format.${reason ? `\n\nReason: ${reason}\n` : '\n'}
Your commit message:
${commitMessageNoComments}

Expected format:
  type(scope): description

Valid types:
  • feat:     A new feature
  • fix:      A bug fix
  • docs:     Documentation only changes
  • style:    Changes that do not affect the meaning of the code
  • refactor: A code change that neither fixes a bug nor adds a feature
  • perf:     A code change that improves performance
  • test:     Adding missing tests or correcting existing tests
  • ci:       Changes to CI configuration files and scripts
  • chore:    Other changes that don't modify src or test files

Examples:
  feat: add user authentication
  fix(api): handle null response from server
  refactor: extract utility functions

Rules:
  • Type is required and must be lowercase
  • Scope is optional but must be in parentheses
  • Description must start with lowercase letter
  • Use present tense (add, not added)
  • Try toKeep the first line under ${SUGGESTED_FIRST_LINE_LENGTH} characters when possible
  • Keep every body line under ${MAX_BODY_LINE_LENGTH} characters
  • Always try to include a body

Learn more at Learn more: https://www.conventionalcommits.org`;
  console.log(text);
};

if (!commitMessageNoComments) {
  showErrorMessage('Commit message is empty');
  process.exit(1);
}

if (commitMessageLines.length === 2) {
  showErrorMessage("There's no empty line between message and body");
  process.exit(1);
}

if (!commitMessageLines[0].match(/^(feat|fix|docs|style|refactor|perf|test|ci|chore)(\(.+\))?:(\s.*)$/)) {
  showErrorMessage();
  process.exit(1);
}

const bodyLinesTooLong = commitMessageLines.filter((line) => line.length > MAX_BODY_LINE_LENGTH);
if (bodyLinesTooLong.length > 0) {
  showErrorMessage(`The following lines are too long\n${bodyLinesTooLong.join('\n')}`);
  process.exit(1);
}

if (commitMessageLines[0].length > SUGGESTED_FIRST_LINE_LENGTH) {
  console.log(
    `Your first line is ${commitMessageLines[0].length} characters long. It's recommended to keep it under ${SUGGESTED_FIRST_LINE_LENGTH} characters.`,
  );
}

if (commitMessageLines[0].match(/^(feat|fix|docs|style|refactor|perf|test|ci|chore):(\s.*)$/)) {
  console.log('Consider adding a scope to your commit message.');
}

if (commitMessageLines.length === 1) {
  console.log('Consider adding a body to your commit message.');
}
