const { withProjectBuildGradle } = require("@expo/config-plugins");

const withPhonePe = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents) {
      return config;
    }

    const buildGradleContent = config.modResults.contents;

    // Check if the repository is already added
    if (!buildGradleContent.includes("phonepe-intentsdk-android")) {
      // Find the allprojects { repositories { section
      const allProjectsIndex = buildGradleContent.indexOf("allprojects {");

      if (allProjectsIndex !== -1) {
        // Find where to insert our maven repository
        const repositoriesIndex = buildGradleContent.indexOf(
          "repositories {",
          allProjectsIndex
        );

        if (repositoriesIndex !== -1) {
          // Find the closing brace of repositories section
          const openingBraceIndex = buildGradleContent.indexOf(
            "{",
            repositoriesIndex
          );

          if (openingBraceIndex !== -1) {
            // Insert the PhonePe repository
            const updatedContent =
              buildGradleContent.substring(0, openingBraceIndex + 1) +
              '\n        maven {\n            url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"\n        }' +
              buildGradleContent.substring(openingBraceIndex + 1);

            config.modResults.contents = updatedContent;
          }
        }
      }
    }

    return config;
  });
};

module.exports = withPhonePe;
