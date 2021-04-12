export default {
  addLog(state, msg) {
    state.logs.unshift({
      msg,
      date: Date.now()
    })
  }
}