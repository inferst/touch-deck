export default (api) => {
  return {
    name: "hello",

    init() {
      api.log("Hello plugin initialized");
    },

    onEvent(event, data) {
      if (event === "greet") {
        api.log("Hello plugin received event: greet");
      }
    },
  };
};
