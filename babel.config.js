module.exports = {
  plugins: [
    [
      "babel-plugin-import",
      {
        libraryName: "@mui/material",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "core",
    ],
    [
      "babel-plugin-import",
      {
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "icons",
    ],
  ],
};
