function formatUrl() {
  var url = document.getElementById('txtUrl').value;
  var params = document.getElementById('params').value;
  var formatted = url.replace("{0}", params);

  // TODO foreach here over multiple parameters

  return formatted;
}

function openUrl() {
  var formattedUrl = formatUrl();
  var newTab = document.getElementById('ckNewTab').checked;
  if (newTab) {
    chrome.tabs.create({url: formattedUrl});    
  } else {
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
      chrome.tabs.update(tab.id, {url: formattedUrl});
    });
  } 
}

document.getElementById('btnSubmit').onclick = openUrl;
document.getElementById('params').onkeydown = function(e) {
  if (e.keyCode == 13) {
    openUrl();
  } else {
    document.getElementById('lblPreview').innerHTML = formatUrl();
  }
};  

document.getElementById('ckNewTab').onclick = function() {
  var newTab = document.getElementById('ckNewTab').checked;
  chrome.storage.local.set({'new_tab': newTab}, function() {
    console.log('saved new_tab setting');
  });
};

document.getElementById('txtUrl').onkeydown = function(e) {
  var currentValue = document.getElementById('txtUrl').value;
  chrome.storage.local.set({'original_url': currentValue}, function() {
    console.log('saved original_url setting');
  });
}

var newTabChecked = chrome.storage.local.get('new_tab', function(obj) {
  console.log("loading settings");
  console.log(obj['new_tab']);
  if (obj['new_tab'] == true) {
    document.getElementById('ckNewTab').checked = true;
  }
});

var originalUrl = chrome.storage.local.get('original_url', function(obj) {
  document.getElementById('txtUrl').value = obj['original_url'];
});