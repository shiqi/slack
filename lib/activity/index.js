const router = require('./router');

const {
  matchMetaDataStatetoIssueMessage,
  issueEvent,
} = require('./issues');

const {
  pullRequestEvent,
  onStatus,
  storePRMapping,
} = require('./pull-requests');

const { deploymentStatus } = require('./deployments');
const { push } = require('./push');
const { publicEvent } = require('./public');
const comments = require('./comments');
const ref = require('./ref');
const review = require('./review');

module.exports = (robot) => {
  const route = router(robot);

  robot.on(['issues.opened', 'issues.closed', 'issues.reopened'], route(issueEvent));

  robot.on([
    'issues.labeled',
    'issues.unlabeled',
    'issues.assigned',
    'issues.unassigned',
    'issue_comment',
  ], route(matchMetaDataStatetoIssueMessage));

  robot.on(['pull_request.opened', 'pull_request.closed', 'pull_request.reopened'], route(pullRequestEvent));
  robot.on(['pull_request.opened', 'pull_request.synchronize'], storePRMapping);
  robot.on('status', route(onStatus));
  robot.on('deployment_status', route(deploymentStatus));
  robot.on('push', route(push));
  robot.on('public', route(publicEvent));

  robot.on('issue_comment', route(comments));

  robot.on(['create', 'delete'], route(ref));
  robot.on(['pull_request_review.submitted', 'pull_request_review.edited'], route(review));
};
