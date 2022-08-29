(() => {
  'use strict';

  async function changeMergeButtonState() {
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
    let container = document.querySelector('#js-repo-pjax-container');
    let issueTitle = container.querySelector('.js-issue-title').textContent;
    let statusMeta = document.querySelector('.status-meta').textContent;
    let buttonMerges = container.querySelectorAll('.merge-message button[data-details-container]');
    let buttonMergeOptions = container.querySelectorAll('.merge-message button[data-details-container] + .select-menu-button');
    let disabled = false;
    let buttonHtml = '';

    const oneApproverText = 'At least 1 approving review is required';
    const oneApproverText2 = '1 review requesting changes';

    const noOneApproved = statusMeta.indexOf(oneApproverText) !== -1 || statusMeta.indexOf(oneApproverText2) !== -1;
    disabled = noOneApproved;

    buttonHtml = disabled ? 'Approve First!!!' : 'Merge pull request';
    if (disabled && document.querySelector('input.js-admin-merge-override') !== null) {
      document.querySelector('input.js-admin-merge-override').checked = false;
      document.querySelector('input.js-admin-merge-override').disabled = true;
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

    setTimeout(changeMergeButtonState, 1000);
  }
  document.addEventListener('click', function handleClick(event) {
    event.target.classList.add('js-admin-merge-override');
    changeMergeButtonState();
  });
  changeMergeButtonState();
})();
