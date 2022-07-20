(() => {
  'use strict';

  async function changeMergeButtonState() {
    let container = document.querySelector('#js-repo-pjax-container');
    let issueTitle = container.querySelector('.js-issue-title').textContent;
    var waitASecond = function() {
      return new Promise(resolve => {
          setTimeout(function() {
          resolve("OK");
          }, 1000);
      });
    };
    while (document.querySelector('.status-meta') === null){
      await waitASecond();
    }
    let statusMeta = document.querySelector('.status-meta').textContent;
    let buttonMerges = container.querySelectorAll('.merge-message button[data-details-container]');
    let buttonMergeOptions = container.querySelectorAll('.merge-message button[data-details-container] + .select-menu-button');
    let disabled = false;
    let buttonHtml = '';

    chrome.runtime.sendMessage({from: 'content', subject: 'localStorage'}, function(response){
      if (!response) { return; }

      let localStorage = response.localStorage;
      const wipTitleRegex = /[\[(^](do\s*n[o']?t\s*merge|wip|dnm)[\]):]/i;
      const wipTagRegex = /(wip|do\s*not\s*merge|dnm)/i;
      const oneApproverText = 'At least 1 approving review is required';

      const isWipTitle = wipTitleRegex.test(issueTitle);
      const isWipTaskList = container.querySelector('.timeline-comment') && container.querySelector('.timeline-comment').querySelector('input[type="checkbox"]:not(:checked)') !== null;
      const noOneApproved = statusMeta.indexOf(oneApproverText) !== -1;
      let isSquashCommits = false;
      for (const commitMessage of container.querySelectorAll('.commit-message')) {
        isSquashCommits = isSquashCommits || commitMessage.textContent.match(/(squash|fixup)!/);
      }

      let isWipTag = false;
      for (const label of container.querySelectorAll('.js-issue-labels .IssueLabel')) {
        isWipTag = isWipTag || label.textContent.match(wipTagRegex);
      }

      disabled = (isWipTitle || isWipTaskList || isSquashCommits || isWipTag || noOneApproved);

      let buttonMessage = '';

      if (localStorage && localStorage.buttonMessage) {
        buttonMessage = localStorage.buttonMessage;
      } else {
        buttonMessage = 'Approve First!!!';
      }

      buttonHtml = disabled ? buttonMessage : 'Merge pull request';
      if (disabled) {
        document.querySelector('.js-admin-merge-override').disabled = true;
        for (const buttonMerge of buttonMerges) {
          buttonMerge.disabled = disabled;
          buttonMerge.innerHTML = buttonHtml;
        }
        for (const buttonMergeOption of buttonMergeOptions) {
          buttonMergeOption.disabled = disabled;
        }
      }

      // unset variables
      container = null;
      issueTitle = null;
      disabled = null;
      buttonMerges = null;
      buttonMergeOptions = null;
      buttonHtml = null;
      buttonMessage = null;
      localStorage = null;
      isSquashCommits = null;
      isWipTag = null;

      setTimeout(changeMergeButtonState, 1000);
    });
  }

  changeMergeButtonState();
})();
