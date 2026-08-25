#!/usr/bin/env node

const fs = require("fs");
const { spawn } = require("child_process");

const GRADLE_HOME = "/data/data/com.termux/files/usr/opt/gradle";
const VERSION = "9.6.0";

const JAVA = process.env.JAVA_HOME
  ? `${process.env.JAVA_HOME}/bin/java`
  : "java";

const MAIN_JAR =
  `${GRADLE_HOME}/lib/gradle-gradle-cli-main-${VERSION}.jar`;

const AGENT_JAR =
  `${GRADLE_HOME}/lib/agents/gradle-instrumentation-agent-${VERSION}.jar`;

if (!fs.existsSync(MAIN_JAR)) {
  console.error(`ERROR: Gradle CLI JAR not found:\n${MAIN_JAR}`);
  process.exit(1);
}

const args = [
  "-Xmx64m",
  "-Xms64m",
];

if (fs.existsSync(AGENT_JAR)) {
  args.push(`-javaagent:${AGENT_JAR}`);
}

args.push(
  "-Dorg.gradle.appname=gradle",
  "-jar",
  MAIN_JAR,
  ...process.argv.slice(2)
);

const child = spawn(JAVA, args, {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env
});

child.on("error", (error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
