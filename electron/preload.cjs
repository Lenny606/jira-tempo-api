const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// Tempo API Bridge
window.tempoApi = {
  listWorklogs: (params) => ipcRenderer.invoke('tempo:listWorklogs', params),
  createWorklog: (payload) => ipcRenderer.invoke('tempo:createWorklog', payload),
  updateWorklog: (id, payload) => ipcRenderer.invoke('tempo:updateWorklog', { id, payload }),
  deleteWorklog: (id) => ipcRenderer.invoke('tempo:deleteWorklog', id),
};
